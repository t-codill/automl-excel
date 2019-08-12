import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { isEqual, orderBy } from "lodash";
import * as React from "react";
import { PageNames } from "../common/PageNames";
import { isRunCompleted } from "../common/utils/run";
import { safeParseJson } from "../common/utils/safeParseJson";
import { ModelSection } from "../components/ModelDownloadDeploy/ModelSection";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { IParentRunData } from "./ParentRun";
import { IParentRunGridProps } from "./ParentRunGrid";

export interface IParentRunModelState {
    bestRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
}

export class ParentRunModel extends React.PureComponent<IParentRunGridProps, IParentRunModelState> {
    constructor(props: IParentRunGridProps) {
        super(props);
        this.state = {
            bestRun: this.getBestRun()
        };
    }

    public async componentDidUpdate(prevProps: IParentRunData): Promise<void> {
        if (isEqual(this.props.childRuns, prevProps.childRuns)) {
            return;
        }
        this.setState({
            bestRun: this.getBestRun()
        });
    }

    public readonly render = (): React.ReactNode => {
        if (!this.state.bestRun || !this.props.run || !this.props.experimentName) {
            return <PageLoadingSpinner />;
        }

        return <ModelSection
            experimentName={this.props.experimentName}
            pageName={PageNames.ParentRun}
            parentRun={this.props.run}
            run={this.state.bestRun}
            onModelDeploy={this.props.onModelDeploy}
        />;
    }

    private readonly getBestRun = () => {
        if (!this.props.childRuns || !this.props.run || !this.props.run.properties) {
            return undefined;
        }
        const min = safeParseJson(this.props.run.properties.AMLSettingsJsonString).metric_operation === "minimize";
        const scoredRuns = this.props.childRuns.map((r) => ({
            ...r,
            runId: r.runId,
            parentRunId: r.parentRunId,
            status: r.status,
            score: r.properties && parseFloat(r.properties.score)
        }));

        const sortedRuns = orderBy(scoredRuns, ["score"], [min ? "asc" : "desc"]);
        for (const bestRun of sortedRuns) {
            if (bestRun.score === undefined || isNaN(bestRun.score) || !isRunCompleted(bestRun)) {
                continue;
            }
            return bestRun;
        }
        return undefined;
    }
}
