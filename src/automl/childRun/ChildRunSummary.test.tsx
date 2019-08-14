import { shallow } from "enzyme";
import * as React from "react";
import { classificationSuccessRun } from "./__data__/classificationSuccessRun";
import { failureRun } from "./__data__/failureRun";
import { regressionSuccessRun } from "./__data__/regressionSuccessRun";
import { ChildRunSummary } from "./ChildRunSummary";

describe("Child Run Summary", () => {
    it("should render loading image when no run metrics", async () => {
        const tree = shallow(<ChildRunSummary run={undefined} experimentName={""} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should render success data without download link", async () => {
        const tree = shallow(<ChildRunSummary run={classificationSuccessRun.run} experimentName={""} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render success data with download link", async () => {
        const tree = shallow(<ChildRunSummary run={regressionSuccessRun.run} experimentName={"Experiment"} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render page loading image without run properties", async () => {
        const tree = shallow(<ChildRunSummary run={failureRun.run} experimentName={"Experiment"} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
});
