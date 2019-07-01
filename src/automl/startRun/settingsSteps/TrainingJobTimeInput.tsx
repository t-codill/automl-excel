import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const trainingJobTimeInput: React.FunctionComponent = () => {
    const inputId = "trainingJobInput";
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={false} htmlFor={inputId} labelText="Training job time (minutes)">
                The maximum training time in minutes for each run.
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "trainingJobTime">
                field="trainingJobTime"
                placeholder="Training job time (minutes)"
                ariaLabel="Please enter training job time here"
                validators={[
                    Validators.isInteger("Training job time should be an integer"),
                    Validators.minValue(1, () => "Training job time should be greater than 0")
                ]}
                defaultFormValue="60"
            />
        </div>
    </div>;
};

export { trainingJobTimeInput as TrainingJobTimeInput };
