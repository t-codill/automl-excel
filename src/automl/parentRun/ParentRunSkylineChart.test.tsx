import { shallow } from "enzyme";
import * as React from "react";
import { parentSuccessRun } from "./__data__/parentSuccessRun";
import { ParentRunSkylineChart } from "./ParentRunSkylineChart";

describe("Parent Run Skyline Chart", () => {

    it("should render loading image when no run", () => {
        const tree = shallow(<ParentRunSkylineChart
            experimentName="foo"
            run={undefined}
            childRuns={undefined}
            childRunMetrics={undefined}
        />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should render No Data when no run", () => {
        const tree = shallow(<ParentRunSkylineChart
            experimentName="foo"
            run={parentSuccessRun.run}
            childRuns={[]}

            childRunMetrics={[]}
        />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render chart when successful run", () => {
        const tree = shallow(<ParentRunSkylineChart
            experimentName="foo"
            run={parentSuccessRun.run}
            childRuns={parentSuccessRun.childRuns}
            childRunMetrics={parentSuccessRun.childRunMetrics}
        />);
        expect(tree)
            .toMatchSnapshot();
    });
});
