import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { MaxIterationInput } from "./MaxIterationInput";

describe("MaxIterationInput", () => {
    it("should render", () => {
        const tree = shallow(
            <MaxIterationInput />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should validate", () => {
        const tree = shallow(
            <MaxIterationInput />
        );
        expect(validate(
            "1",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });

    it("should error for 0", () => {
        const tree = shallow(
            <MaxIterationInput />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Max number of iterations should be greater than or equal to 1");
    });

    it("should error for anything larger than 1000", () => {
        const tree = shallow(
            <MaxIterationInput />
        );
        expect(validate(
            "1001",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Max number of iterations cannot exceed 1000");
    });
});
