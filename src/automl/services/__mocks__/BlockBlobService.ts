import { Models } from "@azure/storage-blob";
import { ICsvData } from "../../common/utils/csv";

export class BlockBlobService {
    public async previewBlob(): Promise<ICsvData | undefined> {
        return {
            hasHeader: true,
            header: ["a", "b", "c"],
            data: [{
                a: 1,
                b: 2,
                c: 3
            }],
            delimiter: ","
        };
    }

    public async uploadBlob(): Promise<Models.BlockBlobUploadHeaders | undefined> {
        return {
            requestId: "requestId"
        };
    }

    public async downloadBlob(): Promise<string | undefined> {
        return "Test Blob Content";
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
