import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { RestResponse } from "@azure/ms-rest-js";
import { AzureMachineLearningJasmineManagementClient, AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";
import { ICsvData } from "../common/utils/csv";
import { escapeQuote } from "../common/utils/escapeQuote";
import { stringifyToPython } from "../common/utils/stringifyToPython";
import { AdvancedSetting } from "./AdvancedSetting";
import { getAmlSettings } from "./JasmineServiceAmlSettings";
import { getDataPrepSettings } from "./JasmineServiceDataPrepSettings";
import { getJsonDefinition, SDKFlight } from "./JasmineServiceJsonDefinition";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class JasmineService extends ServiceBaseNonArm<AzureMachineLearningJasmineManagementClient> {
    constructor(props: IServiceBaseProps) {
        super(props, AzureMachineLearningJasmineManagementClient, props.discoverUrls.history);
    }

    public async createRun(
        features: string[],
        previewData: ICsvData,
        experimentName: string,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource,
        dataStoreName: string,
        fileName: string,
        advancedSettingParams: AdvancedSetting): Promise<string | undefined> {

        const response = await this.send(async (client, abortSignal) => {
            return client.jasmine.createParentRun(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, {
                abortSignal,
                timeout: 120000,
                createParentRunDto: this.getRunSettings(
                    features,
                    previewData,
                    experimentName,
                    compute,
                    dataStoreName,
                    fileName,
                    advancedSettingParams)
            });
        });

        if (!response) {
            return undefined;
        }

        return response._response.bodyAsText;
    }

    public async startRun(runId: string, experimentName: string, compute: AzureMachineLearningWorkspacesModels.ComputeResource)
        : Promise<AzureMachineLearningJasmineManagementModels.RunStatus | undefined> {

        const response = this.send(async (client, abortSignal) => {
            return client.jasmine.postRemoteSnapshotRun(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, runId, {
                abortSignal,
                timeout: 120000,
                jsonDefinition: JSON.stringify(getJsonDefinition(compute, this.props.flight.get("SDKFlight") as SDKFlight, this.props.flight.get("SDKVersion")))
            });
        });
        return response;
    }

    public async cancelRun(
        runId: string,
        experimentName: string): Promise<{} | undefined> {

        return this.send(async (client, abortSignal) => {
            return client.jasmine.cancelChildRun(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, runId, {
                abortSignal
            });
        });
    }

    public async continueRun(
        runId: string,
        experimentName: string,
        iterations: number): Promise<RestResponse | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.jasmine.continueRun(this.props.subscriptionId, this.props.resourceGroupName, this.props.workspaceName, experimentName, runId, {
                abortSignal,
                updatedIterations: iterations
            });
        });
    }

    private getRunSettings(
        features: string[],
        previewData: ICsvData,
        experimentName: string,
        compute: AzureMachineLearningWorkspacesModels.ComputeResource,
        dataStoreName: string,
        fileName: string,
        advancedSettingParams: AdvancedSetting): AzureMachineLearningJasmineManagementModels.CreateParentRunDto {

        const primaryMetric = advancedSettingParams.metric;
        const amlSettings = getAmlSettings(experimentName, compute, this.props, advancedSettingParams);
        const dataPrepSettings = getDataPrepSettings(dataStoreName, fileName, previewData, advancedSettingParams.column, features);
        const setting: AzureMachineLearningJasmineManagementModels.CreateParentRunDto = {
            numIterations: advancedSettingParams.maxIteration,
            metrics: [primaryMetric],
            primaryMetric,
            trainSplit: 0,
            maxTimeSeconds: 3600,
            acquisitionParameter: 0,
            numCrossValidation: 5,
            target: compute.name,
            rawAMLSettingsString: stringifyToPython(amlSettings),
            amlSettingsJsonString: JSON.stringify(amlSettings),
            dataPrepJsonString: (escapeQuote(JSON.stringify(dataPrepSettings))),
            enableSubsampling: false
        };
        return setting;
    }
}
