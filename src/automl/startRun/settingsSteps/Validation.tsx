import * as React from "react";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { RunType } from "../../services/constants/RunType";
import { ValidationType } from "../../services/constants/ValidationType";
import { CrossValidationNumberInput } from "./CrossValidationNumberInput";
import { MonteCarloInput } from "./MonteCarloInput";
import { ValidationTypeSelector } from "./ValidationTypeSelector";

export interface IValidationProps {
    jobType: RunType;
}
export interface IValidationState {
    validationType: ValidationType;
}

export class Validation extends React.Component<IValidationProps, IValidationState> {
    constructor(props: IValidationProps) {
        super(props);
        this.state = {
            validationType: ValidationType.crossValidation
        };
    }
    public render(): React.ReactNode {
        return <>
            <LabelWithCallout required={false} htmlFor={"validation"} labelText="Validation">
                Choose validation type
            </LabelWithCallout>
            <div>
                <ValidationTypeSelector
                    jobType={this.props.jobType}
                    validationType={this.state.validationType} onChange={this.handleTypeChange} />
                {
                    this.state.validationType === ValidationType.crossValidation &&
                    <CrossValidationNumberInput />
                }
                {
                    this.state.validationType === ValidationType.monteCarloValidation &&
                    <MonteCarloInput />
                }
            </div>
        </>;
    }
    public handleTypeChange = (validationType: ValidationType): void => {
        this.setState({ validationType });
    }
}
