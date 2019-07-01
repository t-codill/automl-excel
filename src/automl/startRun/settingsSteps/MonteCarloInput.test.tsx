import { shallow } from "enzyme";
import * as React from "react";
import { MonteCarloInput } from "./MonteCarloInput";

describe("Cross Validation Input", () => {
    it("should render with validation error undefined props", () => {
        const c = {
            percentageValidation: 0,
            crossValidationNumber: 0
        };
        const tree = shallow(
            <MonteCarloInput {...c} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with valid props", () => {
        const c = {
            percentageValidation: 5,
            crossValidationNumber: 20
        };
        const tree = shallow(
            <MonteCarloInput {...c} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
