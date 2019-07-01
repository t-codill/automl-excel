import { shallow } from "enzyme";
import * as React from "react";
import { Accordion } from "./Accordion";
import { AccordionItem } from "./AccordionItem";

const items = [
    {
        title: "Item 1",
        collapsed: false,
        disabled: false,
        element: <div />
    },
    {
        title: "Item 2",
        collapsed: true,
        disabled: false,
        element: <div />
    },
    {
        title: "Item 3",
        collapsed: false,
        disabled: true,
        element: <div />
    },
    {
        title: "Item 4",
        collapsed: true,
        disabled: true,
        element: <div />
    }
];
describe("Accordion", () => {
    it("should render", () => {
        const wrapper = shallow(<Accordion
            exclusive={true}
            items={items} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render empty list when the number of items is zero", () => {
        const wrapper = shallow(<Accordion
            exclusive={true}
            items={[]} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should collapse", () => {
        const wrapper = shallow(<Accordion
            exclusive={true}
            items={items} />);
        wrapper
            .find(AccordionItem)
            .at(0)
            .props()
            .toggleCollapsed(0);
        expect(wrapper
            .find(AccordionItem)
            .at(0)
            .props()
            .collapsed)
            .toBe(true);
    });
    it("should collapse active accordion if exclusive = true", () => {
        const wrapper = shallow(<Accordion
            exclusive={true}
            items={items} />);
        wrapper
            .find(AccordionItem)
            .at(2)
            .props()
            .toggleCollapsed(2);
        expect(wrapper
            .find(AccordionItem)
            .at(0)
            .props()
            .collapsed)
            .toBe(true);
    });
    it("click 2 times should collapse again", () => {
        const wrapper = shallow(<Accordion
            exclusive={true}
            items={items} />);
        wrapper
            .find(AccordionItem)
            .at(2)
            .props()
            .toggleCollapsed(2);
        wrapper
            .find(AccordionItem)
            .at(2)
            .props()
            .toggleCollapsed(2);
        expect(wrapper
            .find(AccordionItem)
            .at(2)
            .props()
            .collapsed)
            .toBe(true);
    });
    it("should not collapse active accordion if exclusive = false", () => {
        const wrapper = shallow(<Accordion
            exclusive={false}
            items={items} />);
        wrapper
            .find(AccordionItem)
            .at(2)
            .props()
            .toggleCollapsed(2);
        expect(wrapper
            .find(AccordionItem)
            .at(0)
            .props()
            .collapsed)
            .toBe(false);
    });
    it("change props should trigger re-render", () => {
        const wrapper = shallow(<Accordion
            exclusive={false}
            items={items} />);
        wrapper.setProps({ exclusive: true });
        expect(wrapper)
            .toMatchSnapshot();
    });
});
