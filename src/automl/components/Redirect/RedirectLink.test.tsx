import { shallow } from "enzyme";
import { Link } from "office-ui-fabric-react";
import * as React from "react";
import { RedirectLink } from "./RedirectLink";

describe("RedirectLink", () => {
    it("should render component", () => {
        const wrapper = shallow(<RedirectLink to={"#"} />);
        expect(wrapper)
            .toMatchSnapshot();

    });

    describe("Link", () => {
        it("should render clicked", () => {
            const wrapper = shallow(<RedirectLink to={"#"} />);
            wrapper.find(Link)
                .simulate("click");
            expect(wrapper)
                .toMatchSnapshot();
        });
    });
});
