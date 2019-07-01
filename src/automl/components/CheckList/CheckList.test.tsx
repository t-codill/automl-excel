import { shallow } from "enzyme";
import { List } from "office-ui-fabric-react";
import * as React from "react";
import { CheckList } from "./CheckList";
import { CheckListItem } from "./CheckListItem";

function mockData(count = 0): string[] {
    const data: string[] = [];

    for (let i = 0; i < count; i++) {
        data.push(`Item${i}`);
    }

    return data;
}

describe("CheckList", () => {
    it("should render empty list when the number of items is zero", () => {
        const wrapper = shallow(<CheckList items={[]} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render list with a checkbox for each item in items", () => {
        const wrapper = shallow(<CheckList items={mockData(10)} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should  render list item", () => {
        const items = mockData(5);
        const wrapper = shallow<CheckList>(<CheckList items={items} />);
        const list = wrapper.find(List);
        const onRenderCell = list.props().onRenderCell;
        let node: React.ReactNode;
        if (onRenderCell) {
            node = onRenderCell(items[0], 0);
        }
        expect(node)
            .toMatchSnapshot();
    });
    it("should  render no list item if undefined", () => {
        const items = mockData(5);
        const wrapper = shallow<CheckList>(<CheckList items={items} />);
        const list = wrapper.find(List);
        const onRenderCell = list.props().onRenderCell;
        let node: React.ReactNode = <div />;
        if (onRenderCell) {
            node = onRenderCell(undefined, 0);
        }
        expect(node)
            .toMatchInlineSnapshot("<React.Fragment />");
    });
    it("should clear selected items when props changed", () => {
        const wrapper = shallow<CheckList>(<CheckList items={mockData(10)} />);
        wrapper.setState({
            selectedItems: mockData(10)
        });
        wrapper.setProps({
            items: mockData(3)
        });
        expect(wrapper.state("selectedItems"))
            .toEqual([]);
    });
    it("should clear selected items and callback when props changed", () => {
        const onChange = jest.fn();
        const wrapper = shallow<CheckList>(<CheckList items={mockData(10)} onChange={onChange} />);
        wrapper.setState({
            selectedItems: mockData(10)
        });
        wrapper.setProps({
            items: mockData(3)
        });
        expect(onChange)
            .toBeCalledWith([]);
    });

    describe("check box callback", () => {
        const items = mockData(5);
        const wrapper = shallow<CheckList>(<CheckList items={items} />);
        const list = wrapper.find(List);
        const onRenderCell = list.props().onRenderCell;
        it("should check item", () => {
            if (onRenderCell) {
                const node = shallow(<div>{onRenderCell(items[0], 0)}</div>);
                const onChange = node.find(CheckListItem)
                    .prop("onChange");
                if (onChange) {
                    onChange(items[0], true);
                }
            }
            expect(wrapper.state("selectedItems"))
                .toEqual([items[0]]);
        });

        it("should not add item if already checked", () => {
            const onChange = jest.fn();
            wrapper.setProps({ onChange });
            if (onRenderCell) {
                const node = shallow(<div>{onRenderCell(items[0], 0)}</div>);
                const onChangeProp = node.find(CheckListItem)
                    .prop("onChange");
                if (onChangeProp) {
                    onChangeProp(items[0], true);
                }
            }
            expect(wrapper.state("selectedItems"))
                .toEqual([items[0]]);
            expect(onChange)
                .toBeCalledWith([items[0]]);
        });

        it("should remove item", () => {
            if (onRenderCell) {
                const node = shallow(<div>{onRenderCell(items[0], 0)}</div>);
                const onChangeProp = node.find(CheckListItem)
                    .prop("onChange");
                if (onChangeProp) {
                    onChangeProp(items[0], false);
                }
            }
            expect(wrapper.state("selectedItems"))
                .toEqual([]);
        });
    });

});
