import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { MaxNodeInput } from "./MaxNodeInput";

describe("MaxNodeInput", () => {
    it("should render", () => {
        const wrapper = shallow(<MaxNodeInput minNodeCount={"3"} />);
        expect(wrapper)
            .toMatchSnapshot();
    });

    it("should validate", () => {
        const tree = shallow(
            <MaxNodeInput minNodeCount={"3"} />
        );
        expect(validate(
            "4",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });

    it("should error for smaller than min node", () => {
        const tree = shallow(
            <MaxNodeInput minNodeCount={"3"} />
        );
        expect(validate(
            "2",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe("Max Node must be greater than or equal to min node");
    });

    it("should not trigger validate if min node is not provided", () => {
        const tree = shallow(
            <MaxNodeInput minNodeCount={undefined} />
        );
        expect(validate(
            "0",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });
});
