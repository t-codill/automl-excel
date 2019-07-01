import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { MetricThresholdBounds } from "../../services/constants/MetricThresholdBounds";
import { ISettingsStepParams } from "./ISettingsStepParams";

interface IMetricThresholdProps {
    primaryMetric: string;
}

const metricThresholdInput: React.FunctionComponent<IMetricThresholdProps> = (props: IMetricThresholdProps) => {
    const inputId = "metricThresholdInput";
    const bounds = MetricThresholdBounds[props.primaryMetric];
    return <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <LabelWithCallout required={false} htmlFor={inputId} labelText="Metric score threshold">
                When this threshold value will be reached for an iteration metric the training job will terminate.
                Keep in mind that meaningful models have correlation > 0, otherwise they are as good as guessing the average
                Metric threshold should be between {bounds[0]} and {bounds[1]}
            </LabelWithCallout>
        </div>
        <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
            <FormTextInput<ISettingsStepParams, "metricThreshold">
                field="metricThreshold"
                placeholder="Metric Score Threshold"
                ariaLabel="Please enter metric score threshold here"
                validators={
                    [
                        Validators.isNumber("Metric score threshold must be a number"),
                        Validators.minValue(bounds[0], () => `Metric score threshold must not be less than ${bounds[0]}`),
                        Validators.maxValue(bounds[1], () => `Metric score threshold must not exceed ${bounds[1]}`)
                    ]
                }
            />
        </div>
    </div>;
};

export { metricThresholdInput as MetricThresholdInput };
