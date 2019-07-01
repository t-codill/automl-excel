import { ContainerURL, Models } from "@azure/storage-blob";
import { IServiceBaseProps } from "./ServiceBase";
import { IServiceBaseBlobProps, ServiceBaseBlob } from "./ServiceBaseBlob";

export class DataSourceService extends ServiceBaseBlob<ContainerURL> {
    constructor(props: IServiceBaseProps, blobProps: IServiceBaseBlobProps) {
        super(props, blobProps, ContainerURL);
    }
    public async listBlob(): Promise<Models.BlobItem[] | undefined> {

        return this.getAllWithNext<Models.BlobItem, Models.ListBlobsFlatSegmentResponse, string>
            (async (client, abortSignal) => {
                return client.listBlobFlatSegment(this.getAborter(abortSignal));
            },
                async (client, abortSignal, nextLink) => {
                    return client.listBlobFlatSegment(this.getAborter(abortSignal), nextLink);
                },
                (res) => res.segment.blobItems,
                (res) => res.nextMarker);
    }
}
