import { getScoringFileFromTemplate } from "./getScoringFileFromTemplate";

describe("getScoringFileFromTemplate", () => {
    it("should return undefined if run Id is undefined", () => {
        expect(getScoringFileFromTemplate({}, undefined))
            .toBeUndefined();
    });

    it("should return undefined if run is undefined", () => {
        expect(getScoringFileFromTemplate(undefined, "foo"))
            .toBeUndefined();
    });

    it("should return undefined if run properties is undefined", () => {
        expect(getScoringFileFromTemplate({ properties: undefined }, "foo"))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString is empty", () => {
        expect(getScoringFileFromTemplate({ properties: { DataPrepJsonString: "" } }, "foo"))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString is invalid", () => {
        expect(getScoringFileFromTemplate({ properties: { DataPrepJsonString: "invalid" } }, "foo"))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString features is missing", () => {
        expect(getScoringFileFromTemplate({ properties: { DataPrepJsonString: "{}" } }, "foo"))
            .toBeUndefined();
    });

    it("should return valid scoring file with valid DataPrepJsonString", () => {
        expect(getScoringFileFromTemplate({
            properties: {
                DataPrepJsonString: "{\\\"features\\\":[\\\"timeStamp\\\",\\\"precip\\\",\\\"temp\\\"]}"
            }
        }, "foo"))
            .toMatchSnapshot();
    });
});
