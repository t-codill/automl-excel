import { AzureMachineLearningDataPrepClient, AzureMachineLearningDataPrepModels } from "@vienna/dataprep";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class DataPrepService extends ServiceBaseNonArm<AzureMachineLearningDataPrepClient> {
    constructor(props: IServiceBaseProps) {
        super(props, AzureMachineLearningDataPrepClient, props.discoverUrls.history);
    }

    public async startDataProfiling(
        dataStoreName: string,
        blobName: string,
        experimentName: string,
        computeTargetName: string,
        topNSample: number
    ): Promise<AzureMachineLearningDataPrepModels.ProfileJobDto | undefined> {

        const response = await this.send(async (client, abortSignal) => {
            return client.dataPrep.startProfileJob(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, {
                abortSignal,
                dto: {
                    computeTargetName,
                    dataStoreName,
                    dataPath: blobName,
                    experimentName,
                    topNSample,
                    outputVersion: "2.0"
                }
            });
        });
        return response;
    }
}
