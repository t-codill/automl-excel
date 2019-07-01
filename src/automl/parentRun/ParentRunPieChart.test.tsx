import { shallow, ShallowWrapper } from "enzyme";
import React from "react";
import { classificationSuccessRun } from "../childRun/__data__/classificationSuccessRun";
import { failureRun } from "../childRun/__data__/failureRun";
import { ParentRunPieChart } from "./ParentRunPieChart";

describe("DataProfiling", () => {
    it("render without data", async () => {
        const tree = shallow(<ParentRunPieChart childRuns={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });

    it("render with data", async () => {
        let tree: ShallowWrapper | undefined;
        if (classificationSuccessRun.run && failureRun.run) {
            tree = shallow(<ParentRunPieChart childRuns={[classificationSuccessRun.run, failureRun.run]} />);
        }
        expect(tree)
            .toMatchSnapshot();
    });
});
