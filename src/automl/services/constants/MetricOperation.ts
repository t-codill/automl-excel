import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";

type MetricOperation = "maximize" | "minimize";

const metricOperation: { [metric in AzureMachineLearningJasmineManagementModels.PrimaryMetric]: MetricOperation } = {
    AUC_weighted: "maximize",
    accuracy: "maximize",
    norm_macro_recall: "maximize",
    average_precision_score_weighted: "maximize",
    precision_score_weighted: "maximize",
    spearman_correlation: "maximize",
    normalized_root_mean_squared_error: "minimize",
    r2_score: "maximize",
    normalized_mean_absolute_error: "minimize",
    normalized_root_mean_squared_log_error: "minimize",
};

export { metricOperation as MetricOperation };
