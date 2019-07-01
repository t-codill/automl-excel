import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { IWorkspaceProps } from "../context/IWorkspaceProps";
import { Region } from "./getRegion";
import { ILogger } from "./ILogger";
import { loggerGetKey } from "./loggerGetKey";

export class Logger implements ILogger {
    private readonly appInsights: ApplicationInsights | undefined;
    constructor(region: Region) {
        const key = loggerGetKey(region);
        if (!key) {
            this.appInsights = undefined;
            return;
        }
        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: key,
                maxAjaxCallsPerView: -1
            }
        });
        this.appInsights.loadAppInsights();
    }
    public getSessionId(): string {
        if (!this.appInsights) {
            return "";
        }
        return this.appInsights.context.sessionManager.automaticSession.id || "";
    }
    public logPageView(name: string, context: IWorkspaceProps): void {
        if (!this.appInsights) {
            return;
        }
        this.appInsights.trackPageView({
            name,
            properties: {
                subscriptionId: context.subscriptionId,
                resourceGroupName: context.resourceGroupName,
                workspaceName: context.workspaceName,
                location: context.location
            }
        });
    }
    public logError(err: Error, context: IWorkspaceProps): void {
        if (!this.appInsights) {
            return;
        }
        this.appInsights.trackException(
            {
                error: err,
                properties: {
                    subscriptionId: context.subscriptionId,
                    resourceGroupName: context.resourceGroupName,
                    workspaceName: context.workspaceName,
                    location: context.location
                }
            });
    }
    public logCustomEvent(name: string, context: IWorkspaceProps,
        customProperties?: { [name: string]: string },
        customMeasurements?: { [key: string]: number },
    ): void {
        if (!this.appInsights) {
            return;
        }
        this.appInsights.trackEvent(
            {
                name,
                properties: {
                    ...customProperties,
                    subscriptionId: context.subscriptionId,
                    resourceGroupName: context.resourceGroupName,
                    workspaceName: context.workspaceName,
                    location: context.location,
                },
                measurements: customMeasurements
            });
    }
}
