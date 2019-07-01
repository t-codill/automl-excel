import { ResourceManagementClient, ResourceManagementModels } from "@azure/arm-resources";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseArm } from "./ServiceBaseArm";

export class ResourceService extends ServiceBaseArm<ResourceManagementClient> {
    constructor(props: IServiceBaseProps) {
        super(props, ResourceManagementClient);
    }

    public async createResourcesGroup(resourceGroupName: string,
        location: string
    ): Promise<ResourceManagementModels.ResourceGroup | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.resourceGroups.createOrUpdate(resourceGroupName, {
                location
            }, { abortSignal });
        });
    }

    public async createWorkspace(
        workspaceName: string,
        resourceGroupName: string,
        location: string
    ): Promise<ResourceManagementModels.DeploymentExtended | undefined> {
        const letterName = workspaceName.replace(/\W/g, "")
            .toLowerCase();
        const keyVaultName = `${letterName}k`;
        const storageName = `${letterName}s`;
        const registriesName = `${letterName}r`;
        const insightsName = `${letterName}i`;
        return this.send(async (client, abortSignal) => {
            return client.deployments.createOrUpdate(resourceGroupName, workspaceName,
                {
                    properties:
                    {
                        template:
                        {
                            $schema: "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                            contentVersion: "1.0.0.0",
                            parameters: {},
                            variables: {},
                            resources: [
                                {
                                    type: "Microsoft.KeyVault/vaults",
                                    name: keyVaultName,
                                    apiVersion: "2015-06-01",
                                    location,
                                    dependsOn: [],
                                    properties:
                                    {
                                        enabledForDeployment: "true",
                                        enabledForTemplateDeployment: "true",
                                        enabledForVolumeEncryption: "true",
                                        tenantId: "72f988bf-86f1-41af-91ab-2d7cd011db47",
                                        accessPolicies: [],
                                        sku: { name: "Standard", family: "A" }
                                    }
                                },
                                {
                                    type: "Microsoft.Storage/storageAccounts",
                                    name: storageName,
                                    apiVersion: "2016-12-01",
                                    location,
                                    sku: { name: "Standard_LRS" },
                                    kind: "Storage",
                                    dependsOn: [],
                                    properties: {
                                        encryption: {
                                            services: { blob: { enabled: "true" } },
                                            keySource: "Microsoft.Storage"
                                        },
                                        supportsHttpsTrafficOnly: true
                                    }
                                },
                                {
                                    type: "Microsoft.ContainerRegistry/registries",
                                    name: registriesName,
                                    apiVersion: "2017-10-01",
                                    location,
                                    sku: { name: "Standard", tier: "Standard" },
                                    properties: { adminUserEnabled: "true" }
                                },
                                {
                                    type: "microsoft.insights/components",
                                    name: insightsName,
                                    kind: "web",
                                    apiVersion: "2015-05-01",
                                    location: "eastus",
                                    properties: { Application_Type: "web" }
                                },
                                {
                                    type: "Microsoft.MachineLearningServices/workspaces",
                                    name: workspaceName,
                                    apiVersion: "2018-11-19",
                                    identity: { type: "systemAssigned" },
                                    location,
                                    resources: [],
                                    dependsOn: [
                                        `[resourceId('Microsoft.KeyVault/vaults', '${keyVaultName}')]`,
                                        `[resourceId('Microsoft.Storage/storageAccounts', '${storageName}')]`,
                                        `[resourceId('Microsoft.ContainerRegistry/registries', '${registriesName}')]`,
                                        `[resourceId('microsoft.insights/components', '${insightsName}')]`
                                    ],
                                    properties: {
                                        containerRegistry: `/subscriptions/${
                                            this.props.subscriptionId
                                            }/resourceGroups/${
                                            resourceGroupName
                                            }/providers/Microsoft.ContainerRegistry/registries/${registriesName}`,
                                        keyVault: `/subscriptions/${this.props.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.KeyVault/vaults/${keyVaultName}`,
                                        applicationInsights: `/subscriptions/${this.props.subscriptionId}/resourceGroups/${resourceGroupName}/providers/microsoft.insights/components/${insightsName}`,
                                        friendlyName: workspaceName,
                                        storageAccount: `/subscriptions/${this.props.subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageName}`
                                    }

                                }]
                        },
                        parameters: {},
                        mode: "Incremental"
                    }
                }
                , { abortSignal });
        });
    }
}
