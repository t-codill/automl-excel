import * as React from "react";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { MaxIterationInput } from "./MaxIterationInput";
import { MetricThresholdInput } from "./MetricThresholdInput";
import { TrainingJobTimeInput } from "./TrainingJobTimeInput";

export class ExitCriteria extends React.Component<{ primaryMetric: string }> {

    public render(): React.ReactNode {
        return <div>
            <LabelWithCallout required={false} htmlFor={"exitCriteria"} labelText="Exit criteria">
                Define criteria to terminate the training job: training job time OR max number of iterations OR metric score threshold (whichever is reached first).
            </LabelWithCallout>
            <TrainingJobTimeInput />
            <MaxIterationInput />
            <MetricThresholdInput primaryMetric={this.props.primaryMetric} />
        </div>;
    }
}
