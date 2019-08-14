import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { CrossValidationNumberInput } from "./CrossValidationNumberInput";

describe("Cross Validation Number Input", () => {
    it("should render", () => {
        const wrapper = shallow(
            <CrossValidationNumberInput />
        );
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should error for anything less than 2", () => {
        const wrapper = shallow(
            <CrossValidationNumberInput />
        );
        expect(validate(
            "1",
            wrapper
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Number of Cross Validation should not be less than 2");
    });

    it("should error for anything larger than 1000", () => {
        const wrapper = shallow(
            <CrossValidationNumberInput />
        );
        expect(validate(
            "1001",
            wrapper
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Number of Cross Validation should not exceed 1000");
    });
});
