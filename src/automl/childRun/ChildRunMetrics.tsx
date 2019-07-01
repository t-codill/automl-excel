import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { isEmpty, isObjectLike, pickBy } from "lodash";
import { MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { BasicTypes } from "../common/BasicTypes";
import { IDictionary } from "../common/IDictionary";
import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { PropertyList } from "../components/PropertyList/PropertyList";
import { RunMetricType } from "../services/RunHistoryService";

const runMetrics: React.FunctionComponent<{
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
    runMetrics: IDictionary<RunMetricType> | undefined;
}> = (props) => {
    const getScalar = (): IDictionary<BasicTypes> => {
        return pickBy(props.runMetrics, (metricValue, metricName) => {
            if (!isObjectLike(metricValue)) {
                return {
                    [metricName]: metricValue
                };
            }
            return undefined;
        }) as IDictionary<BasicTypes>;
    };
    if (!props.run || !props.runMetrics) {
        return <PageLoadingSpinner />;
    }

    if (isEmpty(props.runMetrics)) {
        return (
            <MessageBar>No metrics</MessageBar>
        );
    }
    return <PropertyList listElements={getScalar()} />;
};

export { runMetrics as ChildRunMetrics };
