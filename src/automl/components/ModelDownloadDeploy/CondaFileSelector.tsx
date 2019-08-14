import { Toggle } from "office-ui-fabric-react";
import React from "react";
import { FormFileInput } from "../Form/FormFileInput";
import { Validators } from "../Form/Validators";
import { LabelWithCallout } from "../Label/LabelWithCallout";
import { IDeployModelParams } from "./IDeployModelParams";

export interface ICondaFileSelectorProps {
    onToggle(): void;
}
export interface ICondaFileSelectorState {
    autoGenerate: boolean;
    file: File | undefined;
    inputKey: number;
}

export class CondaFileSelector extends React.Component<ICondaFileSelectorProps, ICondaFileSelectorState> {
    public constructor(props: ICondaFileSelectorProps) {
        super(props);
        this.state = {
            autoGenerate: true,
            file: undefined,
            inputKey: Date.now()
        };
    }

    public render(): React.ReactNode {
        const dropdownId = "environmentScriptSelector";
        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Environment script">
                The environment script is required to generate the image for deployment. It contains the Conda dependencies required to run the web service.
            </LabelWithCallout>
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3 ms-xl3">Auto generate</div>
                <Toggle
                    className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6"
                    defaultChecked={true}
                    onChange={this.onToggleChanged} />
            </div>
            {!this.state.autoGenerate ?
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-col ms-sm6 ms-md3 ms-lg3 ms-xl3">Environment File</div>
                    <FormFileInput<IDeployModelParams, "condaFile">
                        field="condaFile"
                        className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6"
                        accept=".yml"
                        validators={[
                            Validators.required("Conda environment file is required.")
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
