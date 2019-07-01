import { HttpRequestBody } from "@azure/ms-rest-js";
import { Aborter, BlockBlobURL, IBlockBlobUploadOptions, Models } from "@azure/storage-blob";
import { PassThrough } from "stream";
import { restCanceledError } from "../../__data__/restCanceledError";
import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../__data__/sampleStorageContainer";
import { testContext } from "../common/context/__data__/testContext";
import { largeCsv, sampleCsv } from "./__data__/sampleCsv";
import { BlockBlobService } from "./BlockBlobService";

jest.mock("@azure/storage-blob");

const service: BlockBlobService = new BlockBlobService(testContext, {
    account: sampleStorageAccount,
    blob: sampleStorageBlob,
    container: sampleStorageContainer,
    sasToken: "sampleSasToken"
});
let downloadSpy: jest.SpyInstance;

const sampleCsvBlobDownloadResponse = {
    blobBody: Promise.resolve(new Blob([sampleCsv]))
};
const largeCsvBlobDownloadResponse = {
    blobBody: Promise.resolve(new Blob([largeCsv]))
};

describe("BlockBlobService", () => {
    beforeEach(() => {
        downloadSpy = jest.spyOn(BlockBlobURL.prototype, "download");
    });
    it("should use content length as download size, if passed in size  is larger", async () => {
        const response = await service.downloadBlob(0, 5000);
        expect(downloadSpy)
            .toBeCalled();
        expect(downloadSpy.mock.calls[0][2])
            .toBe(1000);
        expect(response)
            .toBe("sampleBlob");
    });
    it("should use passed in size as download size, if it is small", async () => {
        const response = await service.downloadBlob(0, 50);
        expect(downloadSpy)
            .toBeCalled();
        expect(downloadSpy.mock.calls[0][2])
            .toBe(50);
        expect(response)
            .toBe("sampleBlob");
    });

    it("should return undefined if canceled", async () => {
        downloadSpy.mockImplementation(() => { throw restCanceledError; });
        const result = await service.downloadBlob(0, 5000);
        expect(result)
            .toBeUndefined();
    });
    it("should return undefined without body", async () => {
        downloadSpy.mockReturnValue({});
        const result = await service.downloadBlob(0, 5000);
        expect(result)
            .toBeUndefined();
    });
    it("should request length 0 if content length is not defined", async () => {
        const noContentLengthService = new BlockBlobService(testContext, {
            account: sampleStorageAccount,
            blob: { ...sampleStorageBlob, properties: { ...sampleStorageBlob.properties, contentLength: undefined } },
            container: sampleStorageContainer,
            sasToken: "sampleSasToken"
        });
        await noContentLengthService.downloadBlob(0, 5000);
        expect(downloadSpy.mock.calls[0][2])
            .toBe(0);
    });
    it("should download blob with blob body", async () => {
        const result = await service.downloadBlob(0, 5000);
        expect(result)
            .toBe("sampleBlob");
    });
    it("should download blob with stream body", async () => {
        const readableValue = new PassThrough();
        readableValue.write("sampleStreamBody");
        readableValue.end();
        downloadSpy.mockReturnValue({ readableStreamBody: readableValue });
        const result = await service.downloadBlob(0, 5000);
        expect(result)
            .toBe("sampleStreamBody");
    });

    it("should preview blob return undefined if canceled", async () => {
        downloadSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const result = await service.previewBlob(false, 5);
        expect(result)
            .toBeUndefined();
    });
    it("preview blob with header", async () => {
        downloadSpy.mockReturnValueOnce(sampleCsvBlobDownloadResponse);
        const result = await service.previewBlob(true, 5);
        expect(result)
            .toMatchSnapshot();
    });

    it("preview blob without header", async () => {
        downloadSpy.mockReturnValueOnce(sampleCsvBlobDownloadResponse);
        const result = await service.previewBlob(false, 5);
        expect(result)
            .toMatchSnapshot();
    });

    it("preview blob without data", async () => {
        downloadSpy.mockReturnValueOnce({
            blobBody: Promise.resolve(new Blob([""]))
        });
        const result = await service.previewBlob(false, 5);
        expect(result)
            .toMatchSnapshot();
    });
    it("preview blob without content length", async () => {
        const noContentLengthService = new BlockBlobService(testContext, {
            account: sampleStorageAccount,
            blob: { ...sampleStorageBlob, properties: { ...sampleStorageBlob.properties, contentLength: undefined } },
            container: sampleStorageContainer,
            sasToken: "sampleSasToken"
        });
        downloadSpy.mockReturnValueOnce(largeCsvBlobDownloadResponse);
        const result = await noContentLengthService.previewBlob(true, 5);
        expect(result)
            .toMatchSnapshot();
    });

    it("should upload blob", async () => {
        const spy: jest.SpyInstance<Promise<Models.BlockBlobUploadHeaders>> = jest.spyOn(BlockBlobURL.prototype, "upload");
        spy.mockImplementationOnce(async (
            _aborter: Aborter,
            _body: HttpRequestBody,
            _contentLength: number,
            options: IBlockBlobUploadOptions = {}): Promise<Models.BlockBlobUploadHeaders> => {
            if (options.progress) {
                options.progress({ loadedBytes: 0 });
            }
            return {
                requestId: "requestId"
            };
        });
        const result = await service.uploadBlob(new File(["sampleFileContent"], "sampleFile"), () => { return; });
        expect(spy)
            .toBeCalledTimes(1);
        expect(result)
            .toMatchSnapshot();
    });

});
