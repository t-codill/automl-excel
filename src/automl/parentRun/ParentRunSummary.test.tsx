import { shallow } from "enzyme";
import * as React from "react";
import { PropertyList } from "../components/PropertyList/PropertyList";
import { parentFailureRun } from "./__data__/parentFailureRun";
import { parentSuccessRun } from "./__data__/parentSuccessRun";
import { ParentRunSummary } from "./ParentRunSummary";

describe("Parent Run Summary", () => {

    it("should render loading image when no run", () => {
        const tree = shallow(<ParentRunSummary run={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should render Run Summary table when successful run", () => {
        const tree = shallow(<ParentRunSummary {...parentSuccessRun} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should not render iteration tags when undefined", () => {
        const runWithIterationTags = parentSuccessRun;
        if (runWithIterationTags.run) {
            runWithIterationTags.run.tags = undefined;
        }
        const tree = shallow(<ParentRunSummary {...parentSuccessRun} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render empty Run Summary table when no aml settings json", () => {
        const tree = shallow(<ParentRunSummary {...parentFailureRun} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should show forecasting as task type", () => {
        const tree = shallow(<ParentRunSummary {...parentFailureRun}
            run={
                {
                    ...parentFailureRun.run,
                    properties: {
                        AMLSettingsJsonString: JSON.stringify({
                            is_timeseries: true
                        })
                    }
                }
            }
        />);
        expect(tree.find(PropertyList)
            .prop("listElements")["Task Type"])
            .toBe("forecasting");
    });

});
