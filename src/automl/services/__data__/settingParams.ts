import { AdvancedSetting } from "../AdvancedSetting";

export const settingParams: AdvancedSetting = {
    jobType: "classification",
    column: "1",
    metric: "AUC_weighted",
    experimentTimeoutMinutes: 60,
    maxIteration: 15,
    experimentExitScore: 0.99,
    maxConcurrent: 1,
    maxCores: 2,
    preprocess: true,
    nCrossValidations: 5,
    blacklistAlgos: null,
    validationSize: 0.2,
    grainColumns: null,
    maxHorizon: null,
    timeSeriesColumn: null
};
