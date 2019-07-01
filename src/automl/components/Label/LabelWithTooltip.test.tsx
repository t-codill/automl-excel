import { shallow, ShallowWrapper } from "enzyme";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { LabelWithTooltip } from "./LabelWithTooltip";

describe("LabelWithTooltip", () => {
    let wrapper: ShallowWrapper;
    beforeEach(() => {
        wrapper = shallow(
            <LabelWithTooltip required={true} htmlFor="dropdownId" labelText="Test Label" tooltipText="Test Tooltip" />
        );
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should show 'Test Label' in tooltip on hover of 'icon button'", () => {
        wrapper.find(Icon)
            .simulate("hover");
        expect(wrapper)
            .toMatchSnapshot();
    });
});
