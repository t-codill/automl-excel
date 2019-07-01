import { shallow } from "enzyme";
import * as React from "react";
import { NotFound } from "./NotFound";

describe("NotFound", () => {
    it("should render correctly", () => {
        const tree = shallow(
            <NotFound />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
