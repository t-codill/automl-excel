import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface IColumnSelectorProps {
    columns: string[] | undefined;
}

interface IColumnSelectorState {
    selectedKey: string | undefined;
}

export class TargetColumnSelector
    extends React.PureComponent<IColumnSelectorProps, IColumnSelectorState> {

    constructor(props: IColumnSelectorProps) {
        super(props);
        this.state = {
            selectedKey: undefined
        };
    }

    public render(): React.ReactNode {
        const options = this.getOptions(this.props.columns);
        const dropdownId = "settingsStepsTargetColumnSelector";

        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Target column">
                This is what the model will be trained to predict.
            </LabelWithCallout>
            <FormDropdown<ISettingsStepParams, "column">
                field="column"
                id={dropdownId}
                required={true}
                options={options}
                validators={[
                    Validators.required("Target column is required")
                ]}
            /></>;
    }

    private readonly getOptions = (columns: string[] | undefined) => {
        if (!columns) {
            return [];
        }
        return columns.map((c) => {
            return {
                key: c,
                text: c
            };
        });
    }
}
