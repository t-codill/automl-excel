import { testContext } from "../common/context/__data__/testContext";
import { WorkSpaceService } from "./WorkSpaceService";

jest.mock("@azure/arm-machinelearningservices");

const service = new WorkSpaceService(testContext);

describe("WorkSpaceService work space", () => {
    describe("work space", () => {
        it("should list", async () => {
            const result = await service.listWorkspaces();
            expect(result)
                .toMatchSnapshot();
        });
        it("should tryGetWorkspace", async () => {
            const result = await service.tryGetWorkspace();
            expect(result)
                .toMatchSnapshot();
        });
        it("should get", async () => {
            const result = await service.getWorkspace();
            expect(result)
                .toMatchSnapshot();
        });
    });
    describe("compute", () => {
        it("should list", async () => {
            const result = await service.listComputes();
            expect(result)
                .toMatchSnapshot();
        });
        it("should tryGet", async () => {
            const result = await service.tryGetCompute("sampleCompute");
            expect(result)
                .toMatchSnapshot();
        });
        it("should listVmSizes", async () => {
            const result = await service.listVmSizes();
            expect(result)
                .toMatchSnapshot();
        });
        it("should create", async () => {
            const result = await service.createCompute("sampleCompute", "sampleVmSize", 0, 6);
            expect(result)
                .toMatchSnapshot();
        });
    });
});
