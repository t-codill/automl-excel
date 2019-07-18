import { IServiceBaseProps } from "../../automl/services/ServiceBase";
import * as React from 'react'
import { WorkspaceError } from "../../automl/common/context/IWorkspaceProps";
import { NotImplementedError } from "../../automl/common/NotImplementedError";
import { WorkspaceFlight } from "../../automl/common/context/WorkspaceFlight";
import { Logger } from "../../automl/common/utils/logger";
import { PageNames } from "../../automl/common/PageNames";
import { SubscriptionModels } from "@azure/arm-subscriptions";
import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";

export interface IAppContextProps{
    serviceBaseProps: IServiceBaseProps;
    subscriptionList: SubscriptionModels.Subscription[];
    workspaceList: AzureMachineLearningWorkspacesModels.Workspace[];
    setToken: (token: string) => void;
    updateToken: () => void;
    updateSubscriptionList: () => Promise<void>;
    updateWorkspaceList: () => Promise<void>;
}

export const appContextDefaults: IAppContextProps = {
    serviceBaseProps: {
        logger: new Logger("development"),
        onError(err: WorkspaceError){ throw new NotImplementedError(); },
        discoverUrls: {},
        location: "",
        pageName: PageNames.Unknown,
        flight: new WorkspaceFlight(""),
        theme: "light",
        getToken(){ throw new NotImplementedError(); },
        setPageName() { throw new NotImplementedError(); },
        subscriptionId: "",
        resourceGroupName: "",
        workspaceName: ""
    },
    subscriptionList: null,
    workspaceList: null,
    setToken(token){},
    updateToken(){},
    async updateSubscriptionList(){

    },
    async updateWorkspaceList(){

    }
}

export const AppContext = React.createContext<IAppContextProps>(appContextDefaults);