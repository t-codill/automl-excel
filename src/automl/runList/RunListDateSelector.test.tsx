import { shallow, ShallowWrapper } from "enzyme";
import { Dropdown, IDropdownProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../__data__/reactFormEvent";
import { dateFilterDropdownOptions, RunListDateSelector } from "./RunListDateSelector";

describe("RunListDateSelector", () => {
    let tree: ShallowWrapper;
    let dropdownProps: IDropdownProps;
    const mockCallBack = jest.fn();
    const props = {
        onDateChange: mockCallBack
    };
    beforeEach(() => {
        tree = shallow(
            <RunListDateSelector
                {...props}
            />
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
        it("should not call onDateChange with same option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, dateFilterDropdownOptions.ALL);
            }
            expect(mockCallBack)
                .toBeCalledTimes(0);
        });
    });
    describe("Validate Dropdown Options", () => {
        it("should call onDateChange with 30 days option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, dateFilterDropdownOptions.THIRTYDAYS);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });

        it("should call onDateChange with 60 days option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, dateFilterDropdownOptions.SIXTYDAYS);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });

        it("should call onDateChange with 90 days option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, dateFilterDropdownOptions.NINTYDAYS);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });

        // it("should call onDateChange with customize option", () => {
        //     if (dropdownProps && dropdownProps.onChange) {
        //         dropdownProps.onChange(reactFormEvent, dateFilterDropdownOptions.CUSTOMIZE);
        //     }
        //     expect(mockCallBack)
        //         .toBeCalledTimes(0);
        // });

        it("should call onDateChange with default option", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, { key: "test", text: "test" });
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });
    });
});
