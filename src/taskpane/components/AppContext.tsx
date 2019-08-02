import * as React from 'react';
import { SubscriptionModels, SubscriptionClient } from "@azure/arm-subscriptions";
//import { SubscriptionService } from "../../automl/services/SubscriptionService";
import { TokenCredentials } from "@azure/ms-rest-js";
import { AzureMachineLearningWorkspaces, AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { uniqBy, orderBy } from 'lodash';
import { ResourceManagementClient, ResourceManagementModels } from '@azure/arm-resources';
import { ResourceGroup } from '@azure/arm-resources/esm/models';


export interface IAppContextProps{
    subscriptionId: string;
    subscriptionList: SubscriptionModels.Subscription[];
    workspaceList: AzureMachineLearningWorkspacesModels.Workspace[];
    token: string,
    getToken: () => string;
    setToken: (token: string) => void;
    updateToken: () => void;
    createWorkspace: (workspaceName: string, resourceGroupName: string, location?: string, subscriptionId?: string) => Promise<ResourceManagementModels.DeploymentExtended | undefined>;
    getResourceGroupsBySubscription(subscriptionId: string): Promise<ResourceGroup[]>;
    getWorkspace(resourceGroupName: string, workspaceName: string): Promise<AzureMachineLearningWorkspacesModels.Workspace>;
    getWorkspacesBySubscription(subscriptionId: string): Promise<AzureMachineLearningWorkspacesModels.Workspace[]>;
    updateSubscriptionList: () => Promise<void>;
    updateWorkspaceList: () => Promise<void>;
    update: (newContext: Partial<IAppContextProps>) => Promise<IAppContextProps>;
}

export const appContextDefaults: IAppContextProps = {
    subscriptionId: null,
    subscriptionList: null,
    workspaceList: null,
    token: null,
    getToken(){
        return this.token;
    },
    setToken(token){
        console.log('Setting token to '.concat(token));
        this.update({token: token});
    },
    updateToken(){},
    async createWorkspace(workspaceName: string, resourceGroupName: string, location?: string, subscriptionId?: string){
        if(!location) location = "eastus";
        if(!subscriptionId) subscriptionId = this.subscriptionId;
        let resourceClient = new ResourceManagementClient(new TokenCredentials(this.getToken()), subscriptionId);
        const letterName = workspaceName.replace(/\W/g, "")
            .toLowerCase();
        const keyVaultName = `${letterName}k`;
        const storageName = `${letterName}s`;
        const registriesName = `${letterName}r`;
        const insightsName = `${letterName}i`;

        return await resourceClient.deployments.createOrUpdate(resourceGroupName, workspaceName,
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
                                        subscriptionId
                                        }/resourceGroups/${
                                        resourceGroupName
                                        }/providers/Microsoft.ContainerRegistry/registries/${registriesName}`,
                                    keyVault: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.KeyVault/vaults/${keyVaultName}`,
                                    applicationInsights: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/microsoft.insights/components/${insightsName}`,
                                    friendlyName: workspaceName,
                                    storageAccount: `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${storageName}`
                                }

                            }]
                    },
                    parameters: {},
                    mode: "Incremental"
                }
            });
    },
    async updateSubscriptionList(){
        console.log("Updating subscription list")
        let subscriptionClient = new SubscriptionClient(new TokenCredentials(this.getToken()));
        let subscriptionList = await subscriptionClient.subscriptions.list();
        try{
            await this.update({
                subscriptionList: subscriptionList
            });

        }catch(err){
            console.log("Error when subscription list did things:");
            console.log(err);
        }
    },
    async getResourceGroupsBySubscription(subscriptionId){
        let resourceClient = new ResourceManagementClient(new TokenCredentials(this.getToken()), subscriptionId);
        
        let currentList = await resourceClient.resourceGroups.list();
        let fullList: ResourceGroup[] = currentList; 
        while(currentList.nextLink){
            currentList = await resourceClient.resourceGroups.listNext(currentList.nextLink);
            fullList = [...fullList, ...currentList];
        }
        console.log("Full list");
        console.log(fullList)
        return fullList;
    },
    async getWorkspace(resourceGroupName, workspaceName){
        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.getToken()), this.subscriptionId);
        return (await client.workspaces.get(resourceGroupName, workspaceName));
    },
    async getWorkspacesBySubscription(subscriptionId){
        if(subscriptionId === null) return [];

        let workspaceClient = new AzureMachineLearningWorkspaces(new TokenCredentials(this.getToken()), subscriptionId);
        
        let currentList = (await workspaceClient.workspaces.listBySubscription());
        let fullList: AzureMachineLearningWorkspacesModels.Workspace[] = currentList;
        while(currentList.nextLink){
            currentList = await workspaceClient.workspaces.listBySubscriptionNext(currentList.nextLink);
            fullList = [...fullList, ...currentList];
        }
        
        let unique = uniqBy(fullList, (workspace) => workspace.id);
        let nonEmpty = unique.filter((workspace => workspace.friendlyName != ""));
        let ordered = orderBy(nonEmpty, (workspace => workspace.friendlyName));
        return ordered;
    },
    async updateWorkspaceList(){

        await this.update({
            workspaceList: await this.getWorkspacesBySubscription(this.subscriptionId)
        });
    },
    async update(newContext: Partial<IAppContextProps>){
        return this;
    }
}

export const AppContext = React.createContext<IAppContextProps>(appContextDefaults);