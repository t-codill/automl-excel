import { TransferProgressEvent } from "@azure/ms-rest-js";
import { BlockBlobURL, Models } from "@azure/storage-blob";

import { blob2string } from "../common/utils/blob2string";
import { csv, ICsvData } from "../common/utils/csv";
import { stream2string } from "../common/utils/stream2string";
import { IServiceBaseProps } from "./ServiceBase";
import { IServiceBaseBlobProps, ServiceBaseBlob } from "./ServiceBaseBlob";

export interface IBlockBlobServiceProps extends IServiceBaseBlobProps {
    blob: Models.BlobItem;
}

const blockSize = 5000;

export class BlockBlobService extends ServiceBaseBlob<BlockBlobURL> {
    private readonly blob: Models.BlobItem;

    constructor(props: IServiceBaseProps, blobProps: IBlockBlobServiceProps) {
        super(props, blobProps, BlockBlobURL, blobProps.blob);
        this.blob = blobProps.blob;
    }

    public async previewBlob(hasHeader: boolean, previewLines: number): Promise<ICsvData | undefined> {
        let content = "";
        const totalLines = previewLines + 1;
        let csvData = csv("", hasHeader, totalLines);
        for (let i = 0; i * blockSize < (this.blob.properties.contentLength || 0); i++) {
            const section = await this.downloadBlob(i * blockSize, blockSize);
            if (section === undefined) {
                return undefined;
            }
            content += section;
            csvData = csv(content, hasHeader, totalLines);
            if (csvData.data.length >= totalLines) {
                break;
            }
        }
        if (csvData.data && csvData.data.length > previewLines) {
            csvData.data.pop();
        }
        return csvData;
    }

    public async uploadBlob(
        file: File,
        percentUpdate: (percent: number) => void
    ): Promise<Models.BlockBlobUploadHeaders | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.upload(this.getAborter(abortSignal), file, file.size, {
                progress: (e: TransferProgressEvent) => { percentUpdate(e.loadedBytes / file.size); }
            });
        });
    }

    public async downloadBlob(from: number, count: number): Promise<string | undefined> {
        const downloadLength = Math.min((this.blob.properties.contentLength || 0) - from, count);
        const content = await this.send(async (client, abortSignal) => {
            return client.download(this.getAborter(abortSignal), from, downloadLength);
        });
        if (!content) {
            return undefined;
        }
        const blob = await content.blobBody;
        if (blob) {
            return blob2string(blob);
        }
        if (content.readableStreamBody) {
            return stream2string(content.readableStreamBody);
        }
        return undefined;
    }
}
