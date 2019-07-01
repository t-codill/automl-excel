import { StorageManagementClient, StorageManagementModels } from "@azure/arm-storage";

import moment from "moment";
import { getResourceGroupName } from "../common/utils/getResourceGroupName";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseArm } from "./ServiceBaseArm";

export class StorageService extends ServiceBaseArm<StorageManagementClient> {
    constructor(props: IServiceBaseProps) {
        super(props, StorageManagementClient);
    }

    public async getAccount(
        resourceGroupName: string,
        accountName: string
    ): Promise<StorageManagementModels.StorageAccount | undefined> {
        return this.send(async (client, abortSignal) => {
            return (client.storageAccounts.getProperties(resourceGroupName, accountName, { abortSignal }));
        });
    }

    public async getContainer(
        resourceGroupName: string,
        accountName: string,
        containerName: string
    ): Promise<StorageManagementModels.BlobContainer | undefined> {
        return this.send(async (client, abortSignal) => {
            return (client.blobContainers.get(resourceGroupName, accountName, containerName, { abortSignal }));
        });
    }

    public async listAccount(): Promise<StorageManagementModels.StorageAccount[] | undefined> {
        return this.send(async (client, abortSignal) => {
            return (client.storageAccounts.list({ abortSignal }));
        });
    }

    public async listContainer(account: StorageManagementModels.StorageAccount): Promise<StorageManagementModels.ListContainerItems | undefined> {
        return this.send(async (client, abortSignal) => {
            const resourceGroupName = getResourceGroupName(account.id);
            if (!account.name) {
                return undefined;
            }
            if (!resourceGroupName) {
                return undefined;
            }
            await client.blobServices.setServiceProperties(resourceGroupName, account.name, {
                cors: {
                    corsRules: [{
                        allowedOrigins: [window.location.origin],
                        allowedMethods: ["OPTIONS", "GET", "PUT"],
                        maxAgeInSeconds: 86400,
                        exposedHeaders: ["*"],
                        allowedHeaders: ["*"],
                    }]
                }
            });
            return (client.blobContainers.list(resourceGroupName, account.name, {
                abortSignal
            }));
        });

    }

    public async getSasToken(account: StorageManagementModels.StorageAccount): Promise<StorageManagementModels.ListAccountSasResponse | undefined> {
        return this.send(async (client, abortSignal) => {
            if (!account.name) {
                return undefined;
            }
            const resourceGroupName = getResourceGroupName(account.id);
            if (!resourceGroupName) {
                return undefined;
            }
            const response = await client.storageAccounts.listAccountSAS(resourceGroupName, account.name, {
                // sdk bug
                permissions: "rdwlacup" as StorageManagementModels.Permissions,
                resourceTypes: "sco" as StorageManagementModels.SignedResourceTypes,
                protocols: "https",
                services: "b",
                sharedAccessExpiryTime:
                    moment()
                        .add(1, "year")
                        .toDate()
            }, {
                    abortSignal
                });
            return response;
        });

    }
}
