import { MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { ChildRun } from "../childRun/ChildRun";
import { calculateDuration } from "../common/utils/calculateDuration";
import { generateRunName } from "../common/utils/generateRunName";
import { isRunCompleted, isTerminatedRunStatus } from "../common/utils/run";
import { safeParseJson } from "../common/utils/safeParseJson";
import { DataTable } from "../components/DataTable/DataTable";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PageRedirectLink } from "../components/Redirect/PageRedirect";
import { ChildRunModelDownloadLink } from "./ChildRunModelDownloadLink";
import { IParentRunData } from "./ParentRun";

interface IChildRunIterationTableRow {
    runId: string | undefined;
    experimentId: string | undefined;
    status: string | undefined;
    createdUtc: Date | undefined;
    iteration: number | undefined;
    run_name: string | undefined;
    score: number;
    duration: string | undefined;
    parentRunId: string | undefined;
}

export class ChildRunIterationTable
    extends React.PureComponent<IParentRunData> {
    public readonly render = (): React.ReactNode => {
        if (!this.props || !this.props.run || !this.props.childRuns) {
            return <PageLoadingSpinner />;
        }
        if (isTerminatedRunStatus(this.props.run.status) &&
            this.props.childRuns.length < 1) {
            return (
                <MessageBar>No data for visualization</MessageBar>
            );
        }

        const ascending = this.props.run.properties && (safeParseJson(this.props.run.properties.AMLSettingsJsonString).metric_operation === "minimize");
        const convertedObj: IChildRunIterationTableRow[] = this.props.childRuns.map((run) => {
            return {
                runId: run.runId,
                experimentId: run.experimentId,
                status: run.status,
                createdUtc: run.createdUtc,
                iteration: run.properties ? parseInt(run.properties.iteration, 10) : undefined,
                run_name: generateRunName(run),
                score: isRunCompleted(run) && run.properties && run.properties.score ? Number(run.properties.score) : NaN,
                duration: calculateDuration(run.startTimeUtc, run.endTimeUtc),
                parentRunId: run.parentRunId
            };
        });
        return <DataTable
            enableShimmer={this.props.childRuns.length < 1}
            shimmerLines={5}
            items={convertedObj}
            columns={[
                { field: "iteration", header: "Iteration", minWidth: 50, maxWidth: 60 },
                { field: "run_name", header: "Name", minWidth: 100, maxWidth: 240, render: this.renderChildRunLink },
                {
                    field: "score",
                    header: (this.props.run.properties && this.props.run.properties.primary_metric) ? this.props.run.properties.primary_metric : "Primary Metric",
                    minWidth: 80,
                    maxWidth: 140,
                    nanAsMax: ascending
                },
                { field: "status", header: "Status", minWidth: 80, maxWidth: 80 },
                { field: "createdUtc", header: "Created", minWidth: 80, maxWidth: 150 },
                { field: "duration", header: "Duration", minWidth: 80, maxWidth: 80 },
                { field: "iteration", header: "Model", minWidth: 60, maxWidth: 80, render: this.renderDownload }
            ]}
            sortColumnFieldName="score"
            sortDescending={!ascending}
        />;
    }

    private readonly renderChildRunLink = (content: React.ReactNode, run: IChildRunIterationTableRow) => {
        if (!run.runId || !run.experimentId) {
            return undefined;
        }
        return PageRedirectLink(content, ChildRun, { runId: run.runId, experimentName: this.props.experimentName });
    }
    private readonly renderDownload = (_content: React.ReactNode, run: IChildRunIterationTableRow) => {
        return <ChildRunModelDownloadLink run={run} />;
    }
}
