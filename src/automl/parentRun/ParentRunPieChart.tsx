import { PieChart } from "@vienna/chart-lib";
import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { countBy } from "lodash";
import * as React from "react";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";

export class ParentRunPieChart extends BaseComponent<
    { childRuns: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto[] | undefined }, {}, {}>  {
    protected serviceConstructors = {};
    protected getData = undefined;

    public readonly render = (): React.ReactNode => {
        if (!this.props.childRuns) {
            return <PageLoadingSpinner />;
        }
        const originRunStatistics = countBy(this.props.childRuns, (run) => run && run.status);
        const pieChartData = {
            values: Object.values(originRunStatistics),
            labels: Object.keys(originRunStatistics)
        };
        return <PieChart metric={pieChartData} theme={this.context.theme} />;
    }
}
