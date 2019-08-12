import { shallow } from "enzyme";
import * as React from "react";
import { parentFailureRun } from "./__data__/parentFailureRun";
import { parentSuccessRun, parentSuccessRunWithMaximumCore } from "./__data__/parentSuccessRun";
import { ParentSettings } from "./ParentSettings";

describe("Parent Settings", () => {

    it("should render loading image when no run", () => {
        const tree = shallow(<ParentSettings run={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it.each`
    data | scenario
    ${parentSuccessRun} | ${"non-max cores"}
    ${parentSuccessRunWithMaximumCore} | ${"max cores"}
    `("should render Run Settings table when successful run has $scenario", async ({ data }) => {
        const tree = shallow(<ParentSettings {...data} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render empty run settings table when no aml settings json", () => {
        const tree = shallow(<ParentSettings {...parentFailureRun} />);
        expect(tree)
            .toMatchSnapshot();
    });

});
