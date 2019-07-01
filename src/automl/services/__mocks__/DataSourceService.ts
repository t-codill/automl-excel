import { Models } from "@azure/storage-blob";
import { sampleStorageBlob } from "../../../__data__/sampleStorageBlob";

export class DataSourceService {
    public async listBlob(): Promise<Models.BlobItem[] | undefined> {

        return [sampleStorageBlob, sampleStorageBlob];
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
