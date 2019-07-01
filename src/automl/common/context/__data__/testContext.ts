import { PageNames } from "../../PageNames";
import { Logger } from "../../utils/logger";
import { IWorkspaceContextProps, WorkspaceError } from "../IWorkspaceProps";
import { WorkspaceFlight } from "../WorkspaceFlight";

export function getLogCustomEventSpy(): jest.SpyInstance<ReturnType<Logger["logCustomEvent"]>> {
    const spy = jest.spyOn(Logger.prototype, "logCustomEvent");
    spy.mockImplementation(jest.fn());
    return spy;
}
let pageName: PageNames = PageNames.Unknown;
export const testContext: IWorkspaceContextProps = {
    get pageName(): PageNames { return pageName; },
    get theme(): string { return "light"; },
    discoverUrls: {},
    flight: new WorkspaceFlight(""),
    location: "eastus",
    resourceGroupName: "testResource",
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    logger: new Logger("test"),
    getToken: () => "testToken",
    setPageName: (value: PageNames) => { pageName = value; },
    workspaceName: "testWorkSpace",
    setNavigationBarButtons(): void { return; },
    onError: (err: WorkspaceError) => { throw err; },
    clearErrors: () => { return; },
    setHeader: () => { return; },
    setLoading: () => { return; }
};
