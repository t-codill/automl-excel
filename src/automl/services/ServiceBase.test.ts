import { RequestOptionsBase } from "@azure/ms-rest-js";
import { ArtifactAPI } from "@vienna/artifact";
import { RunHistoryAPIs } from "@vienna/runhistory";
import { restCanceledError } from "../../__data__/restCanceledError";
import { restInternalServerError } from "../../__data__/restInternalServerError";
import { restNotFoundError } from "../../__data__/restNotFoundError";
import { testContext } from "../common/context/__data__/testContext";
import { Logger } from "../common/utils/logger";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ArtifactService } from "./ArtifactService";
import { RunHistoryService } from "./RunHistoryService";

jest.mock("@vienna/runhistory");

describe("ServiceBase", () => {
    it("should handle rest error properly", async () => {
        const service = new RunHistoryService(testContext);
        const spy = jest.spyOn(RunHistoryAPIs.prototype, "getExperiment");
        spy.mockImplementation(() => { throw restInternalServerError; });
        const logSpy = jest.spyOn(Logger.prototype, "logError");
        logSpy.mockImplementation(() => { return; });
        const onErrorSpy = jest.spyOn(BaseComponent.prototype.context, "onError");
        onErrorSpy.mockImplementation(() => { return; });
        expect(await service.getExperiment("sampleExperimentName"))
            .toBeUndefined();
        expect(logSpy)
            .toBeCalledWith(restInternalServerError, testContext);
        expect(onErrorSpy)
            .toBeCalledWith(restInternalServerError);
    });

    it("should cancel abort controller when dispose", async () => {
        const service = new RunHistoryService(testContext);
        const spy = jest.spyOn(RunHistoryAPIs.prototype, "getExperiment");
        spy.mockImplementation((_subscriptionId: string, _resourceGroupName: string, _workspaceName: string, _experimentName: string, options?: RequestOptionsBase) => {
            expect(options)
                .toBeDefined();
            if (options) {
                expect(options.abortSignal)
                    .toBeDefined();
                if (options.abortSignal) {
                    expect(options.abortSignal.aborted)
                        .toBe(true);
                }
            }
        });
        service.dispose();
        await service.getExperiment("sampleExperimentName");
    });
    it("duplicate dispose should not error", async () => {
        const service = new RunHistoryService(testContext);
        service.dispose();
        service.dispose();
    });
    it("404 should throw an error for non-ignore404 method", async () => {
        const service = new RunHistoryService(testContext);
        const spy = jest.spyOn(RunHistoryAPIs.prototype, "getExperiment");
        spy.mockImplementation(() => {
            throw restNotFoundError;
        });
        const logSpy = jest.spyOn(Logger.prototype, "logError");
        logSpy.mockImplementation(() => { return; });
        const onErrorSpy = jest.spyOn(BaseComponent.prototype.context, "onError");
        onErrorSpy.mockImplementation(() => { return; });
        expect(await service.getExperiment("sampleExperimentName"))
            .toBeUndefined();
        expect(logSpy)
            .toBeCalledWith(restNotFoundError, testContext);
        expect(onErrorSpy)
            .toBeCalledWith(restNotFoundError);
    });

    it("parallel get should return undefined if canceled", async () => {
        const service = new ArtifactService(testContext);
        const spy = jest.spyOn(ArtifactAPI.prototype, "getArtifactContentById2");
        spy.mockImplementation(() => {
            throw restCanceledError;
        });
        const result = await service.getAllContents([{
            container: "sampleContainer",
            origin: "sampleOrigin",
            path: "samplePath"
        }]);
        expect(result)
            .toBeUndefined();
    });

    it("get all should return empty if value is undefined", async () => {
        const service = new ArtifactService(testContext);
        const spy: jest.SpyInstance = jest.spyOn(ArtifactAPI.prototype, "getArtifactsInContainerOrPath2");
        spy.mockReturnValueOnce({});
        const result = await service.getAllArtifacts("AutoML_000");
        expect(result)
            .toEqual([]);
    });

    it("should refresh token.", async () => {
        const service = new RunHistoryService({ ...testContext, getToken: () => "token changed" });
        const spy = jest.spyOn<RunHistoryAPIs, "getExperiment">(RunHistoryAPIs.prototype, "getExperiment");
        await service.getExperiment("AutoML_000");
        // tslint:disable-next-line: no-any
        const [{ credentials }]: any = spy.mock.instances;
        expect(credentials.token)
            .toBe("token changed");
    });
});
