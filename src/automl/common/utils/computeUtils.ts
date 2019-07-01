import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";

const isComputeProfilingEnabled = (compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined): boolean => {
    if (!compute || !compute.properties) {
        return false;
    }
    const computeProps = compute.properties;
    // enabled if compute is "hot"
    if (computeProps.computeType === "VirtualMachine" ||
        (computeProps.computeType === "AmlCompute" &&
            computeProps.properties &&
            computeProps.properties.scaleSettings &&
            computeProps.properties.scaleSettings.minNodeCount &&
            computeProps.properties.scaleSettings.minNodeCount > 0)) {
        return true;
    }
    return false;
};

const isAmlComputeUsable = (amlComputeProps: AzureMachineLearningWorkspacesModels.AmlComputeProperties | undefined) => {
    if (!amlComputeProps || !amlComputeProps.scaleSettings) {
        return false;
    }

    if (!amlComputeProps.nodeStateCounts || !amlComputeProps.nodeStateCounts.unusableNodeCount) {
        return true;
    }

    return amlComputeProps.scaleSettings.maxNodeCount > amlComputeProps.nodeStateCounts.unusableNodeCount;
};

const isComputeUsable = (compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined): boolean => {
    if (!compute || !compute.properties) {
        return false;
    }
    const computeProps = compute.properties;
    if (computeProps.computeType === "VirtualMachine") {
        return true;
    }
    if (computeProps.computeType === "AmlCompute") {
        return isAmlComputeUsable(computeProps.properties);
    }
    return false;
};

export const computeUtils = {
    isComputeProfilingEnabled,
    isComputeUsable
};
