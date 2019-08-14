import { AzureMachineLearningModelManagementService, AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";
import { v4 as uuid4 } from "uuid";
import { getServiceCommonUrl } from "../common/utils/getServiceCommonUrl";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

const version = "1.0";

export interface IModelDeployResponse {
    operationId: string | null;
    status: number;
}
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

    public async createDeployment(
        name: string,
        description: string | undefined,
        runId: string,
        modelId: string,
        condaFileUrl: string,
        scoringFileName: string,
        scoringFileUrl: string
    ): Promise<IModelDeployResponse | undefined> {
        const payload = {
            name,
            description: description || "",
            tags: [
                "AutoML",
                "Web",
                runId
            ],
            computeType: "ACI",
            imageRequest: {
                name: `${name}-image`,
                driverProgram: scoringFileName,
                modelIds: [modelId],
                assets: [{
                    id: scoringFileName,
                    mimeType: "application/x-python",
                    url: scoringFileUrl
                }],
                targetRuntime: {
                    runtimeType: "Python",
                    properties: {
                        condaEnvFile: condaFileUrl
                    }
                },
                imageType: "Docker"
            }
        };
        return this.send(async (_client, abortSignal) => {
            const baseUrl = this.geBaseUrl();
            const url = `${baseUrl}/services`;
            const response = await window.fetch(new Request(url, {
                method: "POST",
                signal: abortSignal,
                body: JSON.stringify(payload),
                headers: {
                    authorization: `Bearer ${this.props.getToken()}`,
                    "content-type": "application/json",
                    "x-ms-client-user-type": "AutoML WebUser",
                    "x-ms-client-request-id": uuid4(),
                    "x-ms-client-session-id": this.props.logger.getSessionId()
                }
            }));
            const status = response.status;
            const operationLocation = response.headers.get("operation-location");
            let operationId = null;
            // tslint:disable-next-line: max-line-length
            const prefix = `/api/subscriptions/${this.props.subscriptionId}/resourceGroups/${this.props.resourceGroupName}/providers/Microsoft.MachineLearningServices/workspaces/${this.props.workspaceName}/operations/`;
            if (operationLocation && operationLocation.startsWith(prefix)) {
                operationId = operationLocation.replace(prefix, "");
            }
            const result: IModelDeployResponse = {
                status,
                operationId
            };
            return result;
        });
    }

    public async getDeployStatus(
        operationId: string
    ): Promise<AzureMachineLearningModelManagementServiceModels.AsyncOperationStatus | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.operations.get(operationId, version, this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        });
    }

    public async getDeployListByRunId(
        runId: string | undefined
        // tslint:disable-next-line: no-any
    ): Promise<any[] | undefined> {
        if (!runId) {
            return undefined;
        }
        const result = await this.getAllWithNext<
            AzureMachineLearningModelManagementServiceModels.ServiceResponseBaseUnion,
            AzureMachineLearningModelManagementServiceModels.ServicesListQueryResponse,
            string>(
                async (client, abortSignal) => {
                    return client.services.listQuery(version, this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                        tag: runId,
                        abortSignal
                    });
                },
                async (client, abortSignal, continuationToken) => {
                    return client.services.listQuery(version, this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                        tag: runId,
                        abortSignal,
                        skipToken: continuationToken
                    });
                },
                (res) => res.value,
                (res) => {
                    if (!res.nextLink) {
                        return undefined;
                    }
                    const url = new URL(res.nextLink);
                    return url.searchParams.get("$skipToken") || undefined;
                }
            );
        return result;
    }

    public async getScoringUriById(
        serviceId: string
    ): Promise<string | undefined> {
        // tslint:disable-next-line: no-any
        const res: any = await this.send(async (client, abortSignal) => {
            return client.services.queryById(serviceId, "1.0", this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        });
        if (!res) {
            return undefined;
        }
        return res.scoringUri;
    }

    public async getDeployLogs(
        serviceId: string
    ): Promise<string | undefined> {
        return this.send(async (_client, abortSignal) => {
            const baseUrl = this.geBaseUrl();
            const url = `${baseUrl}/services/${serviceId}/logs/`;
            const response = await window.fetch(new Request(url, {
                method: "GET",
                signal: abortSignal,
                headers: {
                    authorization: `Bearer ${this.props.getToken()}`,
                    "content-type": "application/json",
                    "x-ms-client-user-type": "AutoML WebUser",
                    "x-ms-client-request-id": uuid4(),
                    "x-ms-client-session-id": this.props.logger.getSessionId()
                }
            }));
            const body = await response.json();
            return body.content;
        });
    }

    private geBaseUrl(): string {
        const prefix = `${this.props.discoverUrls.modelmanagement}/modelmanagement/v1.0`;
        const commonUrl = getServiceCommonUrl(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName);
        return `${prefix}${commonUrl}`;
    }
}
