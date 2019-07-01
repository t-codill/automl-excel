import { shallow } from "enzyme";
import * as React from "react";
import { parentSuccessRun } from "./__data__/parentSuccessRun";
import { ParentRunGrid } from "./ParentRunGrid";
import { ParentRunModel } from "./ParentRunModel";

describe("Parent Run Grid", () => {
    const props = {
        experimentName: "foo",
        run: {},
        childRuns: [],
        childRunMetrics: [],
        onModelRegister: jest.fn()
    };
    describe("Classification Success", () => {
        it("should render graphs, run metrics and run summary in grid", async () => {
            const tree = shallow(
                <ParentRunGrid {...props} />
            );
            expect(tree)
                .toMatchSnapshot();
        });
    });
    describe("Should render model", () => {
        it("should render graphs, run metrics and run summary in grid", async () => {
            const propsWithRun = { ...props, run: parentSuccessRun.run };
            const tree = shallow(
                <ParentRunGrid {...propsWithRun} />
            );
            expect(tree.find(ParentRunModel)
                .props())
                .toEqual(propsWithRun);
        });
    });
});
