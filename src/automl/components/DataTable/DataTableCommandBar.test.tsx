import { shallow } from "enzyme";
import * as React from "react";
import { DataTableCommandBar, IDataTableCommandBarProps } from "./DataTableCommandBar";

describe("DataTableCommandBar", () => {
    describe("Component", () => {
        it("should render", () => {
            const wrapper = shallow(<DataTableCommandBar />);
            expect(wrapper)
                .toMatchSnapshot();
        });
    });
    describe("filterBox", () => {
        it("should not render if hideFilter is set", () => {
            const props: IDataTableCommandBarProps = {
                hideFilterBox: true
            };
            const wrapper = shallow(<DataTableCommandBar {...props} />);
            expect(wrapper)
                .toMatchSnapshot();
        });
    });
    describe("command items", () => {
        it("should render added items", () => {
            const callbackFunc = () => { return; };
            const commandItems = [{ key: "key1", name: "name1", onClick: callbackFunc },
                                  { key: "key2", name: "name2", onClick: callbackFunc }];
            const props: IDataTableCommandBarProps = {
                commandItems
            };
            const wrapper = shallow(<DataTableCommandBar {...props} />);
            expect(wrapper.render())
                .toMatchSnapshot();
        });
        it("should render added items with filter disabled", () => {
            const callbackFunc = () => { return; };
            const commandItems = [{ key: "key1", name: "name1", onClick: callbackFunc },
                                  { key: "key2", name: "name2", onClick: callbackFunc }];
            const props: IDataTableCommandBarProps = {
                hideFilterBox: true,
                commandItems
            };
            const wrapper = shallow(<DataTableCommandBar {...props} />);
            expect(wrapper.render())
                .toMatchSnapshot();
        });
        it("should render overflow items", () => {
            const callbackFunc = () => { return; };

            const commandItems = [{ key: "key1", name: "name1", onClick: callbackFunc },
                                  { key: "key2", name: "name2", onClick: callbackFunc }];

            const overflowItems = [{ key: "key3", name: "name3", onClick: callbackFunc },
                                   { key: "key4", name: "name4", onClick: callbackFunc }];

            const props: IDataTableCommandBarProps = {
                commandItems,
                overflowItems
            };
            const wrapper = shallow(<DataTableCommandBar {...props} />);
            expect(wrapper.render())
                .toMatchSnapshot();
        });
        it("should render overflow items with filter disabled", () => {
            const callbackFunc = () => { return; };

            const commandItems = [{ key: "key1", name: "name1", onClick: callbackFunc },
                                  { key: "key2", name: "name2", onClick: callbackFunc }];

            const overflowItems = [{ key: "key3", name: "name3", onClick: callbackFunc },
                                   { key: "key4", name: "name4", onClick: callbackFunc }];

            const props: IDataTableCommandBarProps = {
                hideFilterBox: true,
                commandItems,
                overflowItems
            };
            const wrapper = shallow(<DataTableCommandBar {...props} />);
            expect(wrapper.render())
                .toMatchSnapshot();
        });
    });
});
