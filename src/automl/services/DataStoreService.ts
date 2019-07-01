import { StorageManagementModels } from "@azure/arm-storage";
import { AzureMachineLearningDatastoreManagementClient, AzureMachineLearningDatastoreManagementModels } from "@vienna/datastore";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class DataStoreService extends ServiceBaseNonArm<AzureMachineLearningDatastoreManagementClient> {
    constructor(props: IServiceBaseProps) {
        super(props, AzureMachineLearningDatastoreManagementClient, props.discoverUrls.history);
    }
    public async list(): Promise<AzureMachineLearningDatastoreManagementModels.DataStoreDto[] | undefined> {
        return this.getAllValuesWithContinuationToken(async (client, abortSignal, continuationtoken) => {
            return client.dataStore.list(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal,
                continuationtoken
            });
        });
    }

    public async getDefault(): Promise<AzureMachineLearningDatastoreManagementModels.DataStoreDto | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.dataStore.getDefault(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        }, false);
    }

    public async add(container: StorageManagementModels.ListContainerItem, account: StorageManagementModels.StorageAccount, key: string): Promise<string | undefined> {
        if (!container.name
            || !account.name
            || !account.primaryEndpoints
            || !account.primaryEndpoints.blob
            || !key) {
            return undefined;
        }
        const dataStoreName = `${account.name}__${container.name}`.replace(/\W/ig, "_");
        const dto: AzureMachineLearningDatastoreManagementModels.DataStoreDto = {
            name: dataStoreName,
            dataStoreType: "AzureBlob",
            hasBeenValidated: false,
            azureStorageSection: {
                accountName: account.name,
                containerName: container.name,
                credential: key,
                credentialType: "Sas",
                endpoint: undefined,
                isSas: true,
                protocol: "https",
                sasToken: key
            }
        };

        const existing = await this.trySend(async (client, abortSignal) => {
            return client.dataStore.get(dataStoreName, this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        }, true);

        if (existing === undefined) {
            return undefined;
        }

        if (existing) {
            await this.send(async (client, abortSignal) => {
                return client.dataStore.update(dataStoreName, this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                    abortSignal,
                    createIfNotExists: true,
                    dto
                });
            }, false);
        }
        else {
            await this.send(async (client, abortSignal) => {
                return client.dataStore.create(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                    abortSignal,
                    createIfNotExists: true,
                    dto
                });
            }, false);
        }
        return dataStoreName;
    }

}
