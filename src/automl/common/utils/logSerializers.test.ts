import { logSerializers } from "./logSerializers";

describe("logSerializers", () => {
    describe("advancedSettingsLogSerializer", () => {
        it("should serialize settings", () => {
            expect(logSerializers.advancedSettingsLogSerializer({
                jobType: "classification",
                column: "foo",
                metric: "AUC_weighted",
                experimentTimeoutMinutes: 60,
                maxIteration: 15,
                experimentExitScore: 0.99,
                maxConcurrent: 1,
                maxCores: 2,
                preprocess: true,
                nCrossValidations: 5,
                blacklistAlgos: ["algo_1", "algo_2"],
                validationSize: 0.2,
                timeSeriesColumn: "ts_col",
                grainColumns: ["grain_col_1", "grain_col_2"],
                maxHorizon: 10
            }))
                .toMatchSnapshot();
        });

        it("should ignore optional values", () => {
            expect(logSerializers.advancedSettingsLogSerializer({
                jobType: "classification",
                column: "foo",
                metric: "AUC_weighted",
                experimentTimeoutMinutes: 60,
                maxIteration: 15,
                experimentExitScore: null,
                maxConcurrent: 1,
                maxCores: 2,
                preprocess: true,
                nCrossValidations: 5,
                blacklistAlgos: null,
                validationSize: null,
                grainColumns: null,
                maxHorizon: null,
                timeSeriesColumn: null
            }))
                .toMatchSnapshot();
        });
    });
});
