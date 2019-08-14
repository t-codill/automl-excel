import { AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";
import { IModelDeployResponse } from "../ModelManagementService";

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

    public async getDeployStatus(): Promise<AzureMachineLearningModelManagementServiceModels.AsyncOperationStatus | undefined> {
        return undefined;
    }

    public async getScoringUriById(
        _serviceId: string
    ): Promise<string | undefined> {
        return undefined;
    }

    public async getDeployListByRunId(): Promise<AzureMachineLearningModelManagementServiceModels.ServiceResponseBaseUnion[] | undefined> {
        return undefined;
    }

    public async createDeployment(): Promise<IModelDeployResponse | undefined> {
        return {
            operationId: "testOperationId",
            status: 202
        };
    }

    public async getDeployLogs(
        _serviceId: string
    ): Promise<string | undefined> {
        return "TestLog";
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
