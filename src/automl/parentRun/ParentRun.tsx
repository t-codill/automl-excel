import { RunHistoryAPIsModels } from "@vienna/runhistory";

import { ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { IDictionary } from "../common/IDictionary";
import { PageNames } from "../common/PageNames";
import { isAutoRefreshStatus } from "../common/utils/isAutoRefreshStatus";
import { nameof } from "../common/utils/nameof";
import { BasePage } from "../components/Base/BasePage";
import { ConfirmationDialog } from "../components/Dialog/ConfirmationDialog";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PopupProgressIndicator } from "../components/Progress/PopupProgressIndicator";
import { PageRedirect } from "../components/Redirect/PageRedirect";
import { LogDetails } from "../logDetails/LogDetails";
import { RunList } from "../runList/RunList";
import { ArtifactService } from "../services/ArtifactService";
import { JasmineService } from "../services/JasmineService";
import { RunHistoryService, RunMetricType } from "../services/RunHistoryService";
import { ParentRunGrid } from "./ParentRunGrid";
import { RunStatus } from "./RunStatus";

export interface IParentRunRouteProps {
    experimentName: string;
    runId: string;
}

export interface IParentRunData {
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    childRuns: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto[] | undefined;
    childRunMetrics: Array<IDictionary<RunMetricType>> | undefined;
    experimentName: string;
}

export interface IParentRunState extends IParentRunData {
    hideCancelDialog: boolean;
    canceling: boolean;
    goToLog: boolean;
}

export class ParentRun extends BasePage<
    IParentRunRouteProps,
    IParentRunState,
    { runHistoryService: RunHistoryService; artifactService: ArtifactService; jasmineService: JasmineService }> {
    public static routePath = `experiments/:${nameof<IParentRunRouteProps>("experimentName")}/parentrun/:${nameof<IParentRunRouteProps>("runId")}`;
    protected readonly header = "Run Detail";
    protected readonly pageName = PageNames.ParentRun;
    protected readonly serviceConstructors = { runHistoryService: RunHistoryService, artifactService: ArtifactService, jasmineService: JasmineService };
    protected autoRefreshInMs = 30000;
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [
        {
            key: "log",
            text: "Logs",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => {
                this.logUserAction("Log", { parentRunId: this.props.runId });
                this.goToLog();
            }
        },
        {
            key: "cancelRun",
            text: "Cancel Run",
            iconProps: {
                iconName: "Cancel"
            },
            onClick: () => {
                this.logUserAction("CancelRun", { parentRunId: this.props.runId });
                this.showDialog();
            }
        }
    ];

    public constructor(props: IParentRunRouteProps) {
        super(props);
        this.state = {
            run: undefined,
            childRuns: undefined,
            childRunMetrics: undefined,
            experimentName: props.experimentName,
            hideCancelDialog: true,
            canceling: false,
            goBack: false,
            goToLog: false
        };
    }

    public readonly render = (): React.ReactNode => {
        if (this.state.goToLog) {
            return PageRedirect(LogDetails, {
                runId: this.props.runId,
                runType: "parent",
                experimentName: this.props.experimentName,
            });
        }
        if (this.state.goBack) {
            return PageRedirect(RunList, {});
        }
        if (!this.state || !this.state.run) {
            return <PageLoadingSpinner />;
        }
        const run = this.state.run;
        const parentRunGridProps = {
            ...this.state,
            onModelRegister: this.refresh.bind(this)
        };
        return <>
            <RunStatus run={run} experimentName={this.props.experimentName} />
            <ParentRunGrid {...parentRunGridProps} />
            {this.state.canceling &&
                <PopupProgressIndicator
                    title="Canceling"
                    description={`Canceling run: ${this.state.run.runId}`}
                />
            }
            <ConfirmationDialog
                title="Cancel Run?"
                subText={`Are you sure you want to cancel run: ${this.state.run.runId}`}
                hidden={this.state.hideCancelDialog}
                onConfirm={this.cancelRun}
                onClose={this.closeDialog}
            />
        </>;
    }

    protected readonly getData = async () => {
        await this.getRunDetail();
        await this.getChildren();
    }

    private readonly goToLog = async () => {
        this.setState({ goToLog: true });
    }

    private readonly getChildren = async () => {
        if (!this.state || !this.state.run || !this.state.run.runId) {
            return;
        }

        // if run has a parent run, run is a child run
        if (this.state.run.parentRunId) {
            return;
        }

        const childRuns = await this.services.runHistoryService.getChildRuns(this.props.runId, this.props.experimentName);
        if (!childRuns) {
            return;
        }

        this.setState({ childRuns });
        if (!this.state.run.properties) {
            this.setState({ childRunMetrics: [] });
            return;
        }
        const childRunMetrics = await this.services.runHistoryService.getChildRunMetrics(childRuns, [this.state.run.properties.primary_metric], this.props.experimentName);
        if (!childRunMetrics) {
            return;
        }

        this.setState({ childRunMetrics });
    }

    private readonly getRunDetail = async () => {
        const run = await this.services.runHistoryService.getRun(this.props.runId, this.props.experimentName);
        if (!run || !run.runId) {
            return;
        }
        this.setState({
            run,
            experimentName: this.props.experimentName
        });
        if (this.autoRefreshEnabled === undefined) {
            this.changeAutoRefresh(isAutoRefreshStatus(run.status));
        }
        const cancelButton = this.navigationBarButtons.find((button) => {
            return button.key === "cancelRun";
        });
        if (cancelButton) {
            cancelButton.disabled = !isAutoRefreshStatus(this.state.run && this.state.run.status) || run.target === "local";
        }
        this.refreshButtons();
    }

    private readonly showDialog = (): void => {
        this.setState({ hideCancelDialog: false });
    }

    private readonly closeDialog = (): void => {
        this.setState({ hideCancelDialog: true });
    }

    private readonly cancelRun = async () => {
        this.closeDialog();

        if (!this.state.run || !this.state.run.runId || !this.state.experimentName) {
            return;
        }
        this.setState({ canceling: true });
        const response = await this.services.jasmineService.cancelRun(this.state.run.runId, this.state.experimentName);
        this.setState({ canceling: false });
        if (response) {
            await this.refresh();
        }
    }
}
