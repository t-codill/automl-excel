import { NotNullableProperties } from "../../common/utils/NotNullableProperties";
import { IParentRunData } from "../ParentRun";

export const parentSuccessRunAMLSettings = {
  primary_metric: "AUC_weighted",
  data_script: null,
  compute_target: "local",
  n_cross_validations: 3,
  max_cores_per_iteration: 1,
  blacklist_algos: [],
  exit_score: 100,
  name: "my_experiment",
  task_type: "classification"
};
export const parentSuccessRun: NotNullableProperties<IParentRunData> = {
  run: {
    runId: "AutoML_000",
    parentRunId: undefined,
    status: "Completed",
    startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
    endTimeUtc: new Date("2019-02-01T08:30:00.000Z"),
    properties: {
      AMLSettingsJsonString: JSON.stringify(parentSuccessRunAMLSettings)
    },
    tags: {
      iterations: "2"
    },
  },
  experimentName: "Test",
  childRuns: [
    {
      createdUtc: new Date("2019-02-01T08:20:00.000Z"),
      runId: "AutoML_001",
      parentRunId: "AutoML_000",
      status: "Completed",
      startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
      endTimeUtc: new Date("2019-02-01T08:25:00.000Z"),
      experimentId: "exp",
      options: {
        generateDataContainerIdIfNotSpecified: true
      },
      name: "AutoML_001",
      properties: {
        runTemplate: "automl_child",
        pipeline_id: "eda663ea8f36e6c07948c99bba9d1becb40991a5",
        run_template: "automl_child",
        run_algorithm: "RandomForest",
        run_preprocessor: "MaxAbsScaler",
        score: "0.977770827248834",
        class_labels: "",
        primary_metric: "spearman_correlation",
      }
    },
    {
      createdUtc: new Date("2019-02-01T08:20:00.000Z"),
      runId: "AutoML_002",
      parentRunId: "AutoML_000",
      status: "Completed",
      startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
      endTimeUtc: new Date("2019-02-01T08:25:00.000Z"),
      options: {
        generateDataContainerIdIfNotSpecified: true
      },
      name: "AutoML_002",
      properties: {
        runTemplate: "automl_child",
        pipeline_id: "eda663ea8f36e6c07948c99bba9d1becb40991a5",
        run_template: "automl_child",
        run_preprocessor: "MaxAbsScaler",
        score: "0.877770827248834",
        class_labels: "",
        primary_metric: "spearman_correlation",
      }
    },
    {
      createdUtc: new Date("2019-02-01T08:20:00.000Z"),
      runId: "AutoML_003",
      parentRunId: "AutoML_000",
      status: "Canceled",
      startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
      endTimeUtc: new Date("2019-02-01T08:25:00.000Z"),
      options: {
        generateDataContainerIdIfNotSpecified: true
      },
      name: "AutoML_003",
      properties: {
        runTemplate: "automl_child",
        pipeline_id: "eda663ea8f36e6c07948c99bba9d1becb40991a5",
        run_template: "automl_child",
        score: "0.877770827248834",
        class_labels: "",
        primary_metric: "spearman_correlation",
      }
    },
    {
      createdUtc: new Date("2019-02-01T08:20:00.000Z"),
      runId: "AutoML_004",
      parentRunId: "AutoML_000",
      status: "Completed",
      startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
      endTimeUtc: new Date("2019-02-01T08:25:00.000Z"),
      options: {
        generateDataContainerIdIfNotSpecified: true
      },
      name: "AutoML_004",
      properties: {
        runTemplate: "automl_child",
        pipeline_id: "eda663ea8f36e6c07948c99bba9d1becb40991a5",
        run_template: "automl_child",
        run_algorithm: "MaxAbsScaler",
        score: "0.827770827248834",
        class_labels: "",
        primary_metric: "spearman_correlation",
      },
    },
    {
      createdUtc: new Date("2019-02-01T08:20:00.000Z"),
      runId: "AutoML_005",
      parentRunId: "AutoML_000",
      status: "Completed",
      startTimeUtc: new Date("2019-02-01T08:20:00.000Z"),
      endTimeUtc: new Date("2019-02-01T08:25:00.000Z"),
      options: {
        generateDataContainerIdIfNotSpecified: true
      },
      name: "AutoML_005",
    }
  ],
  childRunMetrics: [
    {
      spearman_correlation: 0.877770827248834
    }
  ]
};
