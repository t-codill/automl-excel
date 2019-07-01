import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { ConcurrentIterations } from "./ConcurrentIterations";

describe("Concurrent Iterations", () => {
    it("should render with validation error undefined props", () => {
        const tree = shallow(
            <ConcurrentIterations compute={undefined} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with valid props", () => {
        const tree = shallow(
            <ConcurrentIterations compute={{ computeType: "VirtualMachine" }} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with valid aml compute", () => {
        const tree = shallow(
            <ConcurrentIterations compute={{
                computeType: "AmlCompute", properties: {
                    scaleSettings: {
                        maxNodeCount: 6,
                        minNodeCount: 0
                    }
                }
            }} />
        );
        expect(tree
            .find(FormTextInput)
            .prop("defaultFormValue")
        )
            .toBe("6");
    });
});
