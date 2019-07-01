import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { Spinner, SpinnerSize } from "office-ui-fabric-react";
import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { Validators } from "../../components/Form/Validators";
import { IVMSizeResult } from "../../services/WorkSpaceService";
import { ICreateComputeParams } from "./ICreateComputeParams";

interface IVmSizeSelectorProps {
    vmSizes: IVMSizeResult | undefined;
}

const DEFAULT_VM_SIZE = "Standard_DS12_v2";

export class VmSizeSelector extends React.PureComponent<IVmSizeSelectorProps> {
    public render(): React.ReactNode {
        if (!this.props.vmSizes) {
            return <Spinner size={SpinnerSize.medium} label="Loading Virtual Machine Sizes" labelPosition="right" />;
        }
        const options = this.props.vmSizes && this.props.vmSizes.amlCompute ? this.props.vmSizes.amlCompute.map(this.getVmSizeOption) : [];
        const defaultOption = options.find((option) => option.key === DEFAULT_VM_SIZE) || options[0];

        return <FormDropdown<ICreateComputeParams, "vmSize">
            field="vmSize"
            required={true}
            label="Select virtual machine size"
            placeholder="Select virtual machine size..."
            options={options}
            validators={[
                Validators.required("Virtual machine size is required")
            ]}
            defaultFormValue={defaultOption ? defaultOption.key : undefined}
        />;
    }

    private readonly getVmSizeOption = (vmSize: AzureMachineLearningWorkspacesModels.VirtualMachineSize) => {
        const option = {
            key: vmSize.name || "",
            text: this.vmSizeToText(vmSize)
        };

        return option;
    }

    private readonly vmSizeToText = (vmSize?: AzureMachineLearningWorkspacesModels.VirtualMachineSize) => {
        if (!vmSize || !vmSize.name) { return ""; }

        const name = vmSize.name.toUpperCase();
        const vCpu = vmSize.vCPUs;
        const memoryGB = vmSize.memoryGB;
        const diskSize = this.getDiskSize(vmSize.maxResourceVolumeMB);

        if (!vCpu && !memoryGB && !diskSize) {
            return name;
        }

        return `${name} --- ${vCpu ? `${vCpu} vCPUs, ` : ""}${memoryGB ? `${memoryGB} GB memory, ` : ""}${diskSize ? `${diskSize} GB storage` : ""}`;
    }

    private readonly getDiskSize = (maxResourceVolumeMB: number | undefined) => {
        return maxResourceVolumeMB ? Math.round(maxResourceVolumeMB / 1024) : undefined;
    }
}
