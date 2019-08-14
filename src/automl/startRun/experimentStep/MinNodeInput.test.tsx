import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { MinNodeInput } from "./MinNodeInput";

describe("MinNodeInput", () => {
    it("should render", () => {
        const wrapper = shallow(<MinNodeInput />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should error for -1", () => {
        const tree = shallow(
            <MinNodeInput />
        );
        expect(validate(
            "-1",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Min node cannot be negative");
    });

    it("should accept 0", () => {
        const tree = shallow(
            <MinNodeInput />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });
});
