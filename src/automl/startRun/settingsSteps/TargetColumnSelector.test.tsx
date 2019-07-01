import { shallow } from "enzyme";
import * as React from "react";
import { IColumnSelectorProps, TargetColumnSelector } from "./TargetColumnSelector";

describe("TargetColumnSelector", () => {
    const validProps: IColumnSelectorProps = {
        columns: ["A", "B", "C"]
    };
    const invalidProps: IColumnSelectorProps = {
        columns: undefined
    };

    it("should render with undefined props", () => {
        const tree = shallow(
            <TargetColumnSelector {...invalidProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with valid props", () => {
        const tree = shallow(
            <TargetColumnSelector {...validProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
    describe("Filter", () => {
        it("should filter correct results", () => {
            const wrapper = shallow(<TargetColumnSelector {...validProps} />);
            wrapper.setState({ filterText: "B" });
            expect(wrapper)
                .toMatchSnapshot();
        });
    });
});
