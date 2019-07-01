import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import * as React from "react";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ConcurrentIterations } from "./ConcurrentIterations";
import { MaxCores } from "./MaxCores";

interface IConcurrentStepProps {
    compute: AzureMachineLearningWorkspacesModels.ComputeUnion | undefined;
}

export class ConcurrentStep extends React.Component<IConcurrentStepProps> {
    public render(): React.ReactNode {
        return <>
            <LabelWithCallout required={false} htmlFor={"concurrency"} labelText="Concurrency">
                Define limitations for multi tasking jobs
            </LabelWithCallout>
            <ConcurrentIterations compute={this.props.compute} />
            <MaxCores />
        </>;
    }
}
