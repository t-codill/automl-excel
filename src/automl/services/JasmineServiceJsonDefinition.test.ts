import { getJsonDefinition, SDKFlight } from "./JasmineServiceJsonDefinition";

describe("JasmineServiceJsonDefinition", () => {
    it("should generate:", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, undefined, undefined);
        expect(result)
            .toMatchSnapshot();
    });
    it("aml compute should use docker:", () => {
        const result = getJsonDefinition({ name: "sampleCompute", properties: { computeType: "AmlCompute" } }, undefined, undefined);
        expect(result.Configuration.environment.docker.enabled)
            .toBe(true);
    });
    it("should generate pip dependencies for default sdkVersion", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, undefined, undefined);
        expect(result.Configuration.environment.python.condaDependencies.dependencies)
            .toMatchSnapshot();
    });
    it("should generate pip dependencies for master:", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, "master", undefined);
        expect(result.Configuration.environment.python.condaDependencies.dependencies[1])
            .toMatchSnapshot();
    });
    it("should generate pip dependencies for candidate:", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, "candidate", undefined);
        expect(result.Configuration.environment.python.condaDependencies.dependencies[1])
            .toMatchSnapshot();
    });
    it("should generate pip dependencies for preview:", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, "preview", undefined);
        expect(result.Configuration.environment.python.condaDependencies.dependencies[1])
            .toMatchSnapshot();
    });
    describe.each<SDKFlight | undefined>([undefined, "master", "candidate", "preview", "default"])("for sdk flight: '%s' ", (sdkFlight) => {
        it.each([
            "1",
            "1.1",
            "1.*",
            "1.1.1",
            "1.1.*",
            "1.0.35",
            "1.0.35.242",
            "1.0.35.*",
        ])("should generate pip dependencies for sdkVersion: '%s'", (sdkVersion) => {
            const result = getJsonDefinition({ name: "sampleCompute" }, sdkFlight, sdkVersion);
            const pip = (result.Configuration.environment.python.condaDependencies.dependencies[1] as { pip: string[] }).pip;
            const aml = pip.pop() || "";
            expect(aml.endsWith(`==${sdkVersion}`))
                .toBe(true);
        });
    });

    it("should get custom flight", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, "custom", "--extra-index-url%20https%3A%2F%2Fdemo.com%3B--azureml-train-automl%3D%3D1.0.0");
        expect(result.Configuration.environment.python.condaDependencies.dependencies[1])
            .toEqual({
                pip:
                    ["--extra-index-url https://demo.com", "--azureml-train-automl==1.0.0"]
            });
    });

    it("should get custom flight without sdk version", () => {
        const result = getJsonDefinition({ name: "sampleCompute" }, "custom", "");
        expect(result.Configuration.environment.python.condaDependencies.dependencies[1])
            .toEqual({
                pip:
                    [""]
            });
    });
});
