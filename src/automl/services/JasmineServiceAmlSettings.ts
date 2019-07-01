import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { IWorkspaceProps } from "../common/context/IWorkspaceProps";
import { AdvancedSetting } from "./AdvancedSetting";
import { MetricOperation } from "./constants/MetricOperation";

const maxEnsembleIterations = 15;
export const getAmlSettings = (
    experimentName: string,
    compute: AzureMachineLearningWorkspacesModels.ComputeResource,
    props: IWorkspaceProps,
    advancedSettingParams: AdvancedSetting
) => {
    if (!compute.properties) {
        throw new Error(`${compute.name} is not a valid compute`);
    }

    let ensembleIterations: number | null;
    let enableEnsembling: boolean;
    const iterations = advancedSettingParams.maxIteration;
    if (iterations > 2) {
        enableEnsembling = true;
        ensembleIterations = Math.min(iterations, maxEnsembleIterations);
    }
    else {
        enableEnsembling = false;
        ensembleIterations = null;
    }

    let jobType = advancedSettingParams.jobType;
    if (jobType === "forecasting") {
        jobType = "regression";
    }

    return {
        name: experimentName,
        path: `./sample_projects/${experimentName}`,
        subscription_id: props.subscriptionId,
        resource_group: props.resourceGroupName,
        workspace_name: props.workspaceName,
        region: props.location,
        iterations,
        primary_metric: advancedSettingParams.metric,
        data_script: null,
        compute_target: compute.name,
        task_type: jobType,
        validation_size: advancedSettingParams.validationSize,
        n_cross_validations: advancedSettingParams.nCrossValidations,
        y_min: null,
        y_max: null,
        num_classes: null,
        preprocess: advancedSettingParams.preprocess && advancedSettingParams.jobType !== "forecasting",
        lag_length: 0,
        max_cores_per_iteration: advancedSettingParams.maxCores,
        max_concurrent_iterations: advancedSettingParams.maxConcurrent,
        iteration_timeout_minutes: advancedSettingParams.experimentTimeoutMinutes,
        mem_in_mb: null,
        enforce_time_on_windows: true,
        experiment_timeout_minutes: advancedSettingParams.experimentTimeoutMinutes,
        experiment_exit_score: advancedSettingParams.experimentExitScore,
        whitelist_models: null,
        blacklist_algos: advancedSettingParams.blacklistAlgos,
        auto_blacklist: false,
        blacklist_samples_reached: false,
        exclude_nan_labels: true,
        verbosity: 20,
        debug_log: "automl_errors.log",
        show_warnings: false,
        model_explainability: false,
        service_url: null,
        sdk_url: null,
        sdk_packages: null,
        telemetry_verbosity: "INFO",
        send_telemetry: true,
        spark_service: null,
        metrics: null,
        enable_ensembling: enableEnsembling,
        ensemble_iterations: ensembleIterations,
        enable_tf: false,
        enable_cache: true,
        enable_subsampling: false,
        subsample_seed: null,
        cost_mode: 0,
        metric_operation: MetricOperation[advancedSettingParams.metric],
        is_timeseries: advancedSettingParams.jobType === "forecasting",
        time_column_name: advancedSettingParams.timeSeriesColumn,
        max_horizon: advancedSettingParams.maxHorizon,
        enable_onnx_compatible_models: false,
        enable_voting_ensemble: true,
        enable_stack_ensemble: true,
        enable_stack_ensembling: false,
        grain_column_names: advancedSettingParams.grainColumns,
        enable_early_stopping: false,
        early_stopping_n_iters: 10,
        enable_feature_sweeping: false
    };
};
