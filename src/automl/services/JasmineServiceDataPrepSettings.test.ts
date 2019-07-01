import { getDataPrepSettings } from "./JasmineServiceDataPrepSettings";

describe("JasmineServiceDataPrepSettings", () => {
    it("should getDataPrepSettings", async () => {
        const result = getDataPrepSettings("sampleDataStore", "sampleFile", {
            data: [],
            delimiter: ",",
            hasHeader: true,
            header: []
        }, "sampleLabelColumn", ["sampleFeature1", "sampleFeature2", "sampleLabelColumn"]);
        expect(result)
            .toMatchSnapshot();
    });
});
