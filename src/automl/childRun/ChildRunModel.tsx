import { RunHistoryAPIsModels } from "@vienna/runhistory";
import React from "react";
import { PageNames } from "../common/PageNames";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ModelSection } from "../components/ModelDownloadDeploy/ModelSection";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { RunHistoryService } from "../services/RunHistoryService";

export interface IChildRunModelProps {
    experimentName: string | undefined;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
    onModelDeploy(): void;
}

export interface IChildRunModelState {
    modelId: string | undefined;
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
}

export class ChildRunModel extends BaseComponent<IChildRunModelProps, IChildRunModelState, { runHistoryService: RunHistoryService }> {
    protected readonly serviceConstructors = { runHistoryService: RunHistoryService };
    public constructor(props: IChildRunModelProps) {
        super(props);
        this.state = {
            modelId: this.props.run && this.props.run.tags && this.props.run.tags.model_id,
            parentRun: undefined
        };
    }
    public readonly render = (): React.ReactNode => {
        if (!this.state.parentRun || !this.props.experimentName || !this.props.run) {
            return <PageLoadingSpinner />;
        }
        return <ModelSection
            run={this.props.run}
            experimentName={this.props.experimentName}
            parentRun={this.state.parentRun}
            onModelDeploy={this.props.onModelDeploy}
            pageName={PageNames.ChildRun}
        />;
    }
    protected readonly getData = async () => {
        if (!this.props.run || !this.props.experimentName || !this.props.run.parentRunId) {
            return;
        }
        const parentRunId = this.props.run.parentRunId;
        const parentRun = await this.services.runHistoryService.getRun(parentRunId, this.props.experimentName);
        if (!parentRun || !parentRun.runId) {
            return;
        }
        this.setState({
            parentRun
        });
    }
}
