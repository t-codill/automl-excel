import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { IVMSizeResult } from "../WorkSpaceService";

export class WorkSpaceService {

    private readonly sampleWorkSpace: AzureMachineLearningWorkspacesModels.Workspace = {
        id: "Test_ID",
        name: "Test_WorkSpace",
        location: "eastus",
        discoveryUrl: "https://dummyurl.dummy",
    };

    private readonly sampleCompute: AzureMachineLearningWorkspacesModels.ComputeResource = {
        id: "Test_ID",
        name: "Test_Compute",
        location: "eastus",
    };

    private readonly sampleVMSize: AzureMachineLearningWorkspacesModels.VirtualMachineSize = {
        name: "Standard_DS1_v2",
        family: "standardDSv2Family",
        vCPUs: 1,
        osVhdSizeMB: 1047552,
        maxResourceVolumeMB: 7168,
        memoryGB: 3.5,
        lowPriorityCapable: true,
        premiumIO: true
    };

    public async listWorkspaces(): Promise<AzureMachineLearningWorkspacesModels.Workspace[] | undefined> {
        return [this.sampleWorkSpace];
    }

    public async tryGetWorkspace(): Promise<AzureMachineLearningWorkspacesModels.Workspace | null | undefined> {
        return this.sampleWorkSpace;
    }

    public async getWorkspace(): Promise<AzureMachineLearningWorkspacesModels.Workspace | undefined> {
        return this.sampleWorkSpace;
    }

    public async tryGetCompute(): Promise<AzureMachineLearningWorkspacesModels.ComputeResource | null | undefined> {
        return this.sampleCompute;
    }

    public async listComputes(): Promise<AzureMachineLearningWorkspacesModels.ComputeResource[] | undefined> {
        return [this.sampleCompute];
    }

    public async createCompute(): Promise<AzureMachineLearningWorkspacesModels.ComputeResource | undefined> {
        return this.sampleCompute;
    }

    public async listVmSizes(): Promise<IVMSizeResult | undefined> {
        return { ...[this.sampleVMSize], amlCompute: [this.sampleVMSize] };
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
