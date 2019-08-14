import { NotNullableProperties } from "../../common/utils/NotNullableProperties";
import { IChildRunData } from "../ChildRun";

export const failureRun: NotNullableProperties<IChildRunData> = {
    run: {
        runId: "AutoML_002",
        status: "Failed",
        parentRunId: "AutoML_000",
        startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-02-01T08:20:30.000Z"),
        properties: undefined
    },
    runMetrics: {},
    experimentName: ""
};
