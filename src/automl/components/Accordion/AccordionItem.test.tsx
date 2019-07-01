import { shallow } from "enzyme";
import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { AccordionItem } from "./AccordionItem";

const toggleCollapsed = jest.fn();

describe("AccordionItem", () => {
    it("should render", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={false}
            disabled={false}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("click should trigger toggle", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={false}
            disabled={false}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        wrapper
            .find("div.header")
            .simulate("click");
        expect(toggleCollapsed)
            .toBeCalledWith(0);
    });
    it("disable items should not be clickable", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={false}
            disabled={true}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        wrapper
            .find("div.header")
            .simulate("click");
        expect(toggleCollapsed)
            .toBeCalledTimes(0);
    });
    it("active item", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={false}
            disabled={false}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        const accordion = wrapper.find("div.accordion");
        expect(accordion.hasClass("disabled"))
            .toBe(false);
        expect(accordion.hasClass("collapsed"))
            .toBe(false);
        expect(wrapper.contains(<Icon iconName="ChevronDownMed" />))
            .toBe(true);
    });
    it("disabled item", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={false}
            disabled={true}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        const accordion = wrapper.find("div.accordion");
        expect(accordion.hasClass("disabled"))
            .toBe(true);
        expect(accordion.hasClass("collapsed"))
            .toBe(false);
        expect(wrapper.contains(<Icon iconName="ChevronDownMed" />))
            .toBe(true);
    });
    it("collapsed item", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={true}
            disabled={false}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        const accordion = wrapper.find("div.accordion");
        expect(accordion.hasClass("disabled"))
            .toBe(false);
        expect(accordion.hasClass("collapsed"))
            .toBe(true);
        expect(wrapper.contains(<Icon iconName="ChevronRightMed" />))
            .toBe(true);
    });
    it("disabled collapsed item", () => {
        const wrapper = shallow(<AccordionItem
            title="Item 1"
            collapsed={true}
            disabled={true}
            element={<div />}
            toggleCollapsed={toggleCollapsed}
            index={0}
        />);
        const accordion = wrapper.find("div.accordion");
        expect(accordion.hasClass("disabled"))
            .toBe(true);
        expect(accordion.hasClass("collapsed"))
            .toBe(true);
        expect(wrapper.contains(<Icon iconName="ChevronRightMed" />))
            .toBe(true);
    });
});
