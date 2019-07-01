import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { StorageManagementModels } from "@azure/arm-storage";
import { Models } from "@azure/storage-blob";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { sampleStorageAccount } from "../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../__data__/sampleStorageContainer";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { ICsvData } from "../common/utils/csv";
import { IBasePageState } from "../components/Base/BasePage";
import { ConfirmationDialog } from "../components/Dialog/ConfirmationDialog";
import { PopupProgressIndicator } from "../components/Progress/PopupProgressIndicator";
import { sampleDataStore } from "../services/__data__/sampleDataStore";
import { DataStoreService } from "../services/DataStoreService";
import { JasmineService } from "../services/JasmineService";
import { DataSourceStep } from "./dataSourceStep/DataSourceStep";
import { ExperimentStep } from "./experimentStep/ExperimentStep";
import { ISettingsStepParams } from "./settingsSteps/ISettingsStepParams";
import { SettingsStep } from "./settingsSteps/SettingsStep";
import { IStartRunState, StartRun } from "./StartRun";

jest.mock("../services/DataStoreService");
jest.mock("../services/JasmineService");

describe("StartRun", () => {
    describe("should change status", () => {
        let tree: ShallowWrapper<{}, IStartRunState, StartRun>;
        beforeEach(async () => {
            tree = shallow(<StartRun />);
            await Promise.resolve();
        });

        it("should render", () => {
            expect(tree)
                .toMatchSnapshot();
        });

        it("should cancel", () => {
            tree.setState({ cancelled: true });
            expect(tree)
                .toMatchInlineSnapshot(`
      <PageRedirectRender
        expendedRoutePath=""
        noPush={false}
      />
    `
                );
        });

        it("should redirect to parent run", () => {
            tree.setState({
                created: true,
                experimentName: "experimentName",
                runId: "runId"
            });
            expect(tree)
                .toMatchInlineSnapshot(`
      <PageRedirectRender
        expendedRoutePath="experiments/experimentName/parentrun/runId"
        noPush={false}
      />
    `
                );
        });

        it("should show PopupProgressIndicator", () => {
            tree.setState({
                creating: true
            });
            expect(tree.exists(PopupProgressIndicator))
                .toBe(true);
        });
    });
    describe("cancel", () => {
        let tree: ShallowWrapper<{}, IStartRunState & IBasePageState, StartRun>;
        beforeEach(async () => {
            tree = shallow(<StartRun />);
            tree.setState({ goBack: true });
            await Promise.resolve();
        });
        it("should show cancel dialog", () => {
            expect(tree.exists(ConfirmationDialog))
                .toBe(true);
        });
        it("should hide cancel", () => {
            tree.find(ConfirmationDialog)
                .prop("onClose")();
            expect(tree.state("goBack"))
                .toBe(false);
        });
        it("should cancel", () => {
            tree.find(ConfirmationDialog)
                .prop("onConfirm")();
            expect(tree.state("cancelled"))
                .toBe(true);
        });
    });

    describe("default store", () => {
        let tree: ShallowWrapper<{}, IStartRunState, StartRun>;
        let getDefaultDataStoreSpy: jest.SpyInstance<ReturnType<DataStoreService["getDefault"]>>;
        beforeEach(async () => {
            getDefaultDataStoreSpy = jest.spyOn(DataStoreService.prototype, "getDefault");
            tree = shallow(<StartRun />);
            await Promise.resolve();
        });
        it("should load default store", () => {
            expect(tree.state("defaultStorageAccountData"))
                .toEqual({
                    defaultAccountName: sampleDataStore.azureStorageSection.accountName,
                    defaultContainerName: sampleDataStore.azureStorageSection.containerName
                });
        });
        it("should load default store if get default is canceled", async () => {
            getDefaultDataStoreSpy.mockReturnValue(Promise.resolve(undefined));
            tree = shallow(<StartRun />);
            await Promise.resolve();
            expect(tree.state("defaultStorageAccountData"))
                .toBeUndefined();
        });
    });

    describe("data store", () => {
        let tree: ShallowWrapper<{}, IStartRunState, StartRun>;
        let addDataStoreSpy: jest.SpyInstance<ReturnType<DataStoreService["add"]>>;
        beforeEach(async () => {
            addDataStoreSpy = jest.spyOn(DataStoreService.prototype, "add");
            tree = shallow(<StartRun />);
            await Promise.resolve();
        });
        it("should add", async () => {
            tree.setState({
                account: sampleStorageAccount,
                container: sampleStorageContainer,
                sasToken: "sampleSasToken"
            });
            await Promise.resolve();
            expect(addDataStoreSpy)
                .toBeCalledWith(sampleStorageContainer, sampleStorageAccount, "sampleSasToken");
            expect(tree.state("dataStoreName"))
                .toBe("dataStoreName");
        });
        it("should not add is missing token", async () => {
            tree.setState({
                account: sampleStorageAccount,
                container: sampleStorageContainer,
                sasToken: undefined
            });
            await Promise.resolve();
            expect(addDataStoreSpy)
                .not
                .toBeCalled();
        });
        it("should not set data store name if add to store is canceled", async () => {
            addDataStoreSpy.mockReturnValue(Promise.resolve(undefined));
            tree.setState({
                account: sampleStorageAccount,
                container: sampleStorageContainer,
                sasToken: "sampleSasToken"
            });
            await Promise.resolve();
            expect(addDataStoreSpy)
                .toBeCalled();
            expect(tree.state("dataStoreName"))
                .toBeUndefined();
        });
    });

    describe("start run flow", () => {
        let tree: ShallowWrapper<{}, IStartRunState & IBasePageState, StartRun>;
        beforeAll(async () => {
            tree = shallow(<StartRun />);
            await Promise.resolve();
        });

        describe("Experiment Step", () => {
            let onExperimentStepNext: (experimentName: string | undefined,
                compute: AzureMachineLearningWorkspacesModels.ComputeResource | undefined) => void;
            let onEditExperimentStepClicked: () => void;
            const experimentName = "experimentName";
            const compute = { id: "sampleCompute" };

            beforeEach(() => {
                onExperimentStepNext = tree.find(ExperimentStep)
                    .prop("onNext");
                onEditExperimentStepClicked = tree.find(ExperimentStep)
                    .prop("onEditClick");
            });

            it("should go next", () => {
                onExperimentStepNext(experimentName, compute);
                expect(tree.state())
                    .toEqual(
                        expect.objectContaining({
                            experimentName,
                            compute,
                            experimentStepReadOnly: true
                        }));
            });

            it("should go back", () => {
                onEditExperimentStepClicked();
                expect(tree.state("experimentStepReadOnly"))
                    .toEqual(false);
                onExperimentStepNext(experimentName, compute);
            });
        });

        describe("DataSource Step", () => {
            let onDataSourceChanged: (
                account: StorageManagementModels.StorageAccount | undefined,
                sasToken: string | undefined,
                container: StorageManagementModels.ListContainerItem | undefined,
                blob: Models.BlobItem | undefined,
                previewData: ICsvData | undefined) => void;
            let onFeatureSelectionChanged: (featureName: string, checked?: boolean) => void;
            const previewData: ICsvData = {
                data: [
                    { a: "1-1", b: "1-2", c: "1-3" },
                    { a: "2-1", b: "2-2", c: "2-3" },
                    { a: "3-1", b: "3-2", c: "3-3" }
                ],
                header: ["a", "b", "c"],
                delimiter: ",",
                hasHeader: true
            };

            beforeEach(() => {
                onDataSourceChanged = tree.find(DataSourceStep)
                    .prop("onDataSourceChanged");
                onFeatureSelectionChanged = tree.find(DataSourceStep)
                    .prop("onFeatureSelectionChanged");
            });
            it("should render", () => {
                expect(tree)
                    .toMatchSnapshot();
            });

            it("should have empty feature", () => {
                onDataSourceChanged(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    undefined
                );
                expect(tree.state("selectedFeatures"))
                    .toEqual(new Set());
            });

            it("should onDataSourceChanged", () => {
                onDataSourceChanged(
                    sampleStorageAccount,
                    "sasToken",
                    sampleStorageContainer,
                    sampleStorageBlob,
                    previewData
                );
                expect(tree.state())
                    .toEqual(
                        expect.objectContaining({
                            account: sampleStorageAccount,
                            sasToken: "sasToken",
                            container: sampleStorageContainer,
                            blob: sampleStorageBlob,
                            previewData,
                            selectedFeatures: new Set(previewData.header)
                        }));
            });

            it("should deselect feature", () => {
                onFeatureSelectionChanged("a", false);
                expect(tree.state("selectedFeatures"))
                    .toEqual(new Set(["b", "c"]));
            });

            it("should select feature", () => {
                onFeatureSelectionChanged("a", true);
                expect(tree.state("selectedFeatures"))
                    .toEqual(new Set(["b", "c", "a"]));
            });

            it("should not select feature", () => {
                onFeatureSelectionChanged("a", undefined);
                expect(tree.state("selectedFeatures"))
                    .toEqual(new Set(["b", "c", "a"]));
            });

        });

        describe("Settings Step", () => {
            let onStart: (params: ISettingsStepParams) => void;
            let onCancel: () => void;
            let logger: jest.SpyInstance;
            let createRunSpy: jest.SpyInstance<ReturnType<JasmineService["createRun"]>>;
            let startRunSpy: jest.SpyInstance<ReturnType<JasmineService["startRun"]>>;
            const param: ISettingsStepParams = {
                blacklistAlgos: [],
                jobType: "classification",
                column: "a",
                metric: "AUC_weighted",
                trainingJobTime: "90",
                maxIteration: "10",
                crossValidationNumber: "2",
                grainColumns: [],
                maxConcurrentIterations: "2",
                maxCores: "1",
                maxHorizon: undefined,
                metricThreshold: undefined,
                percentageValidation: undefined,
                preprocessing: true,
                timeSeriesColumn: undefined
            };

            beforeEach(() => {
                createRunSpy = jest.spyOn(JasmineService.prototype, "createRun");
                startRunSpy = jest.spyOn(JasmineService.prototype, "startRun");
                onStart = tree.find(SettingsStep)
                    .prop("onStart");
                onCancel = tree.find(SettingsStep)
                    .prop("onCancel");
                logger = getLogCustomEventSpy();
            });
            it("should render", () => {
                expect(tree)
                    .toMatchSnapshot();
            });

            it("should cancel", () => {
                onCancel();
                expect(tree.state("goBack"))
                    .toBe(true);
                tree.setState({ cancelled: false });
            });

            it("should hide if user go back to experiment step", () => {
                tree.setState({ experimentStepReadOnly: false });
                expect(tree.find("#divDataSourceStep")
                    .hasClass("hidden_step"))
                    .toBe(true);
                tree.setState({ experimentStepReadOnly: true });
            });

            it("should not continue without experiment name", async () => {
                tree.setState({ experimentName: undefined });
                onStart(param);
                expect(tree.state("creating"))
                    .toBe(false);
            });

            it("should not continue without data store name", async () => {
                tree.setState({ experimentName: "experimentName", dataStoreName: undefined });
                onStart(param);
                expect(tree.state("creating"))
                    .toBe(true);
                expect(tree.state("creatingDescription"))
                    .toBe("Creating data store...");
            });

            it("create run missing param", async () => {
                tree.setState({ dataStoreName: "dataStoreName" });
                onStart({ ...param, jobType: undefined });
                await Promise.resolve();
                expect(tree.state("creating"))
                    .toBe(false);
                expect(tree.state("created"))
                    .toBe(false);
            });

            it("create run error", async () => {
                tree.setState({ dataStoreName: "dataStoreName" });
                createRunSpy.mockReturnValue(Promise.resolve(undefined));
                onStart(param);
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                expect(logger)
                    .toBeCalledWith("StartRun_CreateRun_UserAction", testContext, expect.anything());
                expect(tree.state("creating"))
                    .toBe(false);
                expect(tree.state("created"))
                    .toBe(false);
            });

            it("create run, and start run canceled", async () => {
                startRunSpy.mockReturnValue(Promise.resolve(undefined));
                onStart(param);
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                expect(tree.state("runId"))
                    .toBe("AutoML_123");
                expect(tree.state("creating"))
                    .toBe(false);
                expect(tree.state("created"))
                    .toBe(false);
            });

            it("started", async () => {
                onStart(param);
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                await Promise.resolve();
                expect(tree.state("created"))
                    .toBe(true);
            });

        });

    });

});
