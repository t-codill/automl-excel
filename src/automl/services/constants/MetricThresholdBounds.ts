import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";

const metricThresholdBounds: { [metric in AzureMachineLearningJasmineManagementModels.PrimaryMetric]: number[] } = {
    AUC_weighted: [0, 1],
    accuracy: [0, 1],
    norm_macro_recall: [0, 1],
    average_precision_score_weighted: [0, 1],
    precision_score_weighted: [0, 1],
    spearman_correlation: [-1, 1],
    normalized_root_mean_squared_error: [0, 10],
    r2_score: [-10, 1],
    normalized_mean_absolute_error: [0, 10],
    normalized_root_mean_squared_log_error: [0, 10],

};

export { metricThresholdBounds as MetricThresholdBounds };
