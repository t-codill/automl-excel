import { AdvancedSetting } from "./AdvancedSetting";

describe("AdvancedSetting", () => {
    it("should init default value", async () => {
        const settings = new AdvancedSetting({
            jobType: undefined,
            column: undefined,
            metric: undefined,
            trainingJobTime: undefined,
            maxIteration: undefined,
            metricThreshold: undefined,
            maxConcurrentIterations: undefined,
            maxCores: undefined,
            preprocessing: undefined,
            blacklistAlgos: [],
            crossValidationNumber: undefined,
            percentageValidation: undefined,
            timeSeriesColumn: undefined,
            maxHorizon: undefined,
            grainColumns: []
        });

        expect(settings)
            .toMatchSnapshot();
    });
    it("should init as expected", async () => {
        const settings = new AdvancedSetting({
            jobType: "regression",
            column: "foo",
            metric: "average_precision_score_weighted",
            trainingJobTime: "30",
            maxIteration: "50",
            metricThreshold: "0.8",
            maxConcurrentIterations: "3",
            maxCores: "2",
            preprocessing: false,
            crossValidationNumber: "5",
            percentageValidation: undefined,
            grainColumns: [],
            maxHorizon: undefined,
            timeSeriesColumn: undefined,
            blacklistAlgos: [] // jasmine service expects this as an array that's serialized to JSON string
        });

        expect(settings)
            .toMatchSnapshot();
    });
});
