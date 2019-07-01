import { NotNullableProperties } from "../../common/utils/NotNullableProperties";
import { IParentRunData } from "../ParentRun";

export const parentFailureRun: NotNullableProperties<IParentRunData> = {
    run: {
        runId: "AutoML_000",
        parentRunId: undefined,
        status: "Completed",
        startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-02-01T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: "",
            primary_metric: "pm",
            errors: "Setup iteration failed: \\n \t\t\t\t\texception: \\n \t\t\t\t\t\tUnforseenConsequence('Invalid subject in the test chamber') \\n"
        }
    },
    experimentName: "Test",
    childRuns: [],
    childRunMetrics: [
        {
            spearman_correlation: 0.877770827248834
        }
    ]
};
