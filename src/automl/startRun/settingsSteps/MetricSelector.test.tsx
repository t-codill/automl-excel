import { shallow } from "enzyme";
import * as React from "react";
import { IMetricSelectorProps, MetricSelector } from "./MetricSelector";

describe("MetricSelector", () => {

    it("should render with undefined props", () => {
        const undefinedProps: IMetricSelectorProps = {
            jobType: undefined
        };
        const tree = shallow(
            <MetricSelector {...undefinedProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with classification type props", () => {
        const classificationProps: IMetricSelectorProps = {
            jobType: "classification"
        };
        const tree = shallow(
            <MetricSelector {...classificationProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with regression type props", () => {
        const regressionProps: IMetricSelectorProps = {
            jobType: "regression"
        };
        const tree = shallow(
            <MetricSelector {...regressionProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with forecasting type props", () => {
        const forecastingProps: IMetricSelectorProps = {
            jobType: "forecasting"
        };
        const tree = shallow(
            <MetricSelector {...forecastingProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render when different from previous props", () => {
        const preProps: IMetricSelectorProps = {
            jobType: "regression",
        };
        const tree = shallow(
            <MetricSelector {...preProps} />
        );
        tree.setProps({ jobType: "classification" });
        expect(tree)
            .toMatchSnapshot();
    });

});
