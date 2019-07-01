import { IRunDtoWithExperimentName } from "../../services/RunHistoryService";
import { processRunHistoryChart } from "./processRunHistoryChart";

const runList: IRunDtoWithExperimentName[] = [
    {
        runId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c8",
        createdUtc: new Date(2018, 1, 2, 3, 4, 5),
        parentRunId: undefined,
        status: "Completed",
        name: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c8",
        dataContainerId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c8",
        description: undefined,
        hidden: false,
        runType: "automl",
        createdFrom: undefined,
        experimentName: "automl-local-classification"
    },
    {
        runId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368d8",
        createdUtc: new Date(2018, 1, 2, 3, 4, 5),
        parentRunId: undefined,
        status: "Failed",
        name: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368d8",
        dataContainerId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368d8",
        description: undefined,
        hidden: false,
        runType: "automl",
        createdFrom: undefined,
        experimentName: "automl-local-classification"
    },
    {
        runId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c9",
        createdUtc: new Date(2017, 1, 2, 3, 4, 5),
        parentRunId: undefined,
        status: "Completed",
        name: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c9",
        dataContainerId: "AutoML_937ba728-8365-42e3-ad72-d4ef5cc368c9",
        description: undefined,
        hidden: false,
        runType: "automl",
        createdFrom: undefined,
        experimentName: "automl-local-classification"
    }];

describe("processRunHistoryChart", () => {
    it("should return right result with empty input", () => {
        expect(processRunHistoryChart([]))
            .toEqual({});
    });
    it("should return right result with valid input", () => {
        expect(processRunHistoryChart(runList))
            .toEqual({
                "2017/02/02": {
                    Completed: 1,
                },
                "2018/02/02": {
                    Completed: 1,
                    Failed: 1
                },
            });
    });
});
