import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

interface IConcurrentIterationInputProps {
    compute: AzureMachineLearningWorkspacesModels.ComputeUnion | undefined;
}

const concurrentIterations: React.FunctionComponent<IConcurrentIterationInputProps> = (props) => {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={false} htmlFor={"maxConcurrentIterInput"} labelText="Max concurrent iterations">
                Maximum number of iterations that would be executed in parallel. This should be less than the number of cores on the compute target.
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "maxConcurrentIterations">
                field="maxConcurrentIterations"
                placeholder="Concurrent Iterations"
                ariaLabel="Please enter the max number of concurrent iterations here"
                type="number"
                validators={[
                    Validators.isInteger("Max concurrent iteration should be an integer"),
                ]}
                defaultFormValue={`${
                    props.compute
                        && props.compute.computeType === "AmlCompute"
                        && props.compute.properties
                        && props.compute.properties.scaleSettings
                        ? props.compute.properties.scaleSettings.maxNodeCount : 1}`}
            />
        </div>
    </div>;
};

export { concurrentIterations as ConcurrentIterations };
