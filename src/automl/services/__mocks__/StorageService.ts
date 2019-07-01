import { StorageManagementModels } from "@azure/arm-storage";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";

export class StorageService {

    public async getAccount(): Promise<StorageManagementModels.StorageAccount | undefined> {
        return sampleStorageAccount;
    }

    public async getContainer(): Promise<StorageManagementModels.BlobContainer | undefined> {
        return sampleStorageContainer;
    }

    public async listAccount(): Promise<StorageManagementModels.StorageAccount[] | undefined> {
        return [sampleStorageAccount, sampleStorageAccount];
    }

    public async listContainer(): Promise<StorageManagementModels.ListContainerItems | undefined> {
        return { value: [sampleStorageContainer] };
    }

    public async getSasToken(): Promise<StorageManagementModels.ListAccountSasResponse | undefined> {
        return { accountSasToken: "sampleToken" };

    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
