import { NotNullableProperties } from "../../common/utils/NotNullableProperties";
import { IChildRunData } from "../ChildRun";

export const classificationSuccessRun: NotNullableProperties<IChildRunData> = {
    run: {
        runId: "AutoML_001",
        parentRunId: "AutoML_000",
        status: "Completed",
        startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-02-01T08:20:30.000Z"),
        properties: {
            iteration: "9",
            run_algorithm: "Ensemble",
            run_preprocessor: "rpp1"
        }
    },
    runMetrics: {
        scalarMet1: "1",
        scalarMet2: "2",
        scalarMet3: "3",
        accuracy_table: {},
        confusion_matrix: {}
    },
    modelUri: "sampleModelUri",
    experimentName: "classificationSuccess"
};
