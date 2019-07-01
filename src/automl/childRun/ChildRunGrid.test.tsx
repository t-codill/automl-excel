import { shallow } from "enzyme";
import * as React from "react";
import { ChildRunGrid, IChildRunGridProps } from "./ChildRunGrid";
import { ChildRunModel } from "./ChildRunModel";

describe("Child Run Grid", () => {
    describe("Classification Success", () => {
        it("should render graphs, run metrics and run summary in grid", async () => {
            const run = {};
            const tree = shallow(<ChildRunGrid
                experimentName="foo"
                run={run}
                runMetrics={{}}
                modelUri="test model Uri"
                onModelRegister={jest.fn()}
            />);
            expect(tree)
                .toMatchSnapshot();
        });
        it("should show model link", async () => {
            const props: IChildRunGridProps = {
                experimentName: "foo",
                runMetrics: {},
                modelUri: "test model Uri",
                onModelRegister: jest.fn(),
                run: {
                    status: "Completed",
                    tags: {
                        model_id: "modelId1"
                    },
                }
            };
            const tree = shallow(<ChildRunGrid {...props} />);
            expect(tree.find(ChildRunModel)
                .props())
                .toEqual({
                    ...props,
                    runMetrics: undefined
                });
        });
    });
});
