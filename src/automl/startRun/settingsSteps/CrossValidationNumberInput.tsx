import { Icon, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const crossValidationNumberInput: React.FunctionComponent = () => {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={true} htmlFor={"numberOfCrossValidations"} labelText="Number of Cross Validations">
                The number of cross validations to use to assess the results (metrics) of the model.&nbsp;
                <Link className="ms-CalloutExample-link"
                    href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#cross-validation-split-options" target="_blank">
                    Learn more <Icon iconName="NavigateExternalInline" />
                </Link>.
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "crossValidationNumber">
                field="crossValidationNumber"
                placeholder="Number of Cross Validations"
                ariaLabel="Please enter the number of cross validation"
                type="number"
                validators={[
                    Validators.required("Number of Cross Validation is required"),
                    Validators.isInteger("Number of Cross Validation should be an integer"),
                    Validators.minValue(2, () => "Number of Cross Validation should not be less than 2"),
                    Validators.maxValue(1000, () => "Number of Cross Validation should not exceed 1000")
                ]}
                defaultFormValue="5"
            />
        </div>
    </div>;
};

export { crossValidationNumberInput as CrossValidationNumberInput };
