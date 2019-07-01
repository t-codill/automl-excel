import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";

const metricLabel: { [metric in AzureMachineLearningJasmineManagementModels.PrimaryMetric]: string } = {
    AUC_weighted: "Weighted Area Under The Curve",
    accuracy: "Accuracy",
    norm_macro_recall: "Normed Macro Recall",
    average_precision_score_weighted: "Weighted Average Precision",
    precision_score_weighted: "Weighted Precision",
    spearman_correlation: "Spearman Correlation",
    normalized_root_mean_squared_error: "Normalized Root Mean Squared Error",
    r2_score: "R2 Score",
    normalized_mean_absolute_error: "Normalized Median Absolute Error",
    normalized_root_mean_squared_log_error: "Normalized Root Mean Squared Log Error"
};

export { metricLabel as MetricLabel };
