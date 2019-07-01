import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";
import { RunType } from "../../services/constants/RunType";

export interface ISettingsStepParams {
    jobType: RunType | undefined;
    column: string | undefined;
    metric: AzureMachineLearningJasmineManagementModels.PrimaryMetric | undefined;
    trainingJobTime: string | undefined;
    maxIteration: string | undefined;
    metricThreshold: string | undefined;
    maxConcurrentIterations: string | undefined;
    maxCores: string | undefined;
    preprocessing: boolean | undefined;
    blacklistAlgos: string[];
    crossValidationNumber: string | undefined;
    percentageValidation: string | undefined;
    timeSeriesColumn: string | undefined;
    maxHorizon: string | undefined;
    grainColumns: string[];
}
