import { shallow, ShallowWrapper } from "enzyme";
import { Callout, IconButton } from "office-ui-fabric-react";
import * as React from "react";
import { LabelWithCallout } from "./LabelWithCallout";

describe("LabelWithCallout", () => {
    let wrapper: ShallowWrapper;
    beforeEach(() => {
        wrapper = shallow(
            <LabelWithCallout required={true} htmlFor="dropdownId" labelText="Test Label" >
                <div>Test callout message</div>
            </LabelWithCallout>
        );
    });

    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });

    describe("after tooltip button clicked", () => {
        beforeEach(() => {
            wrapper.find(IconButton)
                .simulate("click");
        });
        it("should render callout", () => {
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should hide callout when tooltip button is clicked second time", () => {
            wrapper.find(IconButton)
                .simulate("click");
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should hide callout when onDismiss is triggered", () => {
            const onDismiss =
                wrapper.find(Callout)
                    .props().onDismiss;

            if (onDismiss) {
                onDismiss();
            }

            expect(wrapper)
                .toMatchSnapshot();
        });
    });

});
