
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
import { ParentRun } from "../parentRun/ParentRun";
import { RunStatus } from "../parentRun/RunStatus";
import { RunList } from "../runList/RunList";
import { ArtifactService } from "../services/ArtifactService";
import { JasmineService } from "../services/JasmineService";
import { RunHistoryService, RunMetricType } from "../services/RunHistoryService";
import { ChildRunGrid } from "./ChildRunGrid";

export interface IChildRunRouteProps {
    experimentName: string;
    runId: string;
}

export interface IChildRunData {
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
    runMetrics: IDictionary<RunMetricType> | undefined;
    experimentName: string;
}

interface IChildRunState extends IChildRunData {
    hideCancelDialog: boolean;
    canceling: boolean;
    goToLog: boolean;
}

export class ChildRun extends BasePage<
    IChildRunRouteProps,
    IChildRunState,
    {
        runHistoryService: RunHistoryService;
        artifactService: ArtifactService;
        jasmineService: JasmineService;
    }> {
    public static routePath = `experiments/:${nameof<IChildRunRouteProps>("experimentName")}/childrun/:${nameof<IChildRunRouteProps>("runId")}`;
    protected readonly header = "Run Detail";
    protected readonly pageName = PageNames.ChildRun;
    protected readonly serviceConstructors = {
        runHistoryService: RunHistoryService,
        artifactService: ArtifactService,
        jasmineService: JasmineService
    };
    protected autoRefreshInMs = 30000;
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [
        {
            key: "log",
            text: "Logs",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => {
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
                this.showDialog();
            }
        }
    ];

    constructor(props: IChildRunRouteProps) {
        super(props);
        this.state = {
            experimentName: this.props.experimentName,
            goBack: false,
            hideCancelDialog: true,
            canceling: false,
            run: undefined,
            runMetrics: undefined,
            goToLog: false,
        };
    }

    public readonly render = (): React.ReactNode => {
        if (this.state.goToLog) {
            return PageRedirect(LogDetails, {
                runId: this.props.runId,
                runType: "child",
                experimentName: this.props.experimentName,
            });
        }
        if (this.state.goBack) {
            if (this.state.run && this.state.run.parentRunId) {
                return PageRedirect(ParentRun, { experimentName: this.props.experimentName, runId: this.state.run.parentRunId });
            }
            else {
                return PageRedirect(RunList, { experimentName: this.props.experimentName });
            }
        }
        if (!this.state.run) {
            return <PageLoadingSpinner />;
        }
        if (!this.state.run.parentRunId) {
            // run is a parent run child run page should not be rendered
            if (this.state.run.runId) {
                return PageRedirect(ParentRun, { experimentName: this.props.experimentName, runId: this.state.run.runId });
            }
            // return to run list if run id missing
            else {
                return PageRedirect(RunList, { experimentName: this.props.experimentName });
            }
        }
        const childRunGridProps = {
            ...this.state,
            onModelDeploy: this.refresh.bind(this)
        };
        return (<>
            <RunStatus run={this.state.run} experimentName={this.props.experimentName} />
            <ChildRunGrid {...childRunGridProps} />
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
        </>
        );
    }

    protected readonly getData = async () => {
        await this.getRunDetail();
        await this.getRunMetrics();
    }

    private readonly goToLog = async () => {
        this.logUserAction("Log", { childRunId: this.props.runId, parentRunId: this.state.run && this.state.run.parentRunId });
        this.setState({ goToLog: true });
    }

    private readonly showDialog = (): void => {
        this.logUserAction("CancelRun", { childRunId: this.props.runId, parentRunId: this.state.run && this.state.run.parentRunId });
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

    private readonly getRunMetrics = async () => {
        if (!this.state || !this.state.run || !this.state.run.runId) {
            return;
        }
        const rawMetrics = await this.services.runHistoryService.getRunMetrics(this.props.runId, this.props.experimentName);
        if (!rawMetrics) {
            return;
        }
        const artifactNames = this.services.runHistoryService.getArtifactBackedMetricNames(rawMetrics);
        const artifactContents = await this.services.artifactService.getAllContents(artifactNames.map((a) => a[1]));
        if (!artifactContents) {
            return;
        }
        this.setState({ runMetrics: this.services.runHistoryService.mergeMetrics(rawMetrics, artifactNames.map((a) => a[0]), artifactContents) });
    }

    private readonly getRunDetail = async () => {
        const run = await this.services.runHistoryService.getRun(this.props.runId, this.props.experimentName);
        if (!run || !run.runId) {
            return;
        }
        this.setState({ run, experimentName: this.props.experimentName });
        if (this.autoRefreshEnabled === undefined) {
            this.changeAutoRefresh(isAutoRefreshStatus(run.status));
        }
        const cancelButton = this.navigationBarButtons.find((button) => {
            return button.key === "cancelRun";
        });
        if (cancelButton) {
            cancelButton.disabled = !isAutoRefreshStatus(this.state.run && this.state.run.status) || run.target === "local" || !run.target;
        }
        this.refreshButtons();
    }
}
