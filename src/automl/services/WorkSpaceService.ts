import { AzureMachineLearningWorkspaces, AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { uniqBy } from "lodash";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseArm } from "./ServiceBaseArm";

export interface IVMSizeResult { amlCompute?: AzureMachineLearningWorkspacesModels.VirtualMachineSize[]; }

export class WorkSpaceService extends ServiceBaseArm<AzureMachineLearningWorkspaces> {
    constructor(props: IServiceBaseProps) {
        super(props, AzureMachineLearningWorkspaces);
    }

    public async listWorkspaces(): Promise<AzureMachineLearningWorkspacesModels.Workspace[] | undefined> {
        return uniqBy(await this.getAllWithNext<AzureMachineLearningWorkspacesModels.Workspace, AzureMachineLearningWorkspacesModels.WorkspaceListResult, string>
            (
                async (client, abortSignal) => {
                    return client.workspaces.listBySubscription({
                        abortSignal
                    });
                },
                async (client, abortSignal, nextPageLink) => {
                    return client.workspaces.listBySubscriptionNext(nextPageLink, {
                        abortSignal
                    });
                },
                (r) => r,
                (r) => r.nextLink
            ), (w) => w.id);

    }

    public async tryGetWorkspace(): Promise<AzureMachineLearningWorkspacesModels.Workspace | null | undefined> {
        return this.trySend(async (client, abortSignal) => {
            return client.workspaces.get(this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        });
    }

    public async getWorkspace(): Promise<AzureMachineLearningWorkspacesModels.Workspace | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.workspaces.get(this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal
            });
        });
    }

    public async tryGetCompute(computeName: string): Promise<AzureMachineLearningWorkspacesModels.ComputeResource | null | undefined> {
        return this.trySend(
            async (client, abortSignal) => {
                return client.machineLearningCompute.get(this.props.resourceGroupName, this.props.workspaceName, computeName, {
                    abortSignal
                });
            }
        );

    }

    public async listComputes(): Promise<AzureMachineLearningWorkspacesModels.ComputeResource[] | undefined> {
        return this.getAllWithNext<AzureMachineLearningWorkspacesModels.ComputeResource, AzureMachineLearningWorkspacesModels.PaginatedComputeResourcesList, string>
            (async (client, abortSignal) => {
                return client.machineLearningCompute.listByWorkspace(this.props.resourceGroupName, this.props.workspaceName, {
                    abortSignal
                });
            },
                async (client, abortSignal, nextLink) => {
                    return client.machineLearningCompute.listByWorkspaceNext(nextLink, {
                        abortSignal
                    });
                },
                (res) => res,
                (res) => res.nextLink);

    }

    public async createCompute(
        computeName: string,
        vmSize: string,
        minNodeCount: number,
        maxNodeCount: number
    ): Promise<AzureMachineLearningWorkspacesModels.ComputeResource | undefined> {
        return this.send(
            async (client, abortSignal) => {
                return client.machineLearningCompute.createOrUpdate(this.props.resourceGroupName, this.props.workspaceName,
                    computeName,
                    {
                        location: this.props.location,
                        properties: {
                            computeType: "AmlCompute",
                            properties: {
                                scaleSettings: {
                                    minNodeCount,
                                    maxNodeCount
                                },
                                vmPriority: "Dedicated",
                                vmSize
                            }
                        }
                    },
                    {
                        abortSignal,
                        timeout: 600000
                    });
            });

    }

    public async listVmSizes(): Promise<IVMSizeResult | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.virtualMachineSizes.list(this.props.location, {
                abortSignal
            });
        });
    }
}
