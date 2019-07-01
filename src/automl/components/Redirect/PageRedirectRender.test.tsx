import { shallow } from "enzyme";
import * as React from "react";
import { PageRedirectRender } from "./PageRedirectRender";

describe("PageRedirectRender", () => {
    it("should render component with noPush enabled", () => {
        const wrapper = shallow(<PageRedirectRender noPush={true} expendedRoutePath={"#"} />);
        expect(wrapper)
            .toMatchSnapshot();

    });
    it("should render component with noPush disabled", () => {
        const wrapper = shallow(<PageRedirectRender noPush={false} expendedRoutePath={"#"} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
