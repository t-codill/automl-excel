import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";

export type ComputeType = "Compute" | "AKS" | "AmlCompute" | "VirtualMachine" | "HDInsight" | "DataFactory" | "Databricks" | "DataLakeAnalytics";

export const getComputeResources = (
    testComputeType: ComputeType,
    testProvisioningState: AzureMachineLearningWorkspacesModels.ProvisioningState | undefined) => {
    let compute: AzureMachineLearningWorkspacesModels.ComputeResource[];
    if (testComputeType === "AmlCompute") {
        compute = [
            {
                name: "Compute1",
                id: "ComputeId1",
                properties: {
                    computeType: testComputeType,
                    provisioningState: testProvisioningState,
                    properties: {
                        scaleSettings: {
                            maxNodeCount: 2,
                            minNodeCount: 0
                        }
                    }
                }
            },
            {
                name: "Compute2",
                id: "ComputeId2",
                properties: {
                    computeType: testComputeType,
                    provisioningState: testProvisioningState,
                    properties: {
                        scaleSettings: {
                            maxNodeCount: 2,
                            minNodeCount: 1
                        }
                    }
                }
            },
            {
                name: "Compute No ID",
                properties: {
                    computeType: testComputeType,
                    provisioningState: testProvisioningState,
                    properties: {
                        scaleSettings: {
                            maxNodeCount: 2,
                            minNodeCount: 1
                        }
                    }
                }
            },
            {
                name: "Compute unusable",
                properties: {
                    computeType: testComputeType,
                    provisioningState: testProvisioningState,
                    properties: {
                        scaleSettings: {
                            maxNodeCount: 2,
                            minNodeCount: 1
                        },
                        nodeStateCounts: {
                            unusableNodeCount: 2
                        }
                    }
                }
            },
            {
                name: "Compute No Property",
                id: "ComputeId2"
            }
        ];
    }
    else {
        compute = [
            {
                name: "Compute1",
                id: "ComputeId1",
                properties: {
                    // tslint:disable-next-line: no-any
                    computeType: testComputeType as any,
                    provisioningState: testProvisioningState
                }
            }
        ];
    }
    return compute;
};
