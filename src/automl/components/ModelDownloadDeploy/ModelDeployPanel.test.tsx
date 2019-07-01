import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { shallow, ShallowWrapper } from "enzyme";
import { Link, Panel } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../../common/context/__data__/testContext";
import { PageNames } from "../../common/PageNames";
import { blob2string } from "../../common/utils/blob2string";
import * as saveAsModule from "../../common/utils/saveAs";
import { defaultSdkVersion } from "../../services/JasmineServiceJsonDefinition";
import { ModelManagementService } from "../../services/ModelManagementService";
import { RunHistoryService } from "../../services/RunHistoryService";
import { BaseComponent } from "../Base/BaseComponent";
import { IModelDeployPanelProps, IModelDeployPanelState, ModelDeployPanel } from "./ModelDeployPanel";

jest.mock("../../services/ModelManagementService");
jest.mock("../../services/RunHistoryService");

describe("Model Deploy Panel", () => {
    const parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
        runId: "test-run-id",
        properties: {
            DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}"
        }
    };
    const childRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
        runId: "test-run-id_1",
        properties: {
            DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}"
        }
    };
    let asCreateAsset: jest.SpyInstance<ReturnType<ModelManagementService["createAsset"]>>;
    let asRegisterModel: jest.SpyInstance<ReturnType<ModelManagementService["registerModel"]>>;
    let asUpdateTag: jest.SpyInstance<ReturnType<RunHistoryService["updateTag"]>>;
    const mockOnCancel = jest.fn();
    const mockOnModelRegister = jest.fn();

    describe("Missing Data", () => {
        beforeEach(() => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asUpdateTag = jest.spyOn(RunHistoryService.prototype, "updateTag");
        });

        it("No Run", async () => {
            const invalidProps: IModelDeployPanelProps = {
                experimentName: "test-experiment-name",
                run: undefined,
                parentRun: undefined,
                modelUri: undefined,
                modelId: undefined,
                onCancel: mockOnCancel,
                onModelRegister: mockOnModelRegister
            };
            const tree = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...invalidProps} />);
            tree.find(Link)
                .filterWhere((l) => l.key() === "register")
                .simulate("click");
            await Promise.resolve();
            expect(asCreateAsset)
                .toBeCalledTimes(0);
        });

        it("No ModelUri ", async () => {
            const invalidProps: IModelDeployPanelProps = {
                experimentName: "test-experiment-name",
                run: childRun,
                parentRun,
                modelUri: undefined,
                modelId: undefined,
                onCancel: mockOnCancel,
                onModelRegister: mockOnModelRegister
            };
            const tree = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...invalidProps} />);
            tree.find(Link)
                .filterWhere((l) => l.key() === "register")
                .simulate("click");
            await Promise.resolve();
            expect(asCreateAsset)
                .toBeCalledTimes(0);

        });

        it("No ExperimentName ", async () => {
            const invalidProps: IModelDeployPanelProps = {
                experimentName: undefined,
                run: childRun,
                parentRun,
                modelUri: "test-uri",
                modelId: undefined,
                onCancel: mockOnCancel,
                onModelRegister: mockOnModelRegister
            };
            const tree = shallow<ModelDeployPanel>(
                <ModelDeployPanel {...invalidProps} />);
            tree.find(Link)
                .filterWhere((l) => l.key() === "register")
                .simulate("click");
            await Promise.resolve();
            expect(asCreateAsset)
                .toBeCalledTimes(0);

        });
    });

    describe("Model is not generated", () => {
        const props: IModelDeployPanelProps = {
            experimentName: "test-experiment-name",
            run: childRun,
            parentRun,
            modelUri: "https://demo.azure.com/model_123",
            modelId: undefined,
            onCancel: mockOnCancel,
            onModelRegister: mockOnModelRegister
        };
        let tree: ShallowWrapper<IModelDeployPanelProps, IModelDeployPanelState>;
        let register: ((...[]) => void);
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asUpdateTag = jest.spyOn(RunHistoryService.prototype, "updateTag");
            tree = shallow(
                <ModelDeployPanel {...props} />
            );
            await Promise.resolve();
            register = tree.find(Link)
                .filterWhere((l) => l.key() === "register")
                .prop("onClick") || jest.fn();
        });
        it("Should render register model", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("Should render header", () => {
            const onRenderHeader = tree.find(Panel)
                .prop("onRenderHeader");
            let header: React.ReactNode | undefined;
            if (onRenderHeader) {
                header = onRenderHeader();
            }
            expect(header)
                .toMatchSnapshot();
        });
        it("Should render header for parent", async () => {
            jest.spyOn(BaseComponent.prototype.context, "pageName", "get")
                .mockReturnValue(PageNames.ParentRun);
            await Promise.resolve();
            const onRenderHeader = tree.find(Panel)
                .prop("onRenderHeader");
            let header: React.ReactNode | undefined;
            if (onRenderHeader) {
                header = onRenderHeader();
            }
            expect(shallow(<div>
                {header}
            </div>)
                .find("h2")
                .text())
                .toBe("Deploy Best Model");
        });
        describe("register model", () => {
            it("should call create asset", async () => {
                asCreateAsset.mockReturnValueOnce(Promise.resolve(undefined));
                const logSpy = getLogCustomEventSpy();
                register();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_RegisterModel_UserAction",
                        testContext,
                        { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                    );
                expect(asCreateAsset)
                    .toBeCalledWith(
                        "test-experiment-name",
                        "test-run-id_1_Model",
                        "https://demo.azure.com/model_123"
                    );
                expect(asRegisterModel)
                    .toBeCalledTimes(0);
                expect(asUpdateTag)
                    .toBeCalledTimes(0);
                expect(mockOnModelRegister)
                    .toBeCalledTimes(0);

            });
            it("should not call proceeded if asset id missing", async () => {
                asCreateAsset.mockReturnValueOnce(Promise.resolve({
                    name: "asset-name"
                }));
                const logSpy = getLogCustomEventSpy();
                register();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_RegisterModel_UserAction",
                        testContext,
                        { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                    );
                expect(asCreateAsset)
                    .toBeCalledWith(
                        "test-experiment-name",
                        "test-run-id_1_Model",
                        "https://demo.azure.com/model_123"
                    );
                expect(asRegisterModel)
                    .toBeCalledTimes(0);
                expect(mockOnModelRegister)
                    .toBeCalledTimes(0);
                expect(asUpdateTag)
                    .toBeCalledTimes(0);

            });
            it("should call register model", async () => {
                asRegisterModel.mockReturnValueOnce(Promise.resolve(undefined));
                const logSpy = getLogCustomEventSpy();
                register();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_RegisterModel_UserAction",
                        testContext,
                        { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                    );
                expect(asRegisterModel)
                    .toBeCalledWith(
                        "test-experiment-name",
                        "test-run-id_1_Model",
                        "asset-id",
                        "application/json",
                        "test-run-id_1",
                        "test-experiment-name"
                    );
                expect(asUpdateTag)
                    .toBeCalledTimes(0);
                expect(mockOnModelRegister)
                    .toBeCalledTimes(0);

            });
            it("should call update tag", async () => {
                asUpdateTag.mockReturnValueOnce(Promise.resolve(undefined));
                const logSpy = getLogCustomEventSpy();
                register();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_RegisterModel_UserAction",
                        testContext,
                        { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                    );
                expect(asUpdateTag)
                    .toBeCalledWith(
                        {
                            runId: "test-run-id_1",
                            properties: {
                                DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}"
                            }
                        },
                        "test-experiment-name",
                        "model_id",
                        "model-name"
                    );
                expect(mockOnModelRegister)
                    .toBeCalledTimes(0);
                expect(tree.state("registering"))
                    .toBe(false);

            });

            it("should successes", async () => {
                const logSpy = getLogCustomEventSpy();
                register();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_RegisterModel_UserAction",
                        testContext,
                        { component: "RegisterModel", experimentName: "test-experiment-name", modelId: undefined, pageName: "", runId: "test-run-id_1" }
                    );
                expect(mockOnModelRegister)
                    .toBeCalledTimes(1);
                expect(tree.state())
                    .toEqual({
                        registering: false,
                        modelId: "model-name"
                    });

            });
        });
    });
    describe("Model is generated", () => {
        const props: IModelDeployPanelProps = {
            experimentName: "test-experiment-name",
            run: childRun,
            parentRun,
            modelUri: "https://demo.azure.com/model_123",
            modelId: "test-model-id",
            onCancel: mockOnCancel,
            onModelRegister: mockOnModelRegister
        };
        let downloadScoringFile: ((...[]) => void);
        let getCondaEnvFile: ((...[]) => void);
        let tree: ShallowWrapper<IModelDeployPanelProps, IModelDeployPanelState>;
        beforeEach(async () => {
            asCreateAsset = jest.spyOn(ModelManagementService.prototype, "createAsset");
            asRegisterModel = jest.spyOn(ModelManagementService.prototype, "registerModel");
            asUpdateTag = jest.spyOn(RunHistoryService.prototype, "updateTag");
            tree = shallow(
                <ModelDeployPanel {...props} />
            );
            await Promise.resolve();
            const links = tree.find(Link);
            const scoring = links
                .filterWhere((l) => l.key() === "scoring")
                .prop("onClick");
            const environment = links
                .filterWhere((l) => l.key() === "environment")
                .prop("onClick");
            downloadScoringFile = scoring || (() => { return; });
            getCondaEnvFile = environment || (() => { return; });
        });
        describe("Validate Render", () => {
            it("should render correctly", () => {
                expect(tree)
                    .toMatchSnapshot();
            });
        });
        it("should show spinning during registering", () => {
            tree.setState({ registering: true });
            expect(tree)
                .toMatchSnapshot();
            tree.setState({ registering: false });
        });

        describe("scoring file", () => {
            it("should download", async () => {
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                const logSpy = getLogCustomEventSpy();
                downloadScoringFile();
                expect(logSpy)
                    .toBeCalledWith(
                        "_DownloadScoringFile_UserAction",
                        testContext,
                        { component: "DownloadScoringFile", experimentName: "test-experiment-name", modelId: "test-model-id", pageName: "", runId: "test-run-id_1" }
                    );

                expect(asSaveAs)
                    .toBeCalledWith(expect.anything(), "scoring.py");
            });

            it("should not downloading if model id missing", async () => {
                tree.setState({ modelId: undefined });
                await Promise.resolve();
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                downloadScoringFile();

                expect(asSaveAs)
                    .toBeCalledTimes(0);
            });

            it("should not downloading if column is missing", async () => {
                tree.setProps({
                    parentRun: {
                        runId: "test-run-id",
                        properties: {}
                    }
                });
                await Promise.resolve();
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                const logSpy = getLogCustomEventSpy();
                downloadScoringFile();
                expect(logSpy)
                    .toBeCalledWith(
                        "_DownloadScoringFile_UserAction",
                        testContext,
                        { component: "DownloadScoringFile", experimentName: "test-experiment-name", modelId: "test-model-id", pageName: "", runId: "test-run-id_1" }
                    );

                expect(asSaveAs)
                    .toBeCalledTimes(0);
            });
        });

        describe("conda env", () => {
            it("should download", () => {
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                const logSpy = getLogCustomEventSpy();
                getCondaEnvFile();
                expect(logSpy)
                    .toBeCalledWith(
                        "_DownloadCondaFile_UserAction",
                        testContext,
                        { component: "DownloadCondaFile", experimentName: "test-experiment-name", pageName: "", runId: "test-run-id_1" }
                    );

                expect(asSaveAs)
                    .toBeCalledWith(expect.anything(), "condaEnv.yml");
            });

            it("should use sdk version from properties", async () => {
                tree.setProps({
                    run: {
                        runId: "test-run-id",
                        properties: {
                            DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}",
                            dependencies_versions: JSON.stringify({
                                "azureml-train-automl": "testSdkVersion"
                            })
                        }
                    }
                });
                await Promise.resolve();
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                const logSpy = getLogCustomEventSpy();
                getCondaEnvFile();
                await Promise.resolve();
                await Promise.resolve();
                expect(logSpy)
                    .toBeCalledWith(
                        "_DownloadCondaFile_UserAction",
                        testContext,
                        { component: "DownloadCondaFile", experimentName: "test-experiment-name", pageName: "", runId: "test-run-id" }
                    );

                expect(asSaveAs)
                    .toBeCalledTimes(1);
                const content = await blob2string(asSaveAs.mock.calls[0][0]);
                expect(content)
                    .toMatch(/azureml-sdk\[automl\]==testSdkVersion/);
            });
            it("should use default version if property is invalid", async (done) => {
                tree.setProps({
                    run: {
                        runId: "test-run-id",
                        properties: {
                            DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}",
                            dependencies_versions: "invalid json string"
                        }
                    }
                });
                await Promise.resolve();
                const asSaveAs = jest.spyOn(saveAsModule, "saveAs");
                const logSpy = getLogCustomEventSpy();
                getCondaEnvFile();
                expect(logSpy)
                    .toBeCalledWith(
                        "_DownloadCondaFile_UserAction",
                        testContext,
                        { component: "DownloadCondaFile", experimentName: "test-experiment-name", pageName: "", runId: "test-run-id" }
                    );

                expect(asSaveAs)
                    .toBeCalledTimes(1);
                expect(await blob2string(asSaveAs.mock.calls[0][0]))
                    .toMatch(new RegExp(`azureml-sdk\\[automl\\]==${defaultSdkVersion}`));
                done();
            });
        });
    });
});
