import { IRunDtoWithExperimentName } from "../../services/RunHistoryService";

export const runList: IRunDtoWithExperimentName[] | undefined = [
    {
        runNumber: 1,
        runId: "AutoML_001",
        parentRunId: undefined,
        status: "Completed",
        startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-02-01T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: `{"primary_metric": "AUC_weighted",
          "data_script": null,\
          "compute_target": "local",
          "n_cross_validations": 3,
          "max_cores_per_iteration": 1,
          "blacklist_algos": [],
          "exit_score": 100,
          "name": "my_experiment",
          "task_type": "classification" }`
        },
        tags: {
            iterations: "2"
        },
        experimentName: "AAA"
    },
    {
        runNumber: 2,
        runId: "AutoML_002",
        parentRunId: undefined,
        status: "Completed",
        startTimeUtc: new Date("2019-01-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-01-01T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: `{"primary_metric": "AUC_weighted",
          "data_script": null,\
          "compute_target": "local",
          "n_cross_validations": 3,
          "max_cores_per_iteration": 1,
          "blacklist_algos": [],
          "exit_score": 100,
          "name": "my_experiment",
          "task_type": "classification" }`
        },
        tags: {
            iterations: "2"
        },
        experimentName: "AAA"
    },
    {
        runNumber: 3,
        runId: "AutoML_003",
        parentRunId: undefined,
        status: "Completed",
        startTimeUtc: new Date("2018-01-01T08:20:00.000Z"),
        endTimeUtc: new Date("2018-01-01T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: `{"primary_metric": "AUC_weighted",
          "data_script": null,\
          "compute_target": "local",
          "n_cross_validations": 3,
          "max_cores_per_iteration": 1,
          "blacklist_algos": [],
          "exit_score": 100,
          "name": "my_experiment",
          "task_type": "classification" }`
        },
        tags: {
            iterations: "2"
        },
        experimentName: "BBB"
    },
    {
        runNumber: 4,
        runId: "AutoML_004",
        parentRunId: undefined,
        status: "Failed",
        startTimeUtc: new Date("2019-04-01T08:20:00.000Z"),
        endTimeUtc: new Date("2019-04-01T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: `{"primary_metric": "AUC_weighted",
          "data_script": null,\
          "compute_target": "local",
          "n_cross_validations": 3,
          "max_cores_per_iteration": 1,
          "blacklist_algos": [],
          "exit_score": 100,
          "name": "my_experiment",
          "task_type": "classification" }`
        },
        tags: {
            iterations: "2"
        },
        experimentName: "BBB"
    },
    {
        runNumber: 5,
        runId: "AutoML_005",
        parentRunId: undefined,
        status: "Completed",
        startTimeUtc: new Date("2018-01-11T08:20:00.000Z"),
        endTimeUtc: new Date("2018-01-11T08:30:00.000Z"),
        properties: {
            AMLSettingsJsonString: `{"primary_metric": "AUC_weighted",
          "data_script": null,\
          "compute_target": "local",
          "n_cross_validations": 3,
          "max_cores_per_iteration": 1,
          "blacklist_algos": [],
          "exit_score": 100,
          "name": "my_experiment",
          "task_type": "classification" }`
        },
        tags: {
            iterations: "2"
        },
        experimentName: "BBB"
    }
];
