import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const maxIterationInput: React.FunctionComponent = () => {
    const inputId = "maxIterationInput";
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={false} htmlFor={inputId} labelText="Max number of iterations">
                Max number of pipelines (algorithm and hyperparameters) to try.
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "maxIteration">
                field="maxIteration"
                placeholder="Max number of iteration"
                ariaLabel="Please enter training job time here"
                validators={[
                    Validators.isInteger("Max number of iterations should be an integer"),
                    Validators.minValue(1, () => "Max number of iterations should be greater than or equal to 1"),
                    Validators.maxValue(1000, () => "Max number of iterations cannot exceed 1000")
                ]}
                defaultFormValue="100"
            />
        </div>
    </div>;
};

export { maxIterationInput as MaxIterationInput };
