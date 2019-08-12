import * as React from "react";
import { isRunCompleted } from "../common/utils/run";
import { GridItem } from "../components/Grid/GridItem";
import { ChartReport } from "./ChartReport";
import { IChildRunData } from "./ChildRun";
import { ChildRunMetrics } from "./ChildRunMetrics";
import { ChildRunModel } from "./ChildRunModel";
import { ChildRunSummary } from "./ChildRunSummary";

export interface IChildRunGridProps extends IChildRunData {
    onModelDeploy(): void;
}

export class ChildRunGrid extends React.Component<IChildRunGridProps> {
    public readonly render = (): React.ReactNode => {
        const modelVisible = isRunCompleted(this.props.run);
        return (
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl9">
                    <GridItem title="Graphs">
                        <ChartReport
                            run={this.props.run}
                            runMetrics={this.props.runMetrics} />
                    </GridItem>
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl3">
                    {modelVisible && <ChildRunModel
                        experimentName={this.props.experimentName}
                        run={this.props.run}
                        onModelDeploy={this.props.onModelDeploy} />}
                    <GridItem title="Run Summary">
                        <ChildRunSummary
                            experimentName={this.props.experimentName}
                            run={this.props.run}
                        />
                    </GridItem>
                    <GridItem title="Run Metrics">
                        <ChildRunMetrics run={this.props.run} runMetrics={this.props.runMetrics} />
                    </GridItem>
                </div>
            </div>
        );
    }
}
