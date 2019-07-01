import { shallow } from "enzyme";
import * as React from "react";
import { PageLoadingSpinner } from "./PageLoadingSpinner";

describe("PageLoadingSpinner", () => {
    it("should render", () => {
        const wrapper = shallow(<PageLoadingSpinner />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with label", () => {
        const wrapper = shallow(<PageLoadingSpinner label={"label1"} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
