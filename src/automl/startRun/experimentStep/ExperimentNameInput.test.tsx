import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { FormComboBox } from "../../components/Form/FormComboBox";
import { ExperimentNameInput } from "./ExperimentNameInput";

describe("ExperimentNameInput", () => {
    const onEditClickMock = jest.fn();
    let wrapper: ShallowWrapper;

    describe("With options", () => {
        beforeEach(() => {
            wrapper = shallow(
                <ExperimentNameInput
                    experimentName="ExperimentName"
                    readonly={false}
                    onEditClick={onEditClickMock}
                    experimentNames={["text1, text2"]}
                />
            );
        });

        it("should render", () => {
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should invoke onEditClickMock() when clicked", () => {
            const dropdownOnClick = wrapper.find(FormComboBox)
                .prop("onClick");
            if (dropdownOnClick) {
                dropdownOnClick(reactMouseEvent);
            }
            expect(onEditClickMock)
                .toBeCalledTimes(1);
        });
    });

    describe("Without options", () => {
        it("should render", () => {
            wrapper = shallow(
                <ExperimentNameInput
                    experimentName="ExperimentName"
                    readonly={false}
                    onEditClick={onEditClickMock}
                    experimentNames={undefined}
                />
            );
            expect(wrapper)
                .toMatchSnapshot();
        });
    });

    describe("readonly", () => {
        it("should render", () => {
            wrapper = shallow(
                <ExperimentNameInput
                    experimentName="ExperimentName"
                    readonly={true}
                    onEditClick={onEditClickMock}
                    experimentNames={undefined}
                />
            );
            expect(wrapper.find(FormComboBox)
                .props())
                .toEqual(expect.objectContaining({
                    buttonIconProps: {
                        iconName: "Edit"
                    }
                }));
        });
    });
});
