import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { Accordion } from "../../components/Accordion/Accordion";
import { Form } from "../../components/Form/Form";
import { MetricType } from "../../services/constants/MetricType";
import { RunType } from "../../services/constants/RunType";
import { AdvancedSettings } from "./AdvancedSettings";
import { GrainColumnSelector } from "./GrainColumnSelector";
import { ISettingsStepParams } from "./ISettingsStepParams";
import { JobTypeSelector } from "./JobTypeSelector";
import { MaxHorizon } from "./MaxHorizon";
import { TargetColumnSelector } from "./TargetColumnSelector";
import { TimeSeriesColumnSelector } from "./TimeSeriesColumnSelector";

export interface ISettingsStepProps {
    blobHeader: string[];
    dataStoreName: string | undefined;
    compute: AzureMachineLearningWorkspacesModels.ComputeUnion | undefined;
    selectedFeatures: Set<string>;
    onCancel(): void;
    onStart(
        parameters: ISettingsStepParams
    ): void;
}

export interface ISettingsStepState {
    jobType: RunType;
    primaryMetric: string;
    column: string | undefined;
    timeSeriesColumn: string | undefined;
}

export class SettingsStep extends React.Component<ISettingsStepProps, ISettingsStepState> {
    constructor(props: ISettingsStepProps) {
        super(props);
        this.state = {
            jobType: "classification",
            primaryMetric: MetricType.classification[0],
            column: this.props.blobHeader[0],
            timeSeriesColumn: undefined
        };
    }

    public render(): React.ReactNode {
        return <Form onSubmit={this.onSubmit} onUpdated={this.onFormUpdated}>
            <div className="start-run-step-content">
                <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                    <JobTypeSelector
                        jobType={this.state.jobType} />
                </div>
                <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                    <TargetColumnSelector
                        columns={this.props.blobHeader} />
                </div>
                {
                    this.state.jobType === "forecasting" &&
                    <>
                        <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                            <TimeSeriesColumnSelector
                                targetColumn={this.state.column}
                                selectedFeatures={this.props.selectedFeatures}
                                columns={this.props.blobHeader} />
                        </div>
                        <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                            <GrainColumnSelector
                                targetColumn={this.state.column}
                                timeSeriesColumn={this.state.timeSeriesColumn}
                                selectedFeatures={this.props.selectedFeatures}
                                columns={this.props.blobHeader} />
                        </div>
                        <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                            <MaxHorizon />
                        </div>
                    </>
                }
            </div>
            <Accordion
                exclusive={true}
                items={[
                    {
                        title: "Advanced Settings",
                        collapsed: true,
                        disabled: false,
                        element: <AdvancedSettings compute={this.props.compute}
                            jobType={this.state.jobType}
                            primaryMetric={this.state.primaryMetric} />
                    }
                ]} />
            <div className="form-footer">
                <DefaultButton text="Cancel" onClick={this.props.onCancel} />
                <PrimaryButton type="submit" text="Start" disabled={!this.props.dataStoreName} />
            </div>
        </Form>;
    }

    private readonly onFormUpdated = (key: keyof ISettingsStepParams, value: ISettingsStepParams[keyof ISettingsStepParams]) => {
        if (!value) {
            return;
        }
        if (key === "metric") {
            const metric = value.toString();
            if (metric !== this.state.primaryMetric) {
                this.setState({ primaryMetric: metric });
            }
        } else if (key === "column") {
            const column = value.toString();
            this.setState({ column });
        } else if (key === "timeSeriesColumn") {
            const timeSeriesColumn = value.toString();
            this.setState({ timeSeriesColumn });
        } else if (key === "jobType" && this.state.jobType !== value) {
            this.setState({ jobType: value as RunType });
        }
    }

    private readonly onSubmit = (values: ISettingsStepParams) => {
        this.props.onStart(values);
    }
}
