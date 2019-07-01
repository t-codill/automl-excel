import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

const maxCores: React.FunctionComponent = () => {
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={false} htmlFor={"maxCoresInput"} labelText="Max cores per iteration">
                Maximum number of threads to use for a given training iteration.
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "maxCores">
                field="maxCores"
                placeholder="Max cores per iteration"
                ariaLabel="Please enter the max number of cores here"
                type="number"
                validators={[
                    Validators.isInteger("Max cores per iteration should be an integer"),
                ]}
            />
        </div>
    </div>;
};

export { maxCores as MaxCores };
