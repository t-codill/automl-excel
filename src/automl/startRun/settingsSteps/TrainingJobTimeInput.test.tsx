import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { TrainingJobTimeInput } from "./TrainingJobTimeInput";

describe("TrainingJobTimeInput", () => {
    it("should render", () => {
        const tree = shallow(
            <TrainingJobTimeInput />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should error for too small number", () => {
        const tree = shallow(
            <TrainingJobTimeInput />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe(`Training job time should be greater than 0`);
    });
});
