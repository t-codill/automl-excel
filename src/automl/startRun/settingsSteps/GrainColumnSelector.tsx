import { isEqual } from "lodash";
import * as React from "react";
import { FormTagPicker } from "../../components/Form/FormTagPicker";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface IGrainColumnSelectorProps {
    timeSeriesColumn: string | undefined;
    targetColumn: string | undefined;
    columns: string[];
    selectedFeatures: Set<string>;
}

export class GrainColumnSelector extends React.Component<IGrainColumnSelectorProps> {
    private readonly tagPicker = React.createRef<FormTagPicker<ISettingsStepParams, "grainColumns">>();

    public componentDidUpdate(prevProps: IGrainColumnSelectorProps): void {
        if ((prevProps.targetColumn !== this.props.targetColumn || prevProps.timeSeriesColumn !== this.props.timeSeriesColumn
            || !isEqual(prevProps.selectedFeatures, this.props.selectedFeatures))
        ) {
            if (this.tagPicker && this.tagPicker.current) {
                this.tagPicker.current.validate();
            }
        }
    }
    public render(): React.ReactNode {
        const dropdownId = "advancedSettingsGrainColumnSelector";

        return <>
            <LabelWithCallout required={false} htmlFor={dropdownId} labelText="Series name column(s)">
                Select series name column(s) for time series. The selection may not include the target column.
            </LabelWithCallout>
            <FormTagPicker<ISettingsStepParams, "grainColumns">
                field="grainColumns"
                id={dropdownId}
                placeholder="Select column(s)..."
                items={this.props.columns}
                validators={[
                    this.validateTargetColumn,
                    this.validateSelectedFeature,
                    this.validateTimeSeriesColumn]}
                ref={this.tagPicker}
            />
        </>;
    }
    private readonly validateTargetColumn = (value: string[] | undefined): string | undefined => {
        if (this.props.targetColumn && value && value.length > 0 && value.includes(this.props.targetColumn)) {
            return "Series name column(s) should not contain target column.";
        }
        return undefined;
    }
    private readonly validateTimeSeriesColumn = (value: string[] | undefined): string | undefined => {
        if (this.props.timeSeriesColumn && value && value.length > 0 && value.includes(this.props.timeSeriesColumn)) {
            return "Series name column(s) should not contain time column.";
        }
        return undefined;
    }
    private readonly validateSelectedFeature = (value: string[] | undefined): string | undefined => {
        const hasInValidColumn = (col: string) => {
            return !this.props.selectedFeatures.has(col);
        };
        if (value && value.length > 0) {
            const invalid = value.filter(hasInValidColumn);
            if (invalid.length) {
                return `${invalid.join(",")} ${invalid.length > 1 ? "have" : "has"} been excluded, please remove here or toggle above to include.`;
            }
        }
        return undefined;
    }
}
