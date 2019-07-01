import { isEqual } from "lodash";
import { IDropdownOption } from "office-ui-fabric-react";
import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface ITimeSeriesColumnSelectorProps {
    targetColumn: string | undefined;
    columns: string[];
    selectedFeatures: Set<string>;
}

export class TimeSeriesColumnSelector extends React.PureComponent<ITimeSeriesColumnSelectorProps> {
    public dropdown = React.createRef<FormDropdown<ISettingsStepParams, "timeSeriesColumn">>();
    constructor(props: ITimeSeriesColumnSelectorProps) {
        super(props);
        this.state = {
            options: this.getOptions()
        };
    }

    public componentDidUpdate(prevProps: ITimeSeriesColumnSelectorProps): void {
        if ((prevProps.targetColumn !== this.props.targetColumn || !isEqual(prevProps.selectedFeatures, this.props.selectedFeatures))) {
            if (this.dropdown && this.dropdown.current) {
                this.dropdown.current.validate();
            }
        }
    }

    public render(): React.ReactNode {
        const dropdownId = "settingsStepsTimeColumnSelector";
        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Time column">
                The column which holds the timestamp for time series data
            </LabelWithCallout>
            <FormDropdown<ISettingsStepParams, "timeSeriesColumn">
                field="timeSeriesColumn"
                id={dropdownId}
                required={true}
                placeholder="Select a time column..."
                options={this.getOptions()}
                validators={[
                    Validators.required("Time column is required for time series"),
                    this.targetColumnValidator,
                    this.selectedFeatureValidator
                ]}
                ref={this.dropdown}
            />
        </>;
    }

    private getOptions(): IDropdownOption[] {
        return this.props.columns.map((column): IDropdownOption => ({
            key: column,
            text: column
        }));
    }

    private readonly targetColumnValidator = (value: string | undefined): string | undefined => {
        if (value && this.props.targetColumn && value === this.props.targetColumn) {
            return "Time column should not be the same as target column";
        }
        return undefined;
    }

    private readonly selectedFeatureValidator = (value: string | undefined): string | undefined => {
        if (value && this.props.selectedFeatures && !this.props.selectedFeatures.has(value)) {
            return `${value} has been excluded, please remove here or toggle above to include`;
        }
        return undefined;
    }
}
