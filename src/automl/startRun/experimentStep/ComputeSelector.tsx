import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { reduce } from "lodash";
import { Icon, IDropdownOption, Link } from "office-ui-fabric-react";
import * as React from "react";
import { computeUtils } from "../../common/utils/computeUtils";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { LabelWithCallout } from "../../components/Label/LabelWithCallout";
import { IExperimentStepCallback } from "./ExperimentStep";

interface IComputeSelectorProps {
    computes: AzureMachineLearningWorkspacesModels.ComputeResource[] | undefined;
    selectedComputeId: string | undefined;
    readonly: boolean;
    refreshing: boolean;
    onEditClick(): void;
}

export class ComputeSelector extends React.PureComponent<IComputeSelectorProps> {

    public render(): React.ReactNode {
        const dropdownId = "experimentStepComputeSelector";
        return <>
            <LabelWithCallout required={true} htmlFor={dropdownId} labelText="Select a training compute">
                A cloud compute resource is required to run the experiment in Azure.
                You can use your existing Azure ML compute resource, or create a new one.
                Note that compute resource has its own costs, refer to the &nbsp;
                <Link className="ms-CalloutExample-link" href="https://azure.microsoft.com/en-us/pricing/details/machine-learning-service/" target="_blank">
                    pricing details <Icon iconName="NavigateExternalInline" />
                </Link> for more information.
                Computes marked "profiling enabled" support additional data profiling capabilities.</LabelWithCallout>
            <FormDropdown<IExperimentStepCallback, "computeId">
                field="computeId"
                id={dropdownId}
                required={true}
                placeholder="Select a Compute..."
                options={this.loadOptions()}
                buttonIconProps={
                    {
                        iconName: this.getIcon()
                    }
                }
                onClick={this.props.readonly ? this.props.onEditClick : undefined}
                validators={[
                    Validators.required("Compute is required")
                ]}
            />
        </>;
    }
    private readonly getIcon = () => {
        if (this.props.refreshing) {
            return "ProgressRingDots";
        }
        if (this.props.readonly) {
            return "Edit";
        }
        return "ChevronDown";
    }

    private readonly loadOptions = () => {
        return reduce(this.props.computes,
            (options, compute) => this.computeOptionsReducer(options, compute),
            [] as IDropdownOption[]);
    }

    private readonly computeOptionsReducer = (options: IDropdownOption[], compute: AzureMachineLearningWorkspacesModels.ComputeResource) => {
        const computeUnion = compute.properties;
        if (computeUnion) {
            switch (computeUnion.computeType) {
                case "AmlCompute": {
                    options.push(this.getComputeOptions(compute, computeUtils.isComputeProfilingEnabled(compute)));
                    break;
                }
                case "VirtualMachine": {
                    options.push(this.getComputeOptions(compute, true));
                    break;
                }
                default:
            }
        }
        return options;
    }

    private readonly getComputeOptions = (compute: AzureMachineLearningWorkspacesModels.ComputeResource, profilingEnabled: boolean) => {
        const provisioning = this.getProvisioningInfo(compute);
        const profilingText = this.getProfilingText(profilingEnabled);
        const option: IDropdownOption = {
            key: compute.id || "",
            text: `${compute.name}${provisioning.message}${profilingText}`,
            disabled: !provisioning.isSuccessful
        };
        return option;
    }

    private readonly getProfilingText = (profilingEnabled: boolean) => {
        return profilingEnabled ? " (profiling enabled)" : "";
    }

    private readonly getProvisioningInfo = (compute: AzureMachineLearningWorkspacesModels.ComputeResource) => {
        const isComputeUsable = computeUtils.isComputeUsable(compute);
        const isProvisioningSuccessful = compute.properties && compute.properties.provisioningState === "Succeeded";
        let message = "";
        if (!isProvisioningSuccessful) {
            message = ` (${(compute.properties && compute.properties.provisioningState) ? compute.properties.provisioningState : "Unknown"})`;
        } else if (!isComputeUsable) {
            message = " (Unusable)";
        }
        return { message, isSuccessful: isProvisioningSuccessful && isComputeUsable };
    }
}
