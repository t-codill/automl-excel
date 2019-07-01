import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";
import { ISettingsStepParams } from "../startRun/settingsSteps/ISettingsStepParams";
import { MetricType } from "./constants/MetricType";
import { RunType } from "./constants/RunType";

export class AdvancedSetting {
    public jobType: RunType;
    public column: string;
    public metric: AzureMachineLearningJasmineManagementModels.PrimaryMetric;
    public experimentTimeoutMinutes: number;
    public maxIteration: number;
    public experimentExitScore: number | null;
    public maxConcurrent: number;
    public maxCores: number;
    public preprocess: boolean;
    public nCrossValidations: number;
    public blacklistAlgos: string[] | null;
    public validationSize: number | null;
    public timeSeriesColumn: string | null;
    public maxHorizon: number | null;
    public grainColumns: string[] | null;

    // tslint:disable-next-line:cyclomatic-complexity
    constructor(input: ISettingsStepParams) {
        this.jobType = input.jobType || "classification";
        this.column = input.column || "";
        this.metric = input.metric || MetricType[this.jobType][0];
        this.experimentTimeoutMinutes = Number(input.trainingJobTime) || 60;
        this.maxIteration = Number(input.maxIteration) || 100;
        this.experimentExitScore = Number(input.metricThreshold) || null;
        this.maxConcurrent = Number(input.maxConcurrentIterations) || 1;
        this.maxCores = Number(input.maxCores) || -1;
        this.preprocess = input.preprocessing === undefined ? true : input.preprocessing;
        this.blacklistAlgos = input.blacklistAlgos;
        this.nCrossValidations = Number(input.crossValidationNumber) || 5;
        this.validationSize = Number(input.percentageValidation) / 100 || null;
        this.timeSeriesColumn = input.timeSeriesColumn || null;
        this.maxHorizon = Number(input.maxHorizon) || null;
        this.grainColumns = input.grainColumns;
    }
}
