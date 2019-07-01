import { RunHistoryAPIsModels } from "@vienna/runhistory";
import * as React from "react";
import { safeParseJson } from "../common/utils/safeParseJson";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PropertyList } from "../components/PropertyList/PropertyList";

export class ParentSettings extends React.Component<{
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
}> {
    public readonly render = (): React.ReactNode => {
        const run = this.props.run;
        if (!run || !run.properties) {
            return <PageLoadingSpinner />;
        }
        const amlSettingsString = run.properties.AMLSettingsJsonString;
        let parentRunSumData = {};
        if (amlSettingsString) {
            const amlSettings = safeParseJson(amlSettingsString);
            parentRunSumData = {
                "Best Pipeline": amlSettings.best_pipeline,
                "Compute Target": amlSettings.compute_target,
                "Data Script": amlSettings.data_script,
                "N Cross Validations": amlSettings.n_cross_validations,
                "Max Cores Per Iteration": amlSettings.max_cores_per_iteration,
                "Primary Metric": amlSettings.primary_metric,
                "Metric Operation": amlSettings.metric_operation,
                "Blacklisted Algorithms": amlSettings.blacklist_algos
            };
        }
        return <PropertyList listElements={parentRunSumData} />;
    }
}
