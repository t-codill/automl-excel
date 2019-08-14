import { getDataPrepFeatures } from "./getDataPrepFeatures";

describe("getDataPrepFeatures", () => {
    it("should return undefined if run Id is undefined", () => {
        expect(getDataPrepFeatures({}))
            .toBeUndefined();
    });

    it("should return undefined if run is undefined", () => {
        expect(getDataPrepFeatures(undefined))
            .toBeUndefined();
    });

    it("should return undefined if run properties is undefined", () => {
        expect(getDataPrepFeatures({ properties: undefined }))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString is empty", () => {
        expect(getDataPrepFeatures({ properties: { DataPrepJsonString: "" } }))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString is invalid", () => {
        expect(getDataPrepFeatures({ properties: { DataPrepJsonString: "invalid" } }))
            .toBeUndefined();
    });

    it("should return undefined if DataPrepJsonString features is missing", () => {
        expect(getDataPrepFeatures({ properties: { DataPrepJsonString: "{}" } }))
            .toBeUndefined();
    });

    it("should return valid scoring file with valid DataPrepJsonString", () => {
        expect(getDataPrepFeatures({
            properties: {
                DataPrepJsonString: "{\\\"features\\\":[\\\"timeStamp\\\",\\\"precip\\\",\\\"temp\\\"]}"
            }
        }))
            .toMatchSnapshot();
    });
});
