import { shallow } from "enzyme";
import * as React from "react";
import { CrossValidationNumberInput } from "./CrossValidationNumberInput";

describe("Cross Validation Number Input", () => {
    it("should render", () => {
        const tree = shallow(
            <CrossValidationNumberInput />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
