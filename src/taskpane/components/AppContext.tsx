import * as React from 'react';
import { SubscriptionModels } from "@azure/arm-subscriptions";
import { TokenCredentials } from "@azure/ms-rest-js";
import { AzureMachineLearningWorkspaces, AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { uniqBy, orderBy } from 'lodash';
import { ResourceManagementClient, ResourceManagementModels } from '@azure/arm-resources';
import { ResourceGroup } from '@azure/arm-resources/esm/models';
import { IServiceBaseProps } from '../../automl/services/ServiceBase';
import { WorkspaceFlight } from '../../automl/common/context/WorkspaceFlight';
import { JasmineService } from '../../automl/services/JasmineService';
import { WorkSpaceService } from '../../automl/services/WorkSpaceService';
import { DataStoreService } from '../../automl/services/DataStoreService';
import { PageNames } from '../../automl/common/PageNames';
import { Logger } from '../../automl/common/utils/logger';
import { StorageService } from '../../automl/services/StorageService';
import { RunHistoryService, IRunDtoWithExperimentName } from '../../automl/services/RunHistoryService';
import { ModelManagementService } from '../../automl/services/ModelManagementService';
import { ResourceService } from '../../automl/services/ResourceService';
import { SubscriptionService } from '../../automl/services/SubscriptionService';

const availableServiceTypes = [
    JasmineService,
    WorkSpaceService,
    DataStoreService,
    StorageService,
    RunHistoryService,
    ModelManagementService,
    ResourceService,
    SubscriptionService
];

/* Singleton global state for app */
export class AppContextState{

    /* Current selected subscription ID */
    subscriptionId: string = localStorage.getItem("subscriptionId") || null;

    /* List of available subscriptions */
    subscriptionList: SubscriptionModels.Subscription[] = null;

    /* List of available workspaces */
    workspaceList: AzureMachineLearningWorkspacesModels.Workspace[] = null;

    /* Azure API token */
    token: string = null;

    /* Current selected workspace. Shared between create model and use model */
    workspace: AzureMachineLearningWorkspacesModels.Workspace = null;

    /* String to Jasmine services map */
    services: any = {};

    /* Method to update context state while triggering update to app state */
    update: (newContext: Partial<AppContextState>) => Promise<AppContextState>;

    resourceGroupName(): string{
        return this.workspace.id.split("resourceGroups/")[1].split("/")[0];
    }

    getServiceBaseProps(): IServiceBaseProps{
        let context = appContextDefaults;
        let location = context.workspace !== null ? context.workspace.location : "eastus";

        let props: IServiceBaseProps = {
            logger: new Logger("development"),
            onError(err){
                console.log("Error:");
                console.log(err);
            },
            discoverUrls: {
                history: "https://" + location + ".experiments.azureml.net"
            },
            location: context.workspace !== null ? context.workspace.location : "eastus",
            pageName: PageNames.Unknown,
            flight: new WorkspaceFlight(""),
            theme: "",
            getToken: () => {
                return context.token;
            },
            setPageName(){
                return null;
            },
            subscriptionId: context.subscriptionId,
            resourceGroupName: context.workspace !== null ? context.resourceGroupName() : "",
            workspaceName: context.workspace !== null ? context.workspace.name : ""
        };

        return props;
    };

    async createServices(){
        let services = {}
        
        let serviceBaseProps: IServiceBaseProps = this.getServiceBaseProps();

        availableServiceTypes.forEach(serviceClass => {
            try{
                services[serviceClass.name] = new serviceClass(serviceBaseProps);
            }catch(err){
                console.log(`Error creating service ${serviceClass.name}:`);
                console.error(err);
            }
        });
        return services;
    };

    async setToken(token){
        console.log('Setting token to '.concat(token));
        await this.update({token: token});
        await this.update({services: await this.createServices()})
    };

    async setSubscriptionId(subscriptionId: string){
        console.log("Setting subscription id to ".concat(subscriptionId));
        await this.update({subscriptionId: subscriptionId, workspaceList: null});
        await this.update({services: await this.createServices()});
        localStorage.setItem("subscriptionId", subscriptionId);
    }
    
    async setWorkspace(workspace: AzureMachineLearningWorkspacesModels.Workspace){
        await this.update({workspace});
        await this.update({services: await this.createServices()})
    }

    async listRunsWithStatuses(statuses?: string[]): Promise<IRunDtoWithExperimentName[]>{
        /*
        let runService: RunHistoryService = this.services[RunHistoryService.name];

        let experimentMap = {};
        let runs = await runService.getRunList();
        
        for(var coleman = 0; coleman < runs.length; coleman++){
            let run = runs[coleman];
            let previous = experimentMap[run.experimentId];
            if((statuses === undefined || statuses.includes(run.status)) && run.runType === "automl" && (previous === undefined || previous.startTimeUtc.getTime() < run.startTimeUtc.getTime())){
                experimentMap[run.experimentId] = run;
            }
        }

        return Object.values(experimentMap);
        */

        return (await this.listLatestRuns()).filter((run: IRunDtoWithExperimentName) => {
            return statuses.includes(run.status);
        });
    }

    async listLatestRuns(): Promise<IRunDtoWithExperimentName[]>{
        let runService: RunHistoryService = this.services[RunHistoryService.name];

        let experimentMap = {};
        let runs = await runService.getRunList();
        
        for(var coleman = 0; coleman < runs.length; coleman++){
            let run = runs[coleman];
            let previous = experimentMap[run.experimentId];
            if(run.runType === "automl" && (previous === undefined || previous.startTimeUtc.getTime() < run.startTimeUtc.getTime())){
                experimentMap[run.experimentId] = run;
            }
        }

        return Object.values(experimentMap);
    }

    async listTrainedRuns(): Promise<IRunDtoWithExperimentName[]>{
        return await this.listRunsWithStatuses(["Completed"]);
    }

    async listTrainingRuns(): Promise<IRunDtoWithExperimentName[]>{
        return await this.listRunsWithStatuses(["Queued", "Preparing", "Running"]);
    }

    async createWorkspace(workspaceName: string, resourceGroupName: string, location?: string): Promise<ResourceManagementModels.DeploymentExtended | undefined>{
        if(!location) location = "eastus";
        
        let resourceService: ResourceService = this.services[ResourceService.name];
        return await resourceService.createWorkspace(workspaceName, resourceGroupName, location);
    }

    async updateSubscriptionList(){
        let subscriptionService: SubscriptionService = this.services[SubscriptionService.name];
        let subscriptionList = await subscriptionService.listSubscriptions();

        try{
            await this.update({
                subscriptionList: subscriptionList
            });

        }catch(err){
            console.log("Error when updating subscription list:");
            console.log(err);
        }
    }

    async getResourceGroupsBySubscription(subscriptionId){
        let resourceClient = new ResourceManagementClient(new TokenCredentials(this.token), subscriptionId);
        
        let currentList = await resourceClient.resourceGroups.list();
        let fullList: ResourceGroup[] = currentList; 
        while(currentList.nextLink){
            currentList = await resourceClient.resourceGroups.listNext(currentList.nextLink);
            fullList = [...fullList, ...currentList];
        }
        return fullList;
    }

    async getWorkspace(resourceGroupName, workspaceName): Promise<AzureMachineLearningWorkspacesModels.Workspace>{
        let client = new AzureMachineLearningWorkspaces(new TokenCredentials(this.token), this.subscriptionId);
        return (await client.workspaces.get(resourceGroupName, workspaceName));
    }

    async getWorkspacesBySubscription(subscriptionId): Promise<AzureMachineLearningWorkspacesModels.Workspace[]>{
        if(subscriptionId === null) return [];

        let workspaceClient = new AzureMachineLearningWorkspaces(new TokenCredentials(this.token), subscriptionId);
        
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
    }

    async updateWorkspaceList(){
        await this.update({
            workspaceList: await this.getWorkspacesBySubscription(this.subscriptionId)
        });
        
        /* Default to automl-workspace if it exists and no workspace has been chosen yet */
        if(this.workspace === null){
            let filtered: AzureMachineLearningWorkspacesModels.Workspace[] = this.workspaceList.filter((workspace: AzureMachineLearningWorkspacesModels.Workspace) => workspace.friendlyName === "automl-excel");

            console.log("filtered:");
            console.log(filtered);
            
            if(filtered.length > 0){
                console.log("setting default to ");
                console.log(filtered[0]);
                await this.setWorkspace(filtered[0]);
            }
            
        }
    }
}
export const appContextDefaults = new AppContextState();
export const AppContext = React.createContext<AppContextState>(appContextDefaults);