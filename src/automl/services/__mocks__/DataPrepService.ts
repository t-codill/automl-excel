import { AzureMachineLearningDataPrepModels } from "@vienna/dataprep";

export class DataPrepService {
    private readonly dataPath = "dataPath";
    private readonly profileResultPath = "profileResultPath";
    private readonly runId = "runId";

    public async startDataProfiling(
        dataStoreName: string,
        _blobName: string,
        experimentName: string,
        computeTargetName: string,
        _topNSample: number
    ): Promise<AzureMachineLearningDataPrepModels.ProfileJobDto | undefined> {
        return {
            computeTargetName,
            dataStoreName,
            experimentName,
            dataPath: this.dataPath,
            profileResultPath: this.profileResultPath,
            runId: this.runId
        };
    }

    public dispose(): void {
        return;
    }

    public reset(): void {
        return;
    }
}
