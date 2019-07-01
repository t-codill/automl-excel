import { AzureMachineLearningJasmineManagementModels } from "@vienna/jasmine";
import { RunType } from "./RunType";

const metricType: { [type in RunType]: AzureMachineLearningJasmineManagementModels.PrimaryMetric[] } = {
    classification: [
        "accuracy",
        "AUC_weighted",
        "norm_macro_recall",
        "average_precision_score_weighted",
        "precision_score_weighted"
    ],
    regression: [
        "spearman_correlation",
        "normalized_root_mean_squared_error",
        "r2_score",
        "normalized_mean_absolute_error"
    ],
    forecasting: [
        "spearman_correlation",
        "normalized_root_mean_squared_error",
        "r2_score",
        "normalized_mean_absolute_error"
    ]
};

export { metricType as MetricType };
