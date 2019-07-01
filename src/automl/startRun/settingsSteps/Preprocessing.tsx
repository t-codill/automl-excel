import { Icon, Link } from "office-ui-fabric-react";
import * as React from "react";
import { FormCheckBox } from "../../components/Form/FormCheckBox";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { RunType } from "../../services/constants/RunType";
import { ISettingsStepParams } from "./ISettingsStepParams";
import "./Preprocessing.scss";

export interface IPreprocessingProps {
    jobType: RunType;
}

export class Preprocessing extends React.Component<IPreprocessingProps> {
    public render(): React.ReactNode {
        const inputId = "preprocessingCheck";
        return <div className="ms-Grid preprocessing-container" dir="ltr">
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6 ms-xl6">
                <LabelWithCallout required={false} htmlFor={inputId} labelText="Preprocessing">
                    Enable data preprocessing and automatic feature creation.&nbsp;
                    <Link className="ms-CalloutExample-link"
                        href="https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-configure-auto-train#data-pre-processing-and-featurization"
                        target="_blank">
                        Learn more
                        <Icon iconName="NavigateExternalInline" />
                    </Link>.
                </LabelWithCallout>
            </div>
            <div className="ms-Grid-col ms-sm12 ms-md5 ms-lg5 ms-xl5 preprocessing-checkbox">
                <FormCheckBox<ISettingsStepParams, "preprocessing">
                    field="preprocessing"
                    disabled={this.props.jobType === "forecasting"}
                    defaultFormValue={true}
                />
            </div>
        </div>;
    }
}
