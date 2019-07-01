import { AzureMachineLearningDatastoreManagementModels } from "@vienna/datastore";
import { sampleDataStore } from "../__data__/sampleDataStore";

export class DataStoreService {
    public async list(): Promise<AzureMachineLearningDatastoreManagementModels.DataStoreDto[] | undefined> {
        return [sampleDataStore, sampleDataStore];
    }

    public async getDefault(): Promise<AzureMachineLearningDatastoreManagementModels.DataStoreDto | undefined> {
        return sampleDataStore;
    }

    public async add(): Promise<string | undefined> {
        return "dataStoreName";
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }

}
