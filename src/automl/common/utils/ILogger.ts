import { IWorkspaceProps } from "../context/IWorkspaceProps";

export interface ILogger {
    getSessionId(): string;
    logPageView(name: string, context: IWorkspaceProps): void;
    logError(err: Error, context: IWorkspaceProps): void;
    logCustomEvent(name: string, context: IWorkspaceProps,
        customProperties?: { [name: string]: string },
        customMeasurements?: { [key: string]: number },
    ): void;
}
