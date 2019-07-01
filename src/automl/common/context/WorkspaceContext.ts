import * as React from "react";
import { NotImplementedError } from "../NotImplementedError";
import { PageNames } from "../PageNames";
import { Logger } from "../utils/logger";
import { IWorkspaceContextProps } from "./IWorkspaceProps";
import { WorkspaceFlight } from "./WorkspaceFlight";

const workspaceContext = React.createContext<IWorkspaceContextProps>(
    {
        pageName: PageNames.Unknown,
        discoverUrls: {},
        flight: new WorkspaceFlight(""),
        theme: "",
        location: "",
        resourceGroupName: "",
        subscriptionId: "",
        logger: new Logger("development"),
        getToken: () => { throw new NotImplementedError(); },
        setPageName: () => { throw new NotImplementedError(); },
        workspaceName: "",
        setNavigationBarButtons(): void { throw new NotImplementedError(); },
        onError: () => { throw new NotImplementedError(); },
        clearErrors: () => { throw new NotImplementedError(); },
        setHeader: () => { throw new NotImplementedError(); },
        setLoading: () => { throw new NotImplementedError(); }
    }
);

export {
    workspaceContext as WorkspaceContext
};
