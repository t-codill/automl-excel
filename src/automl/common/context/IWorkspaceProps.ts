import { RestError } from "@azure/ms-rest-js";
import { ICommandBarItemProps } from "@uifabric/experiments";
import { IDictionary } from "../IDictionary";
import { IBaseContextProps } from "./IBaseContextProps";

export interface IWorkspaceRouteProps {
    readonly subscriptionId: string;
    readonly resourceGroupName: string;
    readonly workspaceName: string;
}
export interface IWorkspaceProps extends IBaseContextProps, IWorkspaceRouteProps {
    readonly discoverUrls: IDictionary<string>;
    readonly location: string;
}
export type WorkspaceError = RestError & {
    response?: {
        body?: string;
    };
};

export interface IWorkspaceContextProps extends IWorkspaceProps {
    setNavigationBarButtons(buttons: ICommandBarItemProps[], overflowButtons: ICommandBarItemProps[], farButtons: ICommandBarItemProps[]): void;
    onError(err: WorkspaceError): void;
    clearErrors(): void;
    setHeader(header: string | undefined): void;
    setLoading(loading: boolean): void;
}
