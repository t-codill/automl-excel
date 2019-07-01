import { shallow } from "enzyme";
import * as React from "react";
import { ValidationError } from "./ValidationError";

describe("ValidationError", () => {
    it("should render", () => {
        const wrapper = shallow(<ValidationError text="some error" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
