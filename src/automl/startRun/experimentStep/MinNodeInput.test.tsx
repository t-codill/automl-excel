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

    it("should error for 0", () => {
        const tree = shallow(
            <MinNodeInput />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Min node has to be a positive number");
    });
});
