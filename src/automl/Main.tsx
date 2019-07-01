import { CommandBar, ICommandBarItemProps, ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react";
import { Switch } from "react-router-dom";
import { ChildRun } from "./childRun/ChildRun";
import { BaseContext } from "./common/context/BaseContext";
import { IWorkspaceRouteProps, WorkspaceError } from "./common/context/IWorkspaceProps";
import { WorkspaceContext } from "./common/context/WorkspaceContext";
import { IDictionary } from "./common/IDictionary";
import { isSameError } from "./common/utils/isSameError";
import { nameof } from "./common/utils/nameof";
import { ErrorMessageBar, IError } from "./components/ErrorMessageBar";
import { FeedbackLink } from "./components/FeedbackLink";
import { PageLoadingSpinner } from "./components/Progress/PageLoadingSpinner";
import { BaseRoute, PageRoute } from "./components/Redirect/PageRoute";
import { LogDetails } from "./logDetails/LogDetails";
import { NotFound } from "./notFound/NotFound";
import { ParentRun } from "./parentRun/ParentRun";
import { RunList } from "./runList/RunList";
import { DiscoveryService } from "./services/DiscoveryService";
import { WorkSpaceService } from "./services/WorkSpaceService";
import { StartRun } from "./startRun/StartRun";
import { Welcome } from "./welcome/Welcome";

import "./Main.scss";

export interface IMainState {
    buttons: ICommandBarItemProps[];
    overflowButtons: ICommandBarItemProps[];
    farButtons: ICommandBarItemProps[];
    discoverUrls: IDictionary<string>;
    location: string;
    errors: IError[];
    header: string | undefined;
    loadingCount: number;
    deleted: boolean;
}

export class Main extends React.Component<IWorkspaceRouteProps, IMainState> {
    public static routePath = `/subscriptions/:${
        nameof<IWorkspaceRouteProps>("subscriptionId")
        }/resourceGroups/:${
        nameof<IWorkspaceRouteProps>("resourceGroupName")
        }/providers/Microsoft.MachineLearningServices/workspaces/:${
        nameof<IWorkspaceRouteProps>("workspaceName")}`;
    public static contextType = BaseContext;
    public context!: React.ContextType<typeof BaseContext>;
    private workSpaceService!: WorkSpaceService;
    private discoveryService: DiscoveryService | undefined;
    constructor(props: Readonly<IWorkspaceRouteProps>) {
        super(props);

        this.state = {
            discoverUrls: {},
            location: "",
            buttons: [],
            overflowButtons: [],
            farButtons: [],
            errors: [],
            header: undefined,
            loadingCount: 0,
            deleted: false
            // previewBlocked: false
        };
    }
    public componentDidMount(): void {
        this.workSpaceService = new WorkSpaceService({ ...this.props, ...this.context, ...this.state, onError: this.onError });
        this.loadWorkspace();
    }
    public componentWillUnmount(): void {
        this.workSpaceService.dispose();
        if (this.discoveryService) {
            this.discoveryService.dispose();
        }
    }
    public componentDidCatch(err: Error): void {
        this.onError(err);
    }
    public render(): React.ReactNode {
        if (this.state.deleted) {
            return <div className="app-container">
                <header className="app-header">
                    <h2>Not Found</h2>
                    <FeedbackLink />
                </header>
            </div>;
        }
        if (!this.state.discoverUrls || !this.state.discoverUrls.history) {
            return <PageLoadingSpinner />;
        }
        const context = {
            ...this.props,
            ...this.context,
            ...this.state,
            setNavigationBarButtons: this.setNavigationBarButtons,
            onError: this.onError,
            clearErrors: this.clearErrors,
            setHeader: this.setHeader,
            setLoading: this.setLoading
        };
        return (
            <WorkspaceContext.Provider value={context}>
                <div className="app-container">
                    <header className="app-header">
                        <h2>
                            {this.state.header}
                        </h2>
                        <FeedbackLink />
                    </header>
                    {
                        this.state.buttons.length + this.state.overflowButtons.length + this.state.farButtons.length > 0 &&
                        <section className="app-command-bar">
                            <CommandBar items={this.state.buttons}
                                overflowItems={this.state.overflowButtons}
                                farItems={this.state.farButtons} />
                        </section>
                    }

                    <div className="page-progress-indicator-container">
                        {this.state.loadingCount > 0 && <ProgressIndicator className="page-progress-indicator" barHeight={1} />}
                    </div>
                    <section className="app-message-bar">
                        {this.state.errors
                            .map((value, index) =>
                                <ErrorMessageBar error={value} key={`ErrorMessage_Container_${index}_${value.count}`} />
                            )
                        }
                    </section>
                    <section className="app-content-container">
                        <div className="app-content">
                            <Switch>
                                {PageRoute(RunList)}
                                {PageRoute(Welcome)}
                                {PageRoute(ParentRun)}
                                {PageRoute(LogDetails)}
                                {PageRoute(ChildRun)}
                                {PageRoute(StartRun)}
                                {BaseRoute(NotFound)}
                            </Switch>
                        </div>
                    </section>
                </div>
            </WorkspaceContext.Provider>
        );
    }

    private readonly setLoading = (loading: boolean): void => {
        this.setState((prev) => {
            return {
                loadingCount: prev.loadingCount + (loading ? 1 : -1)
            };
        });
    }

    private readonly setHeader = (header: string): void => {
        this.setState({ header });
    }

    private readonly incrementErrorCount = (errors: IError[], error: WorkspaceError): boolean => {
        for (const e of errors) {
            if (isSameError(e.error, error)) {
                e.count++;
                return true;
            }
        }
        return false;
    }

    private readonly onError = (error: WorkspaceError): void => {
        this.setState((prev) => {
            const errors = prev.errors;
            if (this.incrementErrorCount(errors, error)) {
                return { errors };
            }
            const errState = {
                error,
                dismissed: false,
                showingDetail: false,
                count: 1
            };
            return { errors: [...prev.errors, errState] };
        });
    }

    private readonly clearErrors = (): void => {
        this.setState({ errors: [] });
    }

    private readonly setNavigationBarButtons = (buttons: ICommandBarItemProps[], overflowButtons: ICommandBarItemProps[], farButtons: ICommandBarItemProps[]): void => {
        this.setState({ buttons, overflowButtons, farButtons });
    }

    private async loadWorkspace(): Promise<void> {
        const workspace = await this.workSpaceService.tryGetWorkspace();
        if (workspace === null) {
            this.setState({ deleted: true });
            return;
        }
        // Cancelled if returns null
        if (!workspace || !workspace.discoveryUrl) {
            return;
        }
        if (this.discoveryService) {
            this.discoveryService.dispose();
        }
        this.discoveryService = new DiscoveryService({
            ...this.props,
            ...this.context,
            discoverUrls: {},
            location: workspace.location || "",
            onError: this.onError
        }, workspace.discoveryUrl);
        const discoverUrls = await this.discoveryService.get();
        if (!discoverUrls) {
            return;
        }
        this.setState({ discoverUrls, location: workspace.location || "" });
    }
}
