import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import * as React from "react";
import { RunType } from "../../services/constants/RunType";
import { BlockedAlgorithms } from "./BlockedAlgorithms";
import { ConcurrentStep } from "./ConcurrentStep";
import { ExitCriteria } from "./ExitCriteria";
import { MetricSelector } from "./MetricSelector";
import { Preprocessing } from "./Preprocessing";
import { Validation } from "./Validation";

export class AdvancedSettings extends React.Component<{
    jobType: RunType;
    compute: AzureMachineLearningWorkspacesModels.ComputeUnion | undefined;
    primaryMetric: string;
}>{
    public render(): React.ReactNode {
        return <>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <MetricSelector jobType={this.props.jobType} />
            </div>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <ExitCriteria primaryMetric={this.props.primaryMetric} />
            </div>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <Preprocessing
                    jobType={this.props.jobType} />
            </div>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <Validation jobType={this.props.jobType} />
            </div>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <ConcurrentStep compute={this.props.compute} />
            </div>
            <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                <BlockedAlgorithms jobType={this.props.jobType} />
            </div>
        </>;
    }

}
