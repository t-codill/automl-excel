import { shallow, ShallowWrapper } from "enzyme";
import { DefaultButton, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { ConfirmationDialog } from "./ConfirmationDialog";

describe("ConfirmationDialog", () => {

    const onConfirm = jest.fn();
    const onClose = jest.fn();
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(<ConfirmationDialog
            title="Test Title"
            subText="Test SubText"
            hidden={false}
            onConfirm={onConfirm}
            onClose={onClose}
        />);
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should trigger onConfirm", () => {
        const onYesClick = wrapper.find(PrimaryButton)
            .prop("onClick");

        if (onYesClick) {
            onYesClick(reactMouseEvent);
        }
        expect(onConfirm)
            .toBeCalledTimes(1);
    });

    it("should trigger onConfirm", () => {
        const onNoClick = wrapper.find(DefaultButton)
            .prop("onClick");

        if (onNoClick) {
            onNoClick(reactMouseEvent);
        }
        expect(onClose)
            .toBeCalledTimes(1);
    });
});
