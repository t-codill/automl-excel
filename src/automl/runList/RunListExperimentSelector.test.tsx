import { shallow, ShallowWrapper } from "enzyme";
import { Dropdown, IDropdownOption, IDropdownProps, IToggleProps, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../__data__/reactFormEvent";
import { reactMouseEvent } from "../__data__/reactMouseEvent";
import { RunListExperimentSelector } from "./RunListExperimentSelector";

describe("RunListExperimentSelector", () => {
    let tree: ShallowWrapper;
    let dropdownProps: IDropdownProps;
    const mockCallBack = jest.fn();
    const props = {
        experimentNames: ["a", "b", "c", "d", "e"],
        isAllSelect: true,
        onExperimentChange: mockCallBack
    };

    beforeEach(() => {
        tree = shallow(
            <RunListExperimentSelector {...props} />
        );
        dropdownProps = tree.find(Dropdown)
            .props();
    });

    describe("Initial Render", () => {
        it("should render date selector dropdown", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should not call onDateChange with undefined option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, undefined);
            }
            expect(mockCallBack)
                .toBeCalledTimes(0);
        });
        it("should render with undefined experiment names", () => {
            const emptyProps = {
                experimentNames: undefined,
                isAllSelect: true,
                onExperimentChange: mockCallBack
            };
            const emptyTree = shallow(
                <RunListExperimentSelector {...emptyProps} />
            );
            expect(emptyTree)
                .toMatchSnapshot();
        });
        it("should render undefined option", () => {
            let option;
            if (dropdownProps && dropdownProps.onRenderOption) {
                option = dropdownProps.onRenderOption();
            }
            expect(option)
                .toMatchSnapshot();
        });
        it("should render toggle option", () => {
            let option;
            if (dropdownProps && dropdownProps.onRenderOption) {
                option = dropdownProps.onRenderOption({ key: "AA", text: "AA", index: 0 });
            }
            expect(option)
                .toMatchSnapshot();
        });
        it("should render experiment option", () => {
            let option;
            const render = (_props?: IDropdownOption) => {
                return null;
            };
            if (dropdownProps && dropdownProps.onRenderOption) {
                option = dropdownProps.onRenderOption({ key: "AA", text: "AA" }, render);
            }
            expect(option)
                .toMatchSnapshot();
        });
        it("should render default option", () => {
            let option;
            if (dropdownProps && dropdownProps.onRenderOption) {
                option = dropdownProps.onRenderOption({ key: "AA", text: "AA" });
            }
            expect(option)
                .toMatchSnapshot();
        });
    });

    describe("Validate Multi select", () => {
        it("should call onDateChange with valid option", () => {
            tree.setState({ experimentSelectedItems: undefined });
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, { key: "b", text: "b", selected: true });
            }
            expect(mockCallBack)
                .toBeCalledWith(["b"]);
        });
        it("should call onDateChange with another option", () => {
            tree.setState({ experimentSelectedItems: ["a", "b"] });
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, { key: "c", text: "c", selected: true });
            }
            expect(mockCallBack)
                .toBeCalledWith(["a", "b", "c"]);
        });
        it("should call onDateChange with unselect previous option", () => {
            tree.setState({ experimentSelectedItems: ["a", "b"] });
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, { key: "a", text: "a", selected: false });
            }
            expect(mockCallBack)
                .toBeCalledWith(["b"]);
        });
    });

    describe("Validate Render Title", () => {
        it("should call onRenderTitle with select all option", () => {
            tree.setState({ experimentSelectedItems: ["a", "b", "c", "d", "e"], isAllSelect: true });
            if (dropdownProps && dropdownProps.onRenderTitle) {
                dropdownProps.onRenderTitle();
            }
            expect(tree)
                .toMatchSnapshot();
        });
        it("should call onRenderTitle with select one option", () => {
            tree.setState({ experimentSelectedItems: ["a"], isAllSelect: false });
            if (dropdownProps && dropdownProps.onRenderTitle) {
                dropdownProps.onRenderTitle();
            }
            expect(tree)
                .toMatchSnapshot();
        });
        it("should call onRenderTitle with select two options", () => {
            tree.setState({ experimentSelectedItems: ["a", "b"], isAllSelect: false });
            if (dropdownProps && dropdownProps.onRenderTitle) {
                dropdownProps.onRenderTitle();
            }
            expect(tree)
                .toMatchSnapshot();
        });
    });

    describe("Validate Toggle", () => {
        let toggleProps: IToggleProps;
        beforeEach(() => {
            const toggleWrapper = () => {
                let toggleOptionElement;
                if (dropdownProps && dropdownProps.onRenderOption) {
                    toggleOptionElement = dropdownProps.onRenderOption({ key: "AA", text: "AA", index: 0 });
                }
                return <div>{toggleOptionElement}</div>;
            };
            const toggleTree = shallow(React.createElement(toggleWrapper));
            toggleProps = toggleTree && toggleTree.find(Toggle)
                .props();
        });

        it("should render toggle true option", () => {
            if (toggleProps && toggleProps.onChange) {
                toggleProps.onChange(reactMouseEvent, true);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });
        it("should render toggle false option", () => {
            if (toggleProps && toggleProps.onChange) {
                toggleProps.onChange(reactMouseEvent, false);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });
    });
});
