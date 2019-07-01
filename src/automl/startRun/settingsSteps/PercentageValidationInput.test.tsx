import { shallow } from "enzyme";
import * as React from "react";
import { PercentageValidationInput } from "./PercentageValidationInput";

describe("Percentage Validation Input", () => {
    it("should render", () => {
        const tree = shallow(
            <PercentageValidationInput />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
