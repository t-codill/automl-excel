import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { RunType } from "../../services/constants/RunType";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface IJobTypeSelectorProps {
    jobType: RunType | undefined;
}

const jobTypeSelector: React.FunctionComponent<IJobTypeSelectorProps> = (props) => {
    const options = [
        { key: "classification", text: "Classification" },
        { key: "regression", text: "Regression" },
        { key: "forecasting", text: "Forecasting" }
    ];
    const dropdownId = "settingsStepsJobType";

    return <>
        <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Prediction Task">
            The type of machine learning problem you are trying to solve.
            Automated machine learning supports task types of classification,
            regression, and forecasting.
        </LabelWithCallout>
        <FormDropdown<ISettingsStepParams, "jobType">
            field="jobType"
            id={dropdownId}
            required={true}
            placeholder="Select a prediction task..."
            options={options}
            validators={[
                Validators.required("Prediction task is required")
            ]}
            defaultFormValue={props.jobType}
            initialSelectedKey={options[0] && options[0].key}
        /></>;
};
export { jobTypeSelector as JobTypeSelector };
