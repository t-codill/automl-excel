import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { Models } from "@azure/storage-blob";
import { Metrics, stringToProfileResults } from "@vienna/data-prep-lib";
// tslint:disable-next-line: no-submodule-imports
import { IProfileResult } from "@vienna/data-prep-lib/ApiDefinitions";
import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
import * as React from "react";
import { ICsvData } from "../../common/utils/csv";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../../components/Progress/PageLoadingSpinner";
import { ArtifactService } from "../../services/ArtifactService";
import { DataPrepService } from "../../services/DataPrepService";
import { RunHistoryService } from "../../services/RunHistoryService";

import "./DataProfiling.scss";

export interface IDataProfilingProps {
    previewData: ICsvData | undefined;
    dataStoreName: string | undefined;
    blob: Models.BlobItem;
    compute: AzureMachineLearningWorkspacesModels.ComputeResource;
}

const dataPrepExperimentName = "data-profiling";

export class DataProfiling extends BaseComponent<IDataProfilingProps, {
    // TODO convert to string type.
    // tslint:disable-next-line:no-any
    profilingData: IProfileResult[] | undefined;
    runId: string | undefined;
    experimentName: string | undefined;
    profileResultPath: string | undefined;
    status: string;
    profiling: boolean;
}, {
    artifactService: ArtifactService;
    runHistoryService: RunHistoryService;
    dataPrepService: DataPrepService;
}> {
    protected readonly serviceConstructors = {
        artifactService: ArtifactService,
        runHistoryService: RunHistoryService,
        dataPrepService: DataPrepService
    };
    protected autoRefreshInMs = 3000;
    constructor(props: IDataProfilingProps) {
        super(props);
        this.state = {
            profilingData: undefined,
            runId: undefined,
            experimentName: undefined,
            profileResultPath: undefined,
            status: "Waiting for data store creation",
            profiling: true
        };
    }

    public render(): React.ReactNode {
        if (this.state.profiling) {
            return (
                <PageLoadingSpinner label={this.state.status} />
            );
        }
        if (this.state.profilingData) {
            return <div className="dataProfiling" style={{ overflow: "hidden" }}>
                <Metrics
                    profileData={this.state.profilingData}
                    theme={this.context.theme === "dark" ? "dark" : "light"}
                />
            </div>;
        }
        return <MessageBar messageBarType={MessageBarType.error}>
            {this.state.status}
        </MessageBar>;
    }
    public componentDidUpdate(prevProps: IDataProfilingProps): void {
        if (prevProps.blob !== this.props.blob
            || prevProps.compute !== this.props.compute
            || prevProps.dataStoreName !== this.props.dataStoreName
            || prevProps.previewData !== this.props.previewData) {
            this.starProfile();
        }
    }
    protected readonly getData = async () => {
        if (!this.state
            || !this.state.runId
            || !this.state.experimentName
            || !this.state.profileResultPath) {
            this.starProfile();
            return;
        }
        const run = await this.services.runHistoryService.getRun(this.state.runId, this.state.experimentName);
        if (!run || !run.status) {
            return;
        }
        switch (run.status) {
            case "Completed":
                this.handleComplete(run);
                break;
            case "Failed":
                this.handleFailed(run);
                break;
            default:
                this.setState({ status: run.status });
                return;
        }
    }

    private readonly handleComplete = async (run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto) => {
        this.changeAutoRefresh(false);
        if (!run.runId
            || !this.state.profileResultPath) {
            this.setState({ profiling: false, status: "Failed to retrieve profiling result." });
            return;
        }
        const response = await this.services.artifactService.tryGetContentForRun(run.runId, this.state.profileResultPath);
        if (response) {
            this.setState({ profiling: false, profilingData: stringToProfileResults(response) });
            return;
        } else {
            this.setState({ profiling: false, status: "Failed to retrieve profiling result." });
        }
    }

    private readonly handleFailed = async (run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto) => {
        this.changeAutoRefresh(false);
        if (run.error && run.error.error && run.error.error.message) {
            this.setState({ profiling: false, status: run.error.error.message });
        }
        else {
            this.setState({ profiling: false, status: "Failed" });
        }
    }

    private readonly starProfile = async () => {
        if (!this.props.dataStoreName) {
            return;
        }
        this.changeAutoRefresh(false);
        this.setState({ profiling: true, status: "Starting" });

        const result = await this.services.dataPrepService.startDataProfiling(
            this.props.dataStoreName,
            this.props.blob.name,
            dataPrepExperimentName,
            this.props.compute.name || "",
            0);
        if (!result) {
            return;
        }
        this.setState({
            runId: result.runId,
            experimentName: result.experimentName,
            profileResultPath: result.profileResultPath
        });
        this.changeAutoRefresh(true);
    }
}
