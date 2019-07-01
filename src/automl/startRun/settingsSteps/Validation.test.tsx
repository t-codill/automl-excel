import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ValidationType } from "../../services/constants/ValidationType";
import { IValidationProps, IValidationState, Validation } from "./Validation";
import { ValidationTypeSelector } from "./ValidationTypeSelector";

describe("Cross Validation Input", () => {
    let tree: ShallowWrapper<IValidationProps, IValidationState>;
    beforeAll(() => {
        tree = shallow(
            <Validation
                jobType="classification"
            />
        );
    });
    it("should render with valid props", () => {
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with valid props", () => {
        tree.find(ValidationTypeSelector)
            .props()
            .onChange(ValidationType.monteCarloValidation);
        expect(tree.state().validationType)
            .toBe(ValidationType.monteCarloValidation);
    });
});
