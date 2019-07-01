import { shallow, ShallowWrapper } from "enzyme";
import { DatePicker, IDatePickerProps } from "office-ui-fabric-react";
import * as React from "react";
import { RunListDatePicker } from "./RunListDatePicker";

describe("RunListDatePicker", () => {
    let tree: ShallowWrapper;
    const mockCallBack = jest.fn();
    const props = {
        onDateChange: mockCallBack
    };
    let datePickerProps: IDatePickerProps;

    beforeEach(() => {
        tree = shallow(
            <RunListDatePicker {...props} />
        );
        datePickerProps = tree.find(DatePicker)
            .props();
        mockCallBack.mockClear();
    });
    describe("Verify DatePicker", () => {
        it("should render date picker", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should not call onSelectDate with invalid select", () => {
            if (datePickerProps && datePickerProps.onSelectDate) {
                datePickerProps.onSelectDate(undefined);
            }
            expect(mockCallBack)
                .toBeCalledTimes(0);
        });
        it("should call onSelectDate with valid select", () => {
            if (datePickerProps && datePickerProps.onSelectDate) {
                datePickerProps.onSelectDate(new Date(2019, 1, 2, 3, 4, 5));
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });
    });
});
