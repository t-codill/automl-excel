import * as React from "react";
import { isRunCompleted } from "../common/utils/run";
import { GridItem } from "../components/Grid/GridItem";
import { ChartReport } from "./ChartReport";
import { IChildRunData } from "./ChildRun";
import { ChildRunMetrics } from "./ChildRunMetrics";
import { ChildRunModel } from "./ChildRunModel";
import { ChildRunSummary } from "./ChildRunSummary";

export interface IChildRunGridProps extends IChildRunData {
    onModelRegister(): void;
}

export class ChildRunGrid extends React.Component<IChildRunGridProps> {
    public readonly render = (): React.ReactNode => {
        const modelVisible = isRunCompleted(this.props.run && this.props.run.status);
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
                    {modelVisible && <ChildRunModel modelUri={this.props.modelUri}
                        experimentName={this.props.experimentName}
                        run={this.props.run}
                        onModelRegister={this.props.onModelRegister} />}
                    <GridItem title="Run Summary">
                        <ChildRunSummary
                            experimentName={this.props.experimentName}
                            run={this.props.run}
                            modelUri={this.props.modelUri}
                            modelId={this.props.run && this.props.run.tags && this.props.run.tags.model_id}
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
