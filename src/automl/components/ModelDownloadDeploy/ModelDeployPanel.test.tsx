import { AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";
import { shallow, ShallowWrapper } from "enzyme";
import { Dictionary } from "lodash";
import { Panel } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../../common/context/__data__/testContext";
import { PageNames } from "../../common/PageNames";
import { ArtifactService } from "../../services/ArtifactService";
import { IModelDeployResponse, ModelManagementService } from "../../services/ModelManagementService";
import { Form } from "../Form/Form";
import { FormDataType } from "../Form/FormDataType";
import { childRun } from "./__data__/childRun";
import { childRunWithVersion } from "./__data__/childRunWithVersion";
import { parentRun } from "./__data__/parentRun";
import { parentRunWithoutDP } from "./__data__/parentRunWithoutDP";
import { CondaFileSelector } from "./CondaFileSelector";
import { IDeployModelParams } from "./IDeployModelParams";
import { IModelDeployPanelProps, IModelDeployPanelState, ModelDeployPanel } from "./ModelDeployPanel";
import { ScoringScriptSelector } from "./ScoringScriptSelector";

jest.mock("../../common/utils/deployment/getCondaFileFromTemplate.ts");
jest.mock("../../common/utils/deployment/getScoringFileFromTemplate.ts");
jest.mock("../../services/ModelManagementService");
jest.mock("../../services/ArtifactService");

describe("Model Deploy Panel", () => {
    let asCreateAsset: jest.SpyInstance<ReturnType<ModelManagementService["createAsset"]>>;
    let asRegisterModel: jest.SpyInstance<ReturnType<ModelManagementService["registerModel"]>>;
    let asCreateDeployment: jest.SpyInstance<ReturnType<ModelManagementService["createDeployment"]>>;
    let asUploadArtifact: jest.SpyInstance<ReturnType<ArtifactService["uploadArtifact"]>>;
    let root: ShallowWrapper<IModelDeployPanelProps, IModelDeployPanelState, ModelDeployPanel>;
    let onSubmit: (data: IDeployModelParams & Dictionary<FormDataType>) => void;
    const submitFormData = {
        name: "testCreateDeployment", description: "testDescription",
        scoringFile: undefined, condaFile: undefined
    };
    const mockOnCancel = jest.fn();
    const mockOnModelDeploy = jest.fn();

    describe("Missing Data", () => {
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asCreateDeployment = jest.spyOn(ModelManagementService.prototype, "createDeployment");
            asUploadArtifact = jest.spyOn(ArtifactService.prototype, "uploadArtifact");
        });

        it("No Run, No ModelUri, No ParentRun", async () => {
            const invalidProps: IModelDeployPanelProps = {
                pageName: PageNames.ChildRun,
                experimentName: "test-experiment-name",
                run: undefined,
                parentRun: undefined,
                modelUri: undefined,
                scoringUri: undefined,
                condaUri: undefined,
                onCancel: mockOnCancel,
                onModelDeploy: mockOnModelDeploy
            };
            root = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...invalidProps} />);
            await Promise.resolve();
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onSubmit) {
                onSubmit = formProps.onSubmit;
            }

            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledTimes(0);
            expect(asCreateAsset)
                .toBeCalledTimes(0);
        });
    });
    describe("Run without dataprep", () => {
        const validProps: IModelDeployPanelProps = {
            pageName: PageNames.ParentRun,
            experimentName: "test-experiment-name",
            run: childRunWithVersion,
            parentRun: parentRunWithoutDP,
            modelUri: "https://demo.azure.com/model_123",
            scoringUri: undefined,
            condaUri: undefined,
            onCancel: mockOnCancel,
            onModelDeploy: mockOnModelDeploy
        };
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asCreateDeployment = jest.spyOn(ModelManagementService.prototype, "createDeployment");
            asUploadArtifact = jest.spyOn(ArtifactService.prototype, "uploadArtifact");

            root = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...validProps} />);
            await Promise.resolve();
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onSubmit) {
                onSubmit = formProps.onSubmit;
            }
        });
        it("Should render header", () => {
            const onRenderHeader = root.find(Panel)
                .prop("onRenderHeader");
            let header: React.ReactNode | undefined;
            if (onRenderHeader) {
                header = onRenderHeader();
            }
            expect(header)
                .toMatchSnapshot();
        });
    });
    describe("Run with dependency version", () => {
        const validProps: IModelDeployPanelProps = {
            pageName: PageNames.ParentRun,
            experimentName: "test-experiment-name",
            run: childRunWithVersion,
            parentRun: parentRunWithoutDP,
            modelUri: "https://demo.azure.com/model_123",
            scoringUri: undefined,
            condaUri: undefined,
            onCancel: mockOnCancel,
            onModelDeploy: mockOnModelDeploy
        };
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asCreateDeployment = jest.spyOn(ModelManagementService.prototype, "createDeployment");
            asUploadArtifact = jest.spyOn(ArtifactService.prototype, "uploadArtifact");

            root = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...validProps} />);
            await Promise.resolve();
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onSubmit) {
                onSubmit = formProps.onSubmit;
            }
        });
        it("should toggle conda file", () => {
            const condaProps = root.find(CondaFileSelector)
                .props();
            if (condaProps && condaProps.onToggle) {
                condaProps.onToggle();
            }
            expect(root)
                .toMatchSnapshot();
        });
        it("should toggle scoring file", () => {
            const scoringProps = root.find(ScoringScriptSelector)
                .props();
            if (scoringProps && scoringProps.onToggle) {
                scoringProps.onToggle();
            }
            expect(root)
                .toMatchSnapshot();
        });
    });
    describe("Valid Data", () => {
        const validProps: IModelDeployPanelProps = {
            pageName: PageNames.ParentRun,
            experimentName: "test-experiment-name",
            run: childRun,
            parentRun,
            modelUri: "https://demo.azure.com/model_123",
            scoringUri: undefined,
            condaUri: undefined,
            onCancel: mockOnCancel,
            onModelDeploy: mockOnModelDeploy
        };
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asCreateDeployment = jest.spyOn(ModelManagementService.prototype, "createDeployment");
            asUploadArtifact = jest.spyOn(ArtifactService.prototype, "uploadArtifact");

            root = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...validProps} />);
            await Promise.resolve();
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onSubmit) {
                onSubmit = formProps.onSubmit;
            }
        });

        it("should fail if create asset return undefined", async () => {
            asCreateAsset.mockReturnValueOnce(Promise.resolve(undefined));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();

            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(true);
            expect(asCreateAsset)
                .toBeCalledWith("test-experiment-name", "test-run-id_1_Model", "https://demo.azure.com/model_123");
            expect(asRegisterModel)
                .toBeCalledTimes(0);
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });

        it("should fail if created asset id missing", async () => {
            asCreateAsset.mockReturnValueOnce(Promise.resolve({ name: "asset-name" }));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();

            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(true);
            expect(asCreateAsset)
                .toBeCalledWith("test-experiment-name", "test-run-id_1_Model", "https://demo.azure.com/model_123");
            expect(asRegisterModel)
                .toBeCalledTimes(0);
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });

        it("should call register model if asset created successful", async () => {
            asRegisterModel.mockReturnValueOnce(Promise.resolve(undefined));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(true);
            expect(asRegisterModel)
                .toBeCalledWith(
                    "testrunid11",
                    "test-run-id_1_Model",
                    "asset-id",
                    "application/json",
                    "test-run-id_1",
                    "test-experiment-name"
                );
            expect(asUploadArtifact)
                .toBeCalledTimes(0);
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });
        it("should not call next step if returned modelId invalid", async () => {
            const invalidModel = {
                name: "modelWithoutId"
            } as unknown as AzureMachineLearningModelManagementServiceModels.Model;
            asRegisterModel.mockReturnValueOnce(Promise.resolve(invalidModel));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(true);
            expect(asRegisterModel)
                .toBeCalledWith(
                    "testrunid11",
                    "test-run-id_1_Model",
                    "asset-id",
                    "application/json",
                    "test-run-id_1",
                    "test-experiment-name"
                );
            expect(asUploadArtifact)
                .toBeCalledTimes(0);
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });

        it("should call upload artifact if model created successful", async () => {
            asUploadArtifact.mockReturnValueOnce(Promise.resolve(undefined));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(true);
            expect(asUploadArtifact)
                .toBeCalledTimes(1);
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });

        it("should call createDeployment if upload artifact success", async () => {
            asCreateDeployment.mockReturnValueOnce(Promise.resolve(undefined));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(false);
            expect(asCreateDeployment)
                .toBeCalledWith("testCreateDeployment", "testDescription", "test-run-id_1", "model-id", "aml://artifact/mockArtifactId", "mockArtifactId", "aml://artifact/mockArtifactId");
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });
        it("should show error message when conflict", async () => {
            const conflictResponse = {
                operationId: "tesetOpId",
                status: 409
            } as unknown as IModelDeployResponse;
            asCreateDeployment.mockReturnValueOnce(Promise.resolve(conflictResponse));
            const logSpy = getLogCustomEventSpy();
            onSubmit(submitFormData);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "_RegisterModel_UserAction",
                    testContext,
                    { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                );
            expect(root.state("deploying"))
                .toBe(false);
            expect(asCreateDeployment)
                .toBeCalledWith("testCreateDeployment", "testDescription", "test-run-id_1", "model-id", "aml://artifact/mockArtifactId", "mockArtifactId", "aml://artifact/mockArtifactId");
            expect(mockOnModelDeploy)
                .toBeCalledTimes(0);
        });
    });
});
