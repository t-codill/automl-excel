import * as React from "react";
import { shouldShowParentRunModel } from "../common/utils/run";
import { GridItem } from "../components/Grid/GridItem";
import { ChildRunIterationTable } from "./ChildRunIterationTable";
import { IParentRunData } from "./ParentRun";
import { ParentRunModel } from "./ParentRunModel";
import { ParentRunSkylineChart } from "./ParentRunSkylineChart";
import { ParentRunSummary } from "./ParentRunSummary";
import { ParentSettings } from "./ParentSettings";

export interface IParentRunGridProps extends IParentRunData {
    onModelDeploy(): void;
}
export class ParentRunGrid extends React.Component<IParentRunGridProps> {
    public readonly render = (): React.ReactNode => {
        const modelVisible = shouldShowParentRunModel(this.props.run && this.props.run.status);
        return (
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl9">
                    <GridItem title="Iteration Chart">
                        <ParentRunSkylineChart  {...this.props} />
                    </GridItem>
                    <GridItem title="Iterations">
                        <ChildRunIterationTable  {...this.props} />
                    </GridItem>
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 ms-xl3">
                    {modelVisible && <ParentRunModel {...this.props} />}
                    <GridItem title="Run Summary">
                        <ParentRunSummary run={this.props.run} />
                    </GridItem>
                    <GridItem title="Run Settings">
                        <ParentSettings run={this.props.run} />
                    </GridItem>
                </div>
            </div>
        );
    }
}
