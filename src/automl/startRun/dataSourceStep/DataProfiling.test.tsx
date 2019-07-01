import { Metrics } from "@vienna/data-prep-lib";
import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { shallow } from "enzyme";
import * as React from "react";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { ArtifactService } from "../../services/ArtifactService";
import { DataPrepService } from "../../services/DataPrepService";
import { RunHistoryService } from "../../services/RunHistoryService";
import { DataProfiling, IDataProfilingProps } from "./DataProfiling";

jest.mock("../../services/ArtifactService");
jest.mock("../../services/DataPrepService");
jest.mock("../../services/RunHistoryService");
let dataPrepServiceStartDataProfiling: jest.SpyInstance<ReturnType<DataPrepService["startDataProfiling"]>>;
let artifactServiceTryGetContentForRun: jest.SpyInstance<ReturnType<ArtifactService["tryGetContentForRun"]>>;
let runHistoryServiceGetRun: jest.SpyInstance<ReturnType<RunHistoryService["getRun"]>>;
let getDataFunc: TimerHandler = () => { return; };

describe("DataProfiling", () => {
    beforeEach(() => {
        dataPrepServiceStartDataProfiling = jest.spyOn(DataPrepService.prototype, "startDataProfiling");
        artifactServiceTryGetContentForRun = jest.spyOn(ArtifactService.prototype, "tryGetContentForRun");
        runHistoryServiceGetRun = jest.spyOn(RunHistoryService.prototype, "getRun");
    });
    const props: IDataProfilingProps = {
        dataStoreName: "",
        previewData: { hasHeader: true, data: [], header: [], delimiter: "," },
        blob: { deleted: false, name: "", snapshot: "", properties: { lastModified: new Date(0), etag: "" } },
        compute: { id: "id" }
    };
    const tree = shallow(<DataProfiling {...props} />);

    it("1.render without data store name", async () => {
        expect(dataPrepServiceStartDataProfiling)
            .toBeCalledTimes(0);
        expect(tree)
            .toMatchSnapshot();
    });

    it("2.start profiling and cancel by return undefined", async () => {
        const mockData = Promise.resolve(undefined);
        dataPrepServiceStartDataProfiling.mockReturnValue(mockData);
        tree.setProps({ ...props, dataStoreName: "dataStoreName" });
        await mockData;
        expect(dataPrepServiceStartDataProfiling)
            .toBeCalledTimes(1);
        expect(tree)
            .toMatchSnapshot();
    });

    it("3.start profiling", async () => {
        const dataProfilingResult = Promise.resolve({
            dataPath: "dataPath",
            profileResultPath: "profileResultPath",
            experimentName: "dataPrep",
            runId: "runId"
        });
        dataPrepServiceStartDataProfiling.mockReturnValue(dataProfilingResult);
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockImplementation((func: TimerHandler) => {
            getDataFunc = func;
            return 1;
        });
        tree.setProps({ ...props, dataStoreName: "dataStoreNameUpdated" });
        await dataProfilingResult;
        expect(dataPrepServiceStartDataProfiling)
            .toBeCalledTimes(1);
        expect(tree)
            .toMatchSnapshot();
    });

    it("4.1.Should not proceeded if get run return nothing", async () => {
        const promiseRun = Promise.resolve(undefined);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(runHistoryServiceGetRun)
            .toBeCalledTimes(1);
        expect(tree)
            .toMatchSnapshot();
    });

    it("4.2.Should not proceeded if get run no status", async () => {
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: undefined
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(runHistoryServiceGetRun)
            .toBeCalledTimes(1);
        expect(tree)
            .toMatchSnapshot();
    });

    it("4.Waiting for profile finish", async () => {
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: "Running"
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(runHistoryServiceGetRun)
            .toBeCalledTimes(1);
        expect(tree)
            .toMatchSnapshot();
    });

    it("5.download artifact and render profiling grid", async () => {
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: "Completed"
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        const artifact = Promise.resolve("{\"content\" : 123}");
        artifactServiceTryGetContentForRun.mockReturnValue(artifact);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        await artifact;
        expect(artifactServiceTryGetContentForRun)
            .toBeCalledTimes(1);
        expect(tree.exists(Metrics))
            .toBe(true);
    });

    it("6. should use dark theme", async () => {
        jest.spyOn(BaseComponent.prototype.context, "theme", "get")
            .mockReturnValue("dark");
        tree.setProps({});
        await Promise.resolve(undefined);
        expect(tree.find(Metrics)
            .prop("theme"))
            .toBe("dark");
    });

    it("download failed should give error message", async () => {
        const failedTree = shallow(<DataProfiling {...props} />);
        const dataProfilingResult = Promise.resolve({
            dataPath: "dataPath",
            profileResultPath: "profileResultPath",
            experimentName: "dataPrep",
            runId: "runId"
        });
        dataPrepServiceStartDataProfiling.mockReturnValue(dataProfilingResult);
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockImplementation((func: TimerHandler) => {
            getDataFunc = func;
            return 1;
        });
        failedTree.setProps({ ...props, dataStoreName: "dataStoreNameUpdated" });
        await dataProfilingResult;
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: "Completed"
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        const artifact = Promise.resolve(undefined);
        artifactServiceTryGetContentForRun.mockReturnValue(artifact);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        await artifact;
        expect(artifactServiceTryGetContentForRun)
            .toBeCalledTimes(1);
        expect(failedTree)
            .toMatchSnapshot();
    });

    it("failed run should give error message", async () => {
        const failedTree = shallow(<DataProfiling {...props} />);
        const dataProfilingResult = Promise.resolve({
            dataPath: "dataPath",
            profileResultPath: "profileResultPath",
            experimentName: "dataPrep",
            runId: "runId"
        });
        dataPrepServiceStartDataProfiling.mockReturnValue(dataProfilingResult);
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockImplementation((func: TimerHandler) => {
            getDataFunc = func;
            return 1;
        });
        failedTree.setProps({ ...props, dataStoreName: "dataStoreNameUpdated" });
        await dataProfilingResult;
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: "Failed",
            error: {
                error: {
                    message: "Test Error"
                }
            }
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(failedTree)
            .toMatchSnapshot();
    });

    it("failed run should show failed without error message", async () => {
        const failedTree = shallow(<DataProfiling {...props} />);
        const dataProfilingResult = Promise.resolve({
            dataPath: "dataPath",
            profileResultPath: "profileResultPath",
            experimentName: "dataPrep",
            runId: "runId"
        });
        dataPrepServiceStartDataProfiling.mockReturnValue(dataProfilingResult);
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockImplementation((func: TimerHandler) => {
            getDataFunc = func;
            return 1;
        });
        failedTree.setProps({ ...props, dataStoreName: "dataStoreNameUpdated" });
        await dataProfilingResult;
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            runId: "RunId_1",
            status: "Failed"
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(failedTree)
            .toMatchSnapshot();
    });

    it("no run id should return error", async () => {
        const failedTree = shallow(<DataProfiling {...props} />);
        const dataProfilingResult = Promise.resolve({
            dataPath: "dataPath",
            profileResultPath: "profileResultPath",
            experimentName: "dataPrep",
            runId: "runId"
        });
        dataPrepServiceStartDataProfiling.mockReturnValue(dataProfilingResult);
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockImplementation((func: TimerHandler) => {
            getDataFunc = func;
            return 1;
        });
        failedTree.setProps({ ...props, dataStoreName: "dataStoreNameUpdated" });
        await dataProfilingResult;
        const run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
            status: "Completed"
        };
        const promiseRun = Promise.resolve(run);
        runHistoryServiceGetRun.mockReturnValue(promiseRun);
        if (typeof (getDataFunc) === "function") {
            getDataFunc();
        }
        await promiseRun;
        expect(failedTree)
            .toMatchSnapshot();
    });
});
