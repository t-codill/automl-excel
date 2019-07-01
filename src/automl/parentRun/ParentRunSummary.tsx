import { RunHistoryAPIsModels } from "@vienna/runhistory";

import * as React from "react";
import { safeParseJson } from "../common/utils/safeParseJson";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PropertyList } from "../components/PropertyList/PropertyList";

export class ParentRunSummary extends React.Component<{
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
                "Exit Score": amlSettings.exit_score,
                "Experiment Name": amlSettings.name,
                "Run Id": run.runId,
                "Task Type": amlSettings.is_timeseries ? "forecasting" : amlSettings.task_type,
                "History Name": amlSettings.history_name,
                Iteration: run.tags ? run.tags.iterations : undefined,
                "Preprocessing Steps": amlSettings.preprocessing_steps,
                Status: run.status
            };
        }
        return <PropertyList listElements={parentRunSumData} />;
    }
}
