import { hasDefaultScoring } from "./hasDefaultScoring";

describe("hasDefaultScoring", () => {
    it("should return false if run Id is undefined", () => {
        expect(hasDefaultScoring({}, null))
            .toBeFalsy();
    });

    it("should return false if run is undefined", () => {
        expect(hasDefaultScoring(undefined, null))
            .toBeFalsy();
    });

    it("should return false if run properties is undefined", () => {
        expect(hasDefaultScoring({ properties: undefined }, null))
            .toBeFalsy();
    });

    it("should return false if DataPrepJsonString is empty", () => {
        expect(hasDefaultScoring({ properties: { DataPrepJsonString: "" } }, null))
            .toBeFalsy();
    });

    it("should return false if DataPrepJsonString is invalid", () => {
        expect(hasDefaultScoring({ properties: { DataPrepJsonString: "invalid" } }, null))
            .toBeFalsy();
    });

    it("should return false if DataPrepJsonString features is missing", () => {
        expect(hasDefaultScoring({ properties: { DataPrepJsonString: "{}" } }, null))
            .toBeFalsy();
    });

    it("should return true with valid DataPrepJsonString", () => {
        expect(hasDefaultScoring({
            properties: {
                DataPrepJsonString: "{\\\"features\\\":[\\\"timeStamp\\\",\\\"precip\\\",\\\"temp\\\"]}"
            }
        }, null))
            .toBeTruthy();
    });

    it("should return true with valid DataPrepJsonString", () => {
        expect(hasDefaultScoring({
            properties: {
                DataPrepJsonString: "{\\\"features\\\":[\\\"timeStamp\\\",\\\"precip\\\",\\\"temp\\\"]}"
            }
        }, null))
            .toBeTruthy();
    });
});
