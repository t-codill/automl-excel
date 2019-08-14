import { AzureMachineLearningModelManagementServiceModels } from "@vienna/model-management";
import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ModelManagementService } from "../../services/ModelManagementService";
import { childRun } from "./__data__/childRun";
import { DeployStatus, IDeployStatusProps, IDeployStatusState } from "./DeployStatus";

jest.mock("../../services/ModelManagementService");

const deployList = [
    {
        id: "aaaaaaaaaa",
        name: "aaaaaaaaaa",
        description: "ttttttttttt",
        createdTime: new Date("2019-07-21T05:45:00.000Z"),
        updatedTime: new Date("2019-07-21T05:47:00.000Z"),
        computeType: "ACI",
        operationId: "testOperationId",
    },
    {
        id: "bbbbbbb",
        name: "bbbbbbb",
        description: "",
        createdTime: new Date("2019-02-11T05:45:00.000Z"),
        updatedTime: new Date("2019-02-11T05:45:00.000Z"),
        computeType: "ACI",
        operationId: "testOperationId"
    }
];

const deployListWithoutOperationId = [
    {
        id: "aaaaaaaaaa",
        name: "aaaaaaaaaa",
        description: "ttttttttttt",
        createdTime: new Date("2019-07-21T05:45:00.000Z"),
        updatedTime: new Date("2019-07-21T05:47:00.000Z"),
        computeType: "ACI",
        operationId: null,
    },
    {
        id: "bbbbbbb",
        name: "bbbbbbb",
        description: "",
        createdTime: new Date("2019-02-11T05:45:00.000Z"),
        updatedTime: new Date("2019-02-11T05:45:00.000Z"),
        computeType: "ACI",
        operationId: null
    }
];

const runningDeploy: AzureMachineLearningModelManagementServiceModels.AsyncOperationStatus = {
    id: "2d700ed6-148b-4378-a1d7-d8e79c628244",
    operationType: "AciService",
    state: "Running",
    createdTime: new Date("2019-02-11T05:45:00.000Z"),
    endTime: new Date("2019-02-11T05:55:00.000Z"),
    resourceLocation: "test",
    operationLog: "abc"
};

const failedDeploy: AzureMachineLearningModelManagementServiceModels.AsyncOperationStatus = {
    id: "2d700ed6-148b-4378-a1d7-d8e79c628244",
    operationType: "AciService",
    state: "Failed",
    createdTime: new Date("2019-02-11T05:45:00.000Z"),
    endTime: new Date("2019-02-11T05:55:00.000Z"),
    resourceLocation: "test",
    operationLog: "abc"
};

const succeededDeploy: AzureMachineLearningModelManagementServiceModels.AsyncOperationStatus = {
    id: "2d700ed6-148b-4378-a1d7-d8e79c628244",
    operationType: "AciService",
    state: "Succeeded",
    createdTime: new Date("2019-02-11T05:45:00.000Z"),
    endTime: new Date("2019-02-11T05:55:00.000Z"),
    resourceLocation: "test",
    operationLog: "abc"
};

let mockGetDeployStatus: jest.SpyInstance<ReturnType<ModelManagementService["getDeployStatus"]>>;
let mockGetDeployList: jest.SpyInstance<ReturnType<ModelManagementService["getDeployListByRunId"]>>;

describe("Deploy Status", () => {
    let tree: ShallowWrapper<IDeployStatusProps, IDeployStatusState>;

    beforeEach(() => {
        mockGetDeployStatus = jest.spyOn(ModelManagementService.prototype, "getDeployStatus");
        mockGetDeployList = jest.spyOn(ModelManagementService.prototype, "getDeployListByRunId");
    });
    describe("Invalid Props", () => {
        it("should render with undefined deployName", async () => {
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            expect(tree)
                .toMatchSnapshot();
        });
        it("should render with empty deployList", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve([]));
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });
        it("should render with valid deployList and undefined deploy", async () => {
            const deployListMock = Promise.resolve(deployList);
            mockGetDeployList.mockReturnValue(deployListMock);
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });
        it("should re-render with new operationId", async () => {
            const deployListMock = Promise.resolve(deployList);
            mockGetDeployList.mockReturnValue(deployListMock);
            const deployStatus = Promise.resolve(runningDeploy);
            mockGetDeployStatus.mockReturnValue(deployStatus);
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            tree.setProps({
                operationId: "DEF"
            });
            expect(tree)
                .toMatchSnapshot();
        });
        it("should render with invalid OpeartionId", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve(deployListWithoutOperationId));
            mockGetDeployStatus.mockReturnValue(Promise.resolve(succeededDeploy));
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });
        it("should read operationId from tag if not found from lastDeploy", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve(deployListWithoutOperationId));
            mockGetDeployStatus.mockReturnValue(Promise.resolve(succeededDeploy));
            const testRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
                runId: "test-run-id_1",
                properties: {
                    DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}"
                },
                tags: {
                    operation_id: "testOperationId"
                }
            };
            tree = shallow(<DeployStatus run={testRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });
    });

    describe("Valid Props", () => {
        it("should render with valid deployList and success deploy", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve(deployList));
            mockGetDeployStatus.mockReturnValue(Promise.resolve(succeededDeploy));
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });

        it("should render with valid deployList and failed deploy", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve(deployList));
            mockGetDeployStatus.mockReturnValue(Promise.resolve(failedDeploy));
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });

        it("should render with valid deployList and running deploy", async () => {
            mockGetDeployList.mockReturnValue(Promise.resolve(deployList));
            mockGetDeployStatus.mockReturnValue(Promise.resolve(runningDeploy));
            tree = shallow(<DeployStatus run={childRun} operationId="testOperationId" />);
            await Promise.resolve();
            await Promise.resolve();
            await Promise.resolve();
            expect(tree)
                .toMatchSnapshot();
        });
    });

});
