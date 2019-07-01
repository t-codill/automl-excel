import { shallow } from "enzyme";
import * as React from "react";
import { MaxCores } from "./MaxCores";

describe("Max Cores", () => {
    it("should render ", () => {
        const tree = shallow(
            <MaxCores />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
