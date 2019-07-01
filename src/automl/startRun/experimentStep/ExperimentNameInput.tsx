import * as React from "react";
import { FormComboBox } from "../../components/Form/FormComboBox";
import { Validators } from "../../components/Form/Validators";
import { IExperimentStepCallback } from "./ExperimentStep";

interface IExperimentNameInputProps {
    experimentNames: string[] | undefined;
    experimentName: string | undefined;
    readonly: boolean;
    onEditClick(): void;
}

export class ExperimentNameInput extends React.PureComponent<IExperimentNameInputProps> {
    public render(): React.ReactNode {
        const comboBoxId = "experimentNameInput";
        return <>
            <FormComboBox<IExperimentStepCallback, "experimentName">
                field="experimentName"
                required={true}
                placeholder="Enter experiment name or select"
                options={this.loadOptions()}
                onClick={this.onEditClick}
                label="Experiment name"
                id={comboBoxId}
                buttonIconProps={{ iconName: this.props.readonly ? "Edit" : "ChevronDown" }}
                validators={[
                    Validators.required("Experiment name is required"),
                    Validators.regex(/^[a-zA-Z0-9][\w-]{2,35}$/,
                        "Experiment name must be 3-36 characters, start with a letter or a number, and can only contain letters, numbers, underscores, and dashes.")
                ]}
            />
        </>;
    }

    private readonly onEditClick = (): void => {
        this.props.onEditClick();
    }

    private readonly loadOptions = () => {
        if (!this.props.experimentNames) {
            return [];
        }

        return this.props.experimentNames.map((name) => ({ key: name, text: name }));
    }
}
