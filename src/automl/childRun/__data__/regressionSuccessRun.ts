import { NotNullableProperties } from "../../common/utils/NotNullableProperties";
import { IChildRunData } from "../ChildRun";

export const regressionSuccessRun: NotNullableProperties<IChildRunData> = {
    run: {
        runId: "AutoML_003",
        parentRunId: "AutoML_000",
        status: "Completed",
        startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-02-01T08:20:30.000Z"),
        properties: {
            iteration: "0",
            run_algorithm: "GradientBoosting",
            run_preprocessor: "StandardScalerWrapper"
        }
    },
    runMetrics: {
        residuals: {},
        predicted_true: {}
    },
    modelUri: "sampleModelUri",
    experimentName: "regressionSuccess"
};
