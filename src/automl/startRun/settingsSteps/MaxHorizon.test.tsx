import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { MaxHorizon } from "./MaxHorizon";

describe("MaxHorizon", () => {

    it("should render", () => {
        const tree = shallow(
            <MaxHorizon />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should validate", () => {
        const tree = shallow(
            <MaxHorizon />
        );
        expect(validate(
            "1",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });

    it("should error for invalid number", () => {
        const tree = shallow(
            <MaxHorizon />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Max horizon should be greater than or equal to 1");
    });
});
