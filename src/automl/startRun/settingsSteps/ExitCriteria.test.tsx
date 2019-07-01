import { shallow } from "enzyme";
import * as React from "react";
import { ExitCriteria } from "./ExitCriteria";

describe("ExitCriteria", () => {

    it("should render", () => {
        const tree = shallow(
            <ExitCriteria primaryMetric="accuracy" />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
