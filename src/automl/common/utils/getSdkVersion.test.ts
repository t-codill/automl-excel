import { getSdkVersion } from "./getSdkVersion";

const defaultVersion = "1.1.1";
jest.unmock("./getSdkVersion");
jest.mock("../defaultSdkVersion", () => ({
    defaultSdkVersion: "1.1.1"
}));

const sdkVersionResultTable = [
    [undefined, defaultVersion],
    ["2.0", "2.0"],
    ["", ""],
];

describe("getSdkVersion", () => {
    it.each(sdkVersionResultTable)(`if run is undefined and default-sdk-version is '%s', should return '%s'`, async (sdkVersion, result) => {
        expect(await getSdkVersion(undefined, sdkVersion))
            .toBe(result);
    });

    it("if run is undefined and default-sdk-version is not specified', should return defaultSdkVersion", async () => {
        expect(await getSdkVersion(undefined))
            .toBe(defaultVersion);
    });

    it.each(sdkVersionResultTable)("if dependencies_versions is invalid and default-sdk-version is '%s', should return '%s'", async (sdkVersion, result) => {
        expect(await getSdkVersion({
            properties: {
                dependencies_versions: "invalid"
            }
        }, sdkVersion))
            .toBe(result);
    });

    it.each(sdkVersionResultTable)("if dependencies_versions doesn't have azureml-train-automl and default-sdk-version is '%s', should return '%s'", async (sdkVersion, result) => {
        expect(await getSdkVersion({
            properties: {
                dependencies_versions: `{"foo": "0.0.1"}`
            }
        }, sdkVersion))
            .toBe(result);
    });

    it.each(sdkVersionResultTable)("should return azureml-train-automl when default-sdk-version is '%s'", async (sdkVersion, _result) => {
        expect(await getSdkVersion({
            properties: {
                dependencies_versions: `{"azureml-train-automl": "8.8.8"}`
            }
        }, sdkVersion))
            .toBe("8.8.8");
    });
});
