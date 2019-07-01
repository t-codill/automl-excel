import { AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";

export class ModelManagementService {

    public async createAsset(): Promise<AzureMachineLearningModelManagementServiceModels.Asset | undefined> {
        return {
            id: "asset-id",
            name: "asset-name"
        };
    }

    public async registerModel(): Promise<AzureMachineLearningModelManagementServiceModels.Model | undefined> {
        return {
            id: "model-id",
            name: "model-name",
            url: "http://www.dummyurl.com/dummy",
            mimeType: "model-mimeType"
        };
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
