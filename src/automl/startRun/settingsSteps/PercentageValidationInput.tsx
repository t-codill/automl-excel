import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const percentageValidationInput: React.FunctionComponent = () => {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={true} htmlFor={"percentageOfValidationData"} labelText="% validation of data">
                Percentage of validation data
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "percentageValidation">
                field="percentageValidation"
                placeholder="Percentage Validation data"
                ariaLabel="Please enter the number of percentage data"
                type="number"
                validators={[
                    Validators.required("Percentage of validation data is required"),
                    Validators.isInteger("Percentage of validation data should be an integer"),
                ]}
                defaultFormValue="20"
            />
        </div>
    </div>;
};

export { percentageValidationInput as PercentageValidationInput };
