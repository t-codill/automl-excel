//import { SkylineChart } from "@mlworkspace/charts";
import { map } from "lodash";
import { MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { generateRunName } from "../common/utils/generateRunName";
// import { isTerminatedRunStatus } from "../common/utils/run";
import { safeParseJson } from "../common/utils/safeParseJson";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { IParentRunData } from "./ParentRun";

export class ParentRunSkylineChart extends BaseComponent<IParentRunData, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;

    public readonly render = (): React.ReactNode => {
        if (!this.props.childRunMetrics || !this.props.run || !this.props.run.properties) {
            return <PageLoadingSpinner />;
        }

        if (this.props.childRunMetrics.length < 1
        ) {
            return (
                <MessageBar>No data for visualization</MessageBar>
            );
        }

        // if (isTerminatedRunStatus(this.props.run.status)) {
        //     // TODO: render shimmer
        // )

        const min = safeParseJson(this.props.run.properties.AMLSettingsJsonString).metric_operation === "minimize";
        const names = map(this.props.childRuns, generateRunName);
        //@ts-ignore
        const skylineChartInput = {
            metrics: this.props.childRunMetrics,
            names,
            primaryMetricName: this.props.run.properties.primary_metric,
            min
        };
        return null /*(<SkylineChart
            metric={skylineChartInput}
            theme={this.context.theme}
            configOverride={{
                layout: {
                    margin: {
                        l: 60,
                        r: 60,
                        b: 60,
                        t: 40
                    },
                },
                useResizeHandler: true,
                config: {
                    displayModeBar: false
                }
            }} />)*/;
    }
}
