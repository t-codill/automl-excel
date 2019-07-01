import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";
import { Icon, IDropdownOption, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { MetricLabel } from "../../services/constants/MetricLabel";
import { MetricType } from "../../services/constants/MetricType";
import { RunType } from "../../services/constants/RunType";
import { ISettingsStepParams } from "./ISettingsStepParams";

export interface IMetricSelectorProps {
    jobType: RunType | undefined;
}

interface IMetricSelectorState {
    options: IDropdownOption[];
}

export class MetricSelector extends React.Component<IMetricSelectorProps, IMetricSelectorState> {
    constructor(props: IMetricSelectorProps) {
        super(props);
        this.state = {
            options: this.loadOptions()
        };
    }

    public componentDidUpdate(prevProps: IMetricSelectorProps): void {
        if (prevProps.jobType !== this.props.jobType) {
            this.setState({ options: this.loadOptions() });
        }
    }
    public render(): React.ReactNode {
        const dropdownId = "settingsStepsMetric";
        const defaultMetric = this.getDefaultMetric();
        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Primary metric">
                Select the type of metric that the machine learning algorithm will be measure by. Each training job type has a different set of metrics to choose from.&nbsp;
                    <Link className="ms-CalloutExample-link" href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#explore-model-metrics" target="_blank">
                    Learn more <Icon iconName="NavigateExternalInline" />
                </Link>.
            </LabelWithCallout>
            <FormDropdown<ISettingsStepParams, "metric">
                key={`${dropdownId}-${defaultMetric}`}
                field="metric"
                id={dropdownId}
                required={true}
                placeholder="Select a metric..."
                options={this.state.options}
                validators={[
                    Validators.required("Metric is required")
                ]}
                defaultFormValue={defaultMetric}
                initialSelectedKey={defaultMetric}
            /></>;
    }

    private readonly getDefaultMetric = () => {
        return this.props.jobType
            ? MetricType[this.props.jobType][0]
            : undefined;
    }

    private readonly loadOptions = () => {
        const metrics: AzureMachineLearningJasmineManagementModels.PrimaryMetric[] =
            this.props.jobType
                ? MetricType[this.props.jobType]
                : [];
        return metrics.map((metric): IDropdownOption => ({
            key: metric,
            text: metric,
            title: MetricLabel[metric]
        }));
    }
}
