import { shallow } from "enzyme";
import * as React from "react";
import { FormCheckBox } from "../../components/Form/FormCheckBox";
import { IPreprocessingProps, Preprocessing } from "./Preprocessing";

describe("Preprocessing", () => {

    it("should render with classification", () => {
        const numProps: IPreprocessingProps = {
            jobType: "classification"
        };
        const tree = shallow(
            <Preprocessing {...numProps} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should disabled for forecasting", () => {
        const numProps: IPreprocessingProps = {
            jobType: "forecasting"
        };
        const tree = shallow(
            <Preprocessing {...numProps} />
        );
        expect(tree
            .find(FormCheckBox)
            .props()
            .disabled
        )
            .toBe(true);
    });
});
