import { AzureMachineLearningModelManagementService, AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

const version = "1.0";

export class ModelManagementService extends ServiceBaseNonArm<AzureMachineLearningModelManagementService> {
    constructor(props: IServiceBaseProps) {
        super(props, AzureMachineLearningModelManagementService, props.discoverUrls.modelmanagement);
    }

    public async createAsset(
        name: string,
        description: string,
        url: string
    ): Promise<AzureMachineLearningModelManagementServiceModels.Asset | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.assets.create(
                version,
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                {
                    abortSignal,
                    asset: {
                        artifacts: [
                            {
                                prefix: new URL(url).pathname.replace(/^\/azureml\//, "")
                            }
                        ],
                        name,
                        description
                    }
                });
        });
    }

    public async registerModel(
        name: string,
        description: string,
        assetId: string,
        mimeType: string,
        runId: string | undefined,
        experimentName: string
    ): Promise<AzureMachineLearningModelManagementServiceModels.Model | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.mLModels.register(
                {
                    name,
                    url: `aml://asset/${assetId}`,
                    mimeType,
                    description,
                    runId,
                    experimentName
                },
                version,
                this.props.subscriptionId,
                this.props.resourceGroupName,
                this.props.workspaceName,
                {
                    abortSignal
                });
        });
    }
}
