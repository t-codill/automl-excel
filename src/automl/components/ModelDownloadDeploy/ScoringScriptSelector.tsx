import { Toggle } from "office-ui-fabric-react";
import React from "react";
import { FormFileInput } from "../Form/FormFileInput";
import { Validators } from "../Form/Validators";
import { LabelWithCallout } from "../Label/LabelWithCallout";
import { IDeployModelParams } from "./IDeployModelParams";

export interface IScoringScriptSelectorProps {
    hasDefaultOption: boolean;
    onToggle(): void;
}
export interface IScoringScriptSelectorState {
    autoGenerate: boolean;
    file: File | undefined;
    inputKey: number;
}

export class ScoringScriptSelector extends React.Component<IScoringScriptSelectorProps, IScoringScriptSelectorState> {
    public constructor(props: IScoringScriptSelectorProps) {
        super(props);
        this.state = {
            autoGenerate: this.props.hasDefaultOption,
            file: undefined,
            inputKey: Date.now()
        };
    }

    public render(): React.ReactNode {
        const dropdownId = "scoringScriptSelector";
        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Scoring script">
                The scoring script is required to generate the image for deployment. It contains the code to do the predictions on input data.
            </LabelWithCallout>
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3 ms-xl3">Auto generate</div>
                <Toggle
                    className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6"
                    defaultChecked={this.props.hasDefaultOption}
                    disabled={!this.props.hasDefaultOption}
                    onChange={this.onToggleChanged} />
            </div>
            {!this.state.autoGenerate ?
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3 ms-xl3">Scoring File</div>
                    <FormFileInput<IDeployModelParams, "scoringFile">
                        field="scoringFile"
                        className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6"
                        accept=".py"
                        validators={[
                            Validators.required("Scoring file is required.")
                        ]} />
                </div> : undefined
            }
        </>;
    }
    private readonly onToggleChanged = () => {
        this.props.onToggle();
        this.setState((prev) => {
            return { autoGenerate: !prev.autoGenerate };
        });
    }
}
