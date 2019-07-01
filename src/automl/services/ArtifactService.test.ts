import { ArtifactAPI } from "@vienna/artifact";
import { restCanceledError } from "../../__data__/restCanceledError";
import { restNotFoundError } from "../../__data__/restNotFoundError";
import { testContext } from "../common/context/__data__/testContext";
import { ArtifactService } from "./ArtifactService";

jest.mock("@vienna/artifact");

const service: ArtifactService = new ArtifactService(testContext);

describe("ArtifactService", () => {
    it("should getAllArtifacts", async () => {
        const result = await service.getAllArtifacts("AutoML_00000000-0000-0000-0000-000000000000");
        expect(result)
            .toMatchSnapshot();
    });
    it("should getAllArtifactsForRuns", async () => {
        const result = await service.getAllArtifactsForRuns(["AutoML_00000000-0000-0000-0000-000000000000", "AutoML_00000000-0000-0000-0000-000000000001"]);
        expect(result)
            .toMatchSnapshot();
    });
    it("should getAllContents", async () => {
        const result = await service.getAllContents([{
            container: "sampleContainer",
            origin: "sampleOrigin",
            path: "samplePath"
        }]);
        expect(result)
            .toMatchSnapshot();
    });
    it("should tryGetArtifactUrl", async () => {
        const result = await service.tryGetArtifactUrl({
            container: "sampleContainer",
            origin: "sampleOrigin",
            path: "samplePath"
        });
        expect(result)
            .toMatchSnapshot();
    });
    it("should tryGetContentForRun", async () => {
        const result = await service.tryGetContentForRun("AutoML_00000000-0000-0000-0000-000000000000", "samplePath");
        expect(result)
            .toBe("sampleArtifactContent");
    });
    describe("getModelUrl", () => {
        it("should return null for non-completed runs", async () => {
            const result = await service.getModelUrl({
                parentRunId: "AutoML_00000000-0000-0000-0000-000000000000",
                runId: "AutoML_00000000-0000-0000-0000-000000000000_1",
                status: "Failed"
            });
            expect(result)
                .toBeNull();
        });

        it("should return value", async () => {
            const result = await service.getModelUrl({
                parentRunId: "AutoML_00000000-0000-0000-0000-000000000000",
                runId: "AutoML_00000000-0000-0000-0000-000000000000_1",
                status: "Completed"
            });
            expect(result)
                .toBe("contentUri");
        });

        it("should return null if model does not exist", async () => {
            const spy = jest.spyOn(ArtifactAPI.prototype, "getArtifactContentInformation2");
            spy.mockImplementation(() => { throw restNotFoundError; });
            const result = await service.getModelUrl({
                parentRunId: "AutoML_00000000-0000-0000-0000-000000000000",
                runId: "AutoML_00000000-0000-0000-0000-000000000000_1",
                status: "Completed"
            });
            expect(result)
                .toBeNull();
        });

        it("should return undefined if call is canceled", async () => {
            const spy = jest.spyOn(ArtifactAPI.prototype, "getArtifactContentInformation2");
            spy.mockImplementation(() => { throw restCanceledError; });
            const result = await service.getModelUrl({
                parentRunId: "AutoML_00000000-0000-0000-0000-000000000000",
                runId: "AutoML_00000000-0000-0000-0000-000000000000_1",
                status: "Completed"
            });
            expect(result)
                .toBeUndefined();
        });
        it("should get content", async () => {
            const result = await service.getContent({
                container: "sampleContainer",
                origin: "sampleOrigin",
                path: "samplePath"
            });
            expect(result)
                .toBe("sampleArtifactContent");
        });
    });
    describe("tryGetContent", () => {
        it("should get Value", async () => {
            const result = await service.tryGetContent({
                container: "sampleContainer",
                origin: "sampleOrigin",
                path: "samplePath"
            });
            expect(result)
                .toBe("sampleArtifactContent");
        });

        it("should be undefined if canceled", async () => {
            const spy = jest.spyOn(ArtifactAPI.prototype, "getArtifactContentById2");
            spy.mockImplementation(() => { throw restCanceledError; });
            const result = await service.tryGetContent({
                container: "sampleContainer",
                origin: "sampleOrigin",
                path: "samplePath"
            });
            expect(result)
                .toBeUndefined();
        });

        it("should be undefined without blobBody", async () => {
            const spy: jest.SpyInstance = jest.spyOn(ArtifactAPI.prototype, "getArtifactContentById2");
            spy.mockReturnValue(() => ({}));
            const result = await service.tryGetContent({
                container: "sampleContainer",
                origin: "sampleOrigin",
                path: "samplePath"
            });
            expect(result)
                .toBeUndefined();
        });
    });
});
