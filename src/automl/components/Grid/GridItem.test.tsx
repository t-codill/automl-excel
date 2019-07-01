import { shallow } from "enzyme";
import * as React from "react";
import { GridItem } from "./GridItem";

describe("GridItem", () => {

    it("should render with no title set", () => {
        const wrapper = shallow(<GridItem title={"title"} />);
        expect(wrapper)
            .toMatchSnapshot();

    });
    it("should render with title set", () => {
        const wrapper = shallow(<GridItem />);
        expect(wrapper)
            .toMatchSnapshot();
    });

});
