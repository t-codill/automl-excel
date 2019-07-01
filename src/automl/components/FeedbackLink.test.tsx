import { shallow } from "enzyme";
import * as React from "react";
import { FeedbackLink } from "./FeedbackLink";

describe("Feedback Link", () => {

    it("should render link to send feedback", () => {
        const wrapper = shallow(<FeedbackLink />);
        expect(wrapper)
            .toMatchSnapshot();

    });

});
