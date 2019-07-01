import { shallow } from "enzyme";
import * as React from "react";
import { PopupProgressIndicator } from "./PopupProgressIndicator";

describe("PopupProgressIndicator", () => {
    it("should render", () => {
        const wrapper = shallow(<PopupProgressIndicator />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with title", () => {
        const wrapper = shallow(<PopupProgressIndicator title="title1" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with loading title", () => {
        const wrapper = shallow(<PopupProgressIndicator title="loading..." />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with loading description", () => {
        const wrapper = shallow(<PopupProgressIndicator description="round and round we go" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should render with the whole nine yards", () => {
        const wrapper = shallow(<PopupProgressIndicator title="loading" description="round and round we go" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
