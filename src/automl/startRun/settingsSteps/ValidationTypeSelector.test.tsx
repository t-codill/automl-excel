import { shallow, ShallowWrapper } from "enzyme";
import { Dropdown, IDropdownProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { ValidationType } from "../../services/constants/ValidationType";
import { IValidationTypeSelectorProps, validationTypeOptions, ValidationTypeSelector } from "./ValidationTypeSelector";

describe("ValidationTypeSelector", () => {
    let tree: ShallowWrapper<IValidationTypeSelectorProps>;
    let dropdownProps: IDropdownProps;
    const mockCallBack = jest.fn();
    const props: IValidationTypeSelectorProps = {
        validationType: ValidationType.crossValidation,
        jobType: "classification",
        onChange: mockCallBack
    };
    beforeEach(() => {
        tree = shallow(
            <ValidationTypeSelector {...props} />
        );
        dropdownProps = tree.find(Dropdown)
            .props();
        mockCallBack.mockClear();
    });
    describe("Initial Render", () => {
        it("should render date selector dropdown", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should render forecasting", () => {
            tree.setProps({ jobType: "forecasting" });
            expect(tree)
                .toMatchSnapshot();
        });
        it("should render regression", () => {
            tree.setProps({ jobType: "regression" });
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
    });
    describe("Validate Dropdown Options", () => {
        it("should call onDateChange with cross validation", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, validationTypeOptions.CrossValidation);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });

        it("should call onDateChange with monte carlo", () => {
            if (dropdownProps && dropdownProps.onChange) {
                dropdownProps.onChange(reactFormEvent, validationTypeOptions.MonteCarlo);
            }
            expect(mockCallBack)
                .toBeCalledTimes(1);
        });

    });
});
