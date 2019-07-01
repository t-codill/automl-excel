import { shallow } from "enzyme";
import * as React from "react";
import { AdvancedSettings } from "./AdvancedSettings";

describe("AdvancedSettings", () => {
    it("should render", () => {
        const wrapper = shallow(<AdvancedSettings compute={{ computeType: "VirtualMachine" }} jobType="classification" primaryMetric="accuracy" />);
        expect(wrapper)
            .toMatchSnapshot();
    });
});
