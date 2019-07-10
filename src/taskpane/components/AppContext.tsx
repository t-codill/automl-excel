import { IServiceBaseProps } from "../../automl/services/ServiceBase";
import * as React from 'react'
import { WorkspaceError } from "../../automl/common/context/IWorkspaceProps";
import { NotImplementedError } from "../../automl/common/NotImplementedError";
import { WorkspaceFlight } from "../../automl/common/context/WorkspaceFlight";
import { Logger } from "../../automl/common/utils/logger";
import { PageNames } from "../../automl/common/PageNames";

export interface IAppContextProps{
    serviceBaseProps: IServiceBaseProps;

}

export const appContextDefaults = {
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
    }
}

export const AppContext = React.createContext<IAppContextProps>(appContextDefaults);