import { shallow } from "enzyme";
import * as React from "react";
import { classificationSuccessRun } from "./__data__/classificationSuccessRun";
import { failureRun } from "./__data__/failureRun";
import { ChildRunMetrics } from "./ChildRunMetrics";

describe("Child Run Metrics", () => {
    it("should render loading image when no run metrics", async () => {
        const tree = shallow(<ChildRunMetrics run={undefined} runMetrics={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });

    it("should render no data message when run failed with no metrics", async () => {
        const tree = shallow(<ChildRunMetrics run={failureRun.run} runMetrics={failureRun.runMetrics} />);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render scalar metrics", async () => {
        const tree = shallow(<ChildRunMetrics run={classificationSuccessRun.run} runMetrics={classificationSuccessRun.runMetrics} />);
        expect(tree)
            .toMatchSnapshot();
    });
});
