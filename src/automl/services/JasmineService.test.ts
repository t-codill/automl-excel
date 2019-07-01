import { testContext } from "../common/context/__data__/testContext";
import { settingParams } from "./__data__/settingParams";
import { JasmineService } from "./JasmineService";
import * as JasmineServiceAmlSettings from "./JasmineServiceAmlSettings";
import * as JasmineServiceJsonDefinition from "./JasmineServiceJsonDefinition";

jest.mock("@vienna/jasmine");

const service = new JasmineService(testContext);

describe("JasmineService", () => {
    beforeEach(() => {
        const jsonSpy: jest.SpyInstance = jest.spyOn(JasmineServiceJsonDefinition, "getJsonDefinition");
        jsonSpy.mockReturnValue("##JasmineServiceJsonDefinition##");
        const amlSpy: jest.SpyInstance = jest.spyOn(JasmineServiceAmlSettings, "getAmlSettings");
        amlSpy.mockReturnValue("##JasmineServiceAmlSettings##");
    });
    it("should createRun", async () => {
        const result = await service.createRun(
            ["feature1", "feature2"],
            {
                data: [],
                delimiter: ",",
                hasHeader: true,
                header: []
            },
            "sampleExperimentName",
            { name: "sampleCompute", properties: { computeType: "VirtualMachine" } },
            "sampleDataStore",
            "sampleFileName",
            settingParams);
        expect(result)
            .toMatchSnapshot();
    });

    it("should startRun", async () => {
        const result = await service.startRun("AutoML_000", "sampleExperiment", { name: "sampleCompute", properties: { computeType: "VirtualMachine" } });
        expect(result)
            .toMatchSnapshot();
    });

    it("should cancelRun", async () => {
        const result = await service.cancelRun("AutoML_000", "sampleExperiment");
        expect(result)
            .toMatchSnapshot();
    });

    it("should continueRun", async () => {
        const result = await service.continueRun("AutoML_000", "sampleExperiment", 100);
        expect(result)
            .toMatchSnapshot();
    });

    it("should return undefined for disposed service", async () => {
        const result = service.createRun(
            ["feature1", "feature2"],
            {
                data: [],
                delimiter: ",",
                hasHeader: true,
                header: []
            },
            "sampleExperimentName",
            { name: "sampleCompute", properties: { computeType: "VirtualMachine" } },
            "sampleDataStore",
            "sampleFileName",
            settingParams);
        service.dispose();
        expect(await result)
            .toBeUndefined();
    });
});
