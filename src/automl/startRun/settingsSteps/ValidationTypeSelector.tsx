import { values } from "lodash";
import { Dropdown, IDropdownOption } from "office-ui-fabric-react";
import * as React from "react";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { RunType } from "../../services/constants/RunType";
import { ValidationType } from "../../services/constants/ValidationType";

export interface IValidationTypeSelectorProps {
    validationType: ValidationType;
    jobType: RunType;
    onChange(type: ValidationType): void;
}

export interface IValidationTypeSelectorStates {
    options: IDropdownOption[];
}

export const validationTypeOptions = {
    CrossValidation: {
        key: ValidationType.crossValidation,
        text: "K-fold cross validation"
    },
    MonteCarlo: {
        key: ValidationType.monteCarloValidation,
        text: "Monte Carlo cross validation"
    }
};

export class ValidationTypeSelector extends React.Component<IValidationTypeSelectorProps, IValidationTypeSelectorStates> {
    constructor(props: IValidationTypeSelectorProps) {
        super(props);
        this.state = {
            options: this.getOptions()
        };
    }
    public componentDidUpdate(prevProp: IValidationTypeSelectorProps): void {
        if (this.props.jobType !== prevProp.jobType) {
            if (this.props.jobType === "forecasting") {
                this.props.onChange(ValidationType.crossValidation);
            }
            this.setState({ options: this.getOptions() });
        }
    }
    public render(): React.ReactNode {
        const dropdownId = "validationType";

        return <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
                <LabelWithCallout required={false} htmlFor={dropdownId} labelText="Validation type">
                    The type of validation, forecasting only supports K-fold cross validation
                </LabelWithCallout>
            </div>
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
                <Dropdown
                    placeholder="Select an validation type"
                    ariaLabel="Validation type"
                    options={this.state.options}
                    onChange={this.handleOptionChange}
                    defaultSelectedKey={this.props.validationType}
                    disabled={this.props.jobType === "forecasting"}
                />
            </div>
        </div>;
    }
    public handleOptionChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
        if (option) {
            this.props.onChange(option.key as ValidationType);
        }
    }

    private getOptions(): IDropdownOption[] {
        if (this.props.jobType === "forecasting") {
            return [validationTypeOptions.CrossValidation];
        }
        return values(validationTypeOptions);
    }
}
