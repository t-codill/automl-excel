/*import {
    CalibrationChart,
    ConfusionMatrixChart,
    GainsChart,
    IAccuracyTableInput,
    IConfusionMatrixInput,
    IPredictedTrueMetricInput,
    IResidualMetricInput,
    LiftChart,
    PRChart,
    PredictedTrueChart,
    ResidualChart,
    ROCChart
} from "@mlworkspace/charts";*/
import { RunHistoryAPIsModels } from "@vienna/runhistory";
//import { assign, forOwn, isEmpty, size } from "lodash";
//import { MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { IDictionary } from "../common/IDictionary";
import { BaseComponent } from "../components/Base/BaseComponent";
//import { GridWrapper } from "../components/Grid/GridWrapper";
//import { IGridElementProps } from "../components/Grid/IGridElementProps";
//import { PageLoadingSpinner } from "../components/Progress/PageLoadingSpinner";
import { RunMetricType } from "../services/RunHistoryService";

import "./ChartReport.scss";

export class ChartReport extends BaseComponent<{
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined;
    runMetrics: IDictionary<RunMetricType> | undefined;
}, {}, {}> {
    protected serviceConstructors = {};
    protected getData = undefined;

    public readonly render = (): React.ReactNode => {
        return <></>
        /*
        if (!this.props.run || !this.props.runMetrics) {
            return <PageLoadingSpinner />;
        }
        const chartProps: IGridElementProps[] = [];
        const runMetrics = this.props.runMetrics;
        const chartElements: IDictionary<React.ReactNode> = {};
        const configProps = { useResizeHandler: true };

        const theme = this.context.theme;

        const predictedTrueMetrics = runMetrics.predicted_true;
        if (predictedTrueMetrics) {
            chartElements.predTrueChart = <PredictedTrueChart key="predTrueChart"
                metric={predictedTrueMetrics as IPredictedTrueMetricInput} theme={theme} configOverride={configProps} />;
        }

        const residualMetrics = runMetrics.residuals;
        if (residualMetrics) {
            chartElements.resChart = <ResidualChart key="resChart"
                metric={residualMetrics as IResidualMetricInput} theme={theme} configOverride={configProps} />;
        }

        const accMetrics: IAccuracyTableInput | undefined = runMetrics.accuracy_table as IAccuracyTableInput | undefined;
        if (accMetrics) {
            assign(chartElements,
                {
                    prChart: <PRChart key="prChart" metric={accMetrics} theme={theme} configOverride={configProps} />,
                    rocChart: <ROCChart key="rocChart" metric={accMetrics} theme={theme} configOverride={configProps} />,
                    calChart: <CalibrationChart key="calChart" metric={accMetrics} theme={theme} configOverride={configProps} />,
                    liftChart: <LiftChart key="liftChart" metric={accMetrics} theme={theme} configOverride={configProps} />,
                    gainsChart: <GainsChart key="gainsChart" metric={accMetrics} theme={theme} configOverride={configProps} />
                }
            );
        }
        const confusionMatrixMetrics = runMetrics.confusion_matrix;
        if (confusionMatrixMetrics) {
            chartElements.confMatChart = <ConfusionMatrixChart key="confMatChart"
                metric={confusionMatrixMetrics as IConfusionMatrixInput} theme={theme} configOverride={configProps} />;
        }

        if (isEmpty(this.props.runMetrics)) {
            return (
                <MessageBar>No data for visualization</MessageBar>
            );
        }

        this.generateGridProps(chartElements, chartProps);
        const m: [number, number] = [0, 0];
        return (<GridWrapper
            margin={m}
            gridElementPropsList={chartProps}
            cols={{
                lg: 8,
                md: 8,
                sm: 4,
                xs: 4,
                xxs: 4
            }}
        />
        );
    }
    private readonly generateGridProps = (nodes: IDictionary<React.ReactNode>,
        gPList: IGridElementProps[]) => {
        let ctr = 0;
        const numCharts = size(nodes);
        forOwn(nodes, (node, nodeKey) => {
            const element = {
                title: "",
                element: node,
                key: nodeKey,
                x: 0,
                y: ctr * 3,
                width: 8,
                height: 3,
                className: "chart-element"
            };
            // allow charts to fill more space if fewer charts
            if (numCharts > 4) {
                element.x = (ctr % 2 === 0) ? 0 : 4;
                element.y = (Math.floor(ctr / 2) * 3);
                element.width = 4;
            }
            ctr++;
            gPList.push(element);
        });
        */
    }
}
