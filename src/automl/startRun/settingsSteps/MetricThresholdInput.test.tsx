import { shallow } from "enzyme";
import * as React from "react";
import { FormTextInput } from "../../components/Form/FormTextInput";
import { validate } from "../../components/Form/validate";
import { MetricThresholdBounds } from "../../services/constants/MetricThresholdBounds";
import { MetricThresholdInput } from "./MetricThresholdInput";

describe("MetricThresholdInput", () => {

    it("should render", () => {
        const tree = shallow(
            <MetricThresholdInput primaryMetric={"accuracy"} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should validate", () => {
        const tree = shallow(
            <MetricThresholdInput primaryMetric={"accuracy"} />
        );
        expect(validate(
            "1",
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBeUndefined();
    });

    it("should error for too small number", () => {
        const tree = shallow(
            <MetricThresholdInput primaryMetric={"accuracy"} />
        );
        expect(validate(
            `${MetricThresholdBounds.accuracy[0] - 1}`,
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe(`Metric score threshold must not be less than ${MetricThresholdBounds.accuracy[0]}`);
    });

    it("should error for too large number", () => {
        const tree = shallow(
            <MetricThresholdInput primaryMetric={"accuracy"} />
        );
        expect(validate(
            `${MetricThresholdBounds.accuracy[1] + 1}`,
            tree
                .find(FormTextInput)
                .prop("validators")))
            .toBe(`Metric score threshold must not exceed ${MetricThresholdBounds.accuracy[1]}`);
    });
});
