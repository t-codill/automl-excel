import { AzureMachineLearningModelManagementService } from "@vienna/model-management";
import { restCanceledError } from "../../__data__/restCanceledError";
import { testContext } from "../common/context/__data__/testContext";
import { ModelManagementService } from "./ModelManagementService";

jest.mock("@vienna/model-management");

const service = new ModelManagementService(testContext);

describe("ModelManagementService", () => {
    it("should registerModel", async () => {
        const result = await service.registerModel("test", "test description", "test url", "test mime type", "experimentName", "runId");
        expect(result)
            .toMatchSnapshot();
    });
    it("should createAsset", async () => {
        const result = await service.createAsset("test", "test description", "http://www.dummyurl.com/dummy");
        expect(result)
            .toMatchSnapshot();
    });
    it("should getDeployStatus", async () => {
        const result = await service.getDeployStatus("testOperationId");
        expect(result)
            .toMatchSnapshot();
    });

    it("should getScoringUriById", async () => {
        const result = await service.getScoringUriById("testServiceId");
        expect(result)
            .toBe("testScoringUri");
    });
    it("should getScoringUriById with undefined", async () => {
        jest.spyOn(AzureMachineLearningModelManagementService.prototype.services, "queryById")
            .mockImplementation(() => { throw restCanceledError; });
        const result = await service.getScoringUriById("testServiceId");
        expect(result)
            .toBeUndefined();
    });
    it("should getDeployLogs", async () => {
        const testLogResponse = {
            status: 202,
            json: () => {
                return {
                    content: "TestLog"
                };
            }
        } as unknown as Response;
        const fetchSpy = jest.spyOn(window, "fetch");
        fetchSpy.mockReturnValue(Promise.resolve(testLogResponse));
        const result = await service.getDeployLogs("testServiceId");
        expect(result)
            .toBe("TestLog");
    });
    it("should getDeployListByRunId got undefined with undefined runId", async () => {
        const result = await service.getDeployListByRunId(undefined);
        expect(result)
            .toBeUndefined();
    });
    it("should getDeployListByRunId with valid runId", async () => {
        const spy: jest.SpyInstance = jest.spyOn(AzureMachineLearningModelManagementService.prototype.services, "listQuery");
        spy.mockReturnValueOnce(Promise.resolve({
            value: ["value1"],
            nextLink: "https://example.com/?$skipToken=abc"
        }));
        spy.mockReturnValueOnce(Promise.resolve({
            value: ["value2"],
            nextLink: undefined
        }));
        const result = await service.getDeployListByRunId("testServiceId");
        expect(result)
            .toEqual(["value1", "value2"]);
    });
    it("should getDeployListByRunId without skipToken", async () => {
        const spy: jest.SpyInstance = jest.spyOn(AzureMachineLearningModelManagementService.prototype.services, "listQuery");
        spy.mockReturnValueOnce(Promise.resolve({
            value: ["value1"],
            nextLink: "https://example.com/?$skipToken=abc"
        }));
        spy.mockReturnValueOnce(Promise.resolve({
            value: ["value2"],
            nextLink: "https://example.com/"
        }));
        const result = await service.getDeployListByRunId("testServiceId");
        expect(result)
            .toEqual(["value1", "value2"]);
    });
    describe("Create Deployment", () => {
        it("should createDeployment without description", async () => {
            const testResponse = {
                status: 202,
                headers: {
                    get: () => `/api/subscriptions/aaa/resourceGroups/bbb/providers/Microsoft.MachineLearningServices/workspaces/ccc/operations/79b6f874-68b7-4ef1-b3eb-599137fe31da`,
                    append: () => true,
                    delete: () => true,
                    forEach: () => true,
                    has: () => true,
                    set: () => true,
                },
                ok: true
            } as unknown as Response;
            const fetchSpy = jest.spyOn(window, "fetch");
            fetchSpy.mockReturnValue(Promise.resolve(testResponse));
            const result = await service.createDeployment("name", undefined, "runId", "modelId", "condaFileUrl", "scoringFileName", "scoringFileUrl");
            expect(result)
                .toEqual({
                    operationId: null,
                    status: 202
                });
        });
        it("should createDeployment with description", async () => {
            const testResponse = {
                status: 202,
                headers: {
                    get: () => `/api/subscriptions/aaa/resourceGroups/bbb/providers/Microsoft.MachineLearningServices/workspaces/ccc/operations/79b6f874-68b7-4ef1-b3eb-599137fe31da`,
                    append: () => true,
                    delete: () => true,
                    forEach: () => true,
                    has: () => true,
                    set: () => true,
                },
                ok: true
            } as unknown as Response;
            const fetchSpy = jest.spyOn(window, "fetch");
            fetchSpy.mockReturnValue(Promise.resolve(testResponse));
            const result = await service.createDeployment("name", "description", "runId", "modelId", "condaFileUrl", "scoringFileName", "scoringFileUrl");
            expect(result)
                .toEqual({
                    operationId: null,
                    status: 202
                });
        });
        it("should createDeployment with valid operationId", async () => {
            const testResponse = {
                status: 202,
                headers: {
                    // tslint:disable-next-line: max-line-length
                    get: () => `/api/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/testResource/providers/Microsoft.MachineLearningServices/workspaces/testWorkSpace/operations/79b6f874-68b7-4ef1-b3eb-599137fe31da`,
                    append: () => true,
                    delete: () => true,
                    forEach: () => true,
                    has: () => true,
                    set: () => true,
                },
                ok: true
            } as unknown as Response;
            const fetchSpy = jest.spyOn(window, "fetch");
            fetchSpy.mockReturnValue(Promise.resolve(testResponse));
            const result = await service.createDeployment("name", "description", "runId", "modelId", "condaFileUrl", "scoringFileName", "scoringFileUrl");
            expect(result)
                .toEqual({
                    operationId: "79b6f874-68b7-4ef1-b3eb-599137fe31da",
                    status: 202
                });
        });
    });
});
