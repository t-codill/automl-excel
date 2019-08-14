import { RunHistoryAPIsModels } from "@vienna/runhistory";
import moment from "moment";
import * as React from "react";
import { BasicTypes } from "../common/BasicTypes";
import { IDictionary } from "../common/IDictionary";
import { calculateDuration } from "../common/utils/calculateDuration";
import { getSdkVersion } from "../common/utils/getSdkVersion";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PropertyList } from "../components/PropertyList/PropertyList";

export interface IChildRunSummaryProps {
    experimentName: string;
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined;
}

export class ChildRunSummary extends BaseComponent<IChildRunSummaryProps, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;
    public readonly render = (): React.ReactNode => {
        const run = this.props.run;
        if (!run || !run.properties) {
            return <PageLoadingSpinner />;
        }
        const runSumData: IDictionary<BasicTypes | React.ReactNode> = {
            "Run Id": run.runId,
            Status: run.status,
            Iteration: run.properties.iteration,
            "Run Preprocessor": run.properties.run_preprocessor,
            "Run Algorithm": run.properties.run_algorithm,
            Created: moment(run.startTimeUtc)
                .format("lll"),
            Duration: calculateDuration(run.startTimeUtc, run.endTimeUtc),
            "Sdk Version": getSdkVersion(run, "")
        };
        return <PropertyList listElements={runSumData} />;
    }
}
