
import { Icon, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const maxHorizon: React.FunctionComponent = () => {
    const dropdownId = "settingsStepsMaxHorizon";

    return <>
        <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Forecast Horizon">
            Forecasting expects periodic data (e.g. daily, weekly).  Horizon is how many periods forward you would like to forecast. &nbsp;
            <Link className="ms-CalloutExample-link" href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-auto-train-forecast#configure-experiment" target="_blank">
                Learn more about forecast horizon <Icon iconName="NavigateExternalInline" />
            </Link>
        </LabelWithCallout>
        <FormTextInput<ISettingsStepParams, "maxHorizon">
            field="maxHorizon"
            id={dropdownId}
            placeholder="Forecast horizon"
            ariaLabel="Please enter forecast horizon"
            validators={[
                Validators.required("Max horizon is required for time series"),
                Validators.isInteger("Max horizon must be an integer"),
                Validators.minValue(1, () => "Max horizon should be greater than or equal to 1"),
            ]}
        /></>;
};

export { maxHorizon as MaxHorizon };
