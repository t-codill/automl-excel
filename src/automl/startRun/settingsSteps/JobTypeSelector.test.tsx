import { shallow } from "enzyme";
import * as React from "react";
import { IJobTypeSelectorProps, JobTypeSelector } from "./JobTypeSelector";

describe("JobTypeSelector", () => {

    it("should render with undefined props", () => {
        const undefinedProps: IJobTypeSelectorProps = {
            jobType: undefined
        };
        const tree = shallow(
            <JobTypeSelector {...undefinedProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with classification types", () => {
        const classification: IJobTypeSelectorProps = {
            jobType: "classification"
        };
        const tree = shallow(
            <JobTypeSelector {...classification} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with regression types", () => {
        const regression: IJobTypeSelectorProps = {
            jobType: "regression"
        };
        const tree = shallow(
            <JobTypeSelector {...regression} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

});
