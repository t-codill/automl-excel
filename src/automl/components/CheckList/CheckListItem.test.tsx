import { shallow } from "enzyme";
import { Checkbox } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { CheckListItem } from "./CheckListItem";

describe("CheckListItem", () => {
    it("should render nothing if item is undefined", () => {
        const wrapper = shallow(<CheckListItem item={undefined} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should render item with checkbox", () => {
        const wrapper = shallow(<CheckListItem item={"item1"} />);
        expect(wrapper.find(Checkbox))
            .toHaveLength(1);
    });

    it("should callback onChange", () => {
        const onSelectionChanged = jest.fn(() => { return; });
        const wrapper = shallow(<CheckListItem item={"item1"} onChange={onSelectionChanged} />);
        const onChange = wrapper.find(Checkbox)
            .props()
            .onChange;
        if (onChange) {
            onChange(reactFormEvent, true);
        }
        expect(onSelectionChanged)
            .toBeCalledWith("item1", true);
    });

    it("should not error out if on change not passed", () => {
        const wrapper = shallow(<CheckListItem item={"item1"} />);
        const onChange = wrapper.find(Checkbox)
            .props()
            .onChange;
        if (onChange) {
            onChange(reactFormEvent, true);
        }
    });

});
