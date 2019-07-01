import { shallow } from "enzyme";
import * as React from "react";
import { PageRedirectLinkRender } from "./PageRedirectLinkRender";

describe("PageRedirectLinkRender", () => {
    it("should render component", () => {
        const wrapper = shallow(<PageRedirectLinkRender expendedRoutePath={"#"} />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
