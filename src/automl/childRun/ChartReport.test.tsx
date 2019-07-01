import { shallow } from "enzyme";
import * as React from "react";
import { classificationSuccessRun } from "./__data__/classificationSuccessRun";
import { failureRun } from "./__data__/failureRun";
import { regressionSuccessRun } from "./__data__/regressionSuccessRun";
import { ChartReport } from "./ChartReport";

describe("Chart Report", () => {
    describe("Classification Success", () => {
        it("should render loading image when no run metrics", async () => {
            const tree = shallow(<ChartReport run={undefined} runMetrics={undefined} />);
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });
        it("should render accuracy charts and confusion matrix", async () => {
            const tree = shallow(<ChartReport run={classificationSuccessRun.run} runMetrics={classificationSuccessRun.runMetrics} />);
            expect(tree)
                .toMatchSnapshot();
        });
    });
    describe("Classification Failure", () => {
        it("should render no data message", async () => {
            const tree = shallow(<ChartReport run={failureRun.run} runMetrics={failureRun.runMetrics} />);
            expect(tree)
                .toMatchSnapshot();
        });
    });
    describe("Regression Success", () => {
        it("should render residuals and predicted vs true chart", async () => {
            const tree = shallow(<ChartReport run={regressionSuccessRun.run} runMetrics={regressionSuccessRun.runMetrics} />);
            expect(tree)
                .toMatchSnapshot();
        });
    });
});
