import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { validate } from "../../components/Form/validate";
import { IValidator } from "../../components/Form/Validators";
import { ITimeSeriesColumnSelectorProps, TimeSeriesColumnSelector } from "./TimeSeriesColumnSelector";

describe("TimeSeriesColumnSelector", () => {

    it("should render error message", () => {
        const tree = shallow(
            <TimeSeriesColumnSelector
                columns={["column1", "column2"]}
                selectedFeatures={new Set<string>(["column1", "column2"])}
                targetColumn={"column1"} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render", () => {
        const tree = shallow(
            <TimeSeriesColumnSelector
                columns={["column1", "column2"]}
                selectedFeatures={new Set<string>(["column1", "column2"])}
                targetColumn={"column3"} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    describe("should validate", () => {
        let tree: ShallowWrapper<ITimeSeriesColumnSelectorProps>;
        let validators: Array<IValidator<string | undefined>> | undefined;
        beforeEach(() => {
            tree = shallow(
                <TimeSeriesColumnSelector
                    targetColumn={"target"}
                    columns={["time", "item1", "item2", "item3", "item4", "item5"]}
                    selectedFeatures={new Set<string>(["time", "item1", "item2", "item3"])} />
            );
            validators = tree
                .find(FormDropdown)
                .prop("validators");
        });
        it("should validate target column", () => {
            expect(validate("item2", validators))
                .toBeUndefined();
        });
        it("should not contain target column", () => {
            expect(validate("target", validators))
                .toMatch(/not.*target/);
        });
        it("should not contain none feature column", () => {
            expect(validate("item4", validators))
                .toMatch(/item4.*has.*excluded/);
        });
        it("change prop should not error if tag picker ref is undefined", () => {
            tree.setProps({
                targetColumn: "item1"
            });
        });
        describe("change props will trigger validate", () => {
            let validateMock: jest.Mock;
            beforeEach(() => {
                validateMock = jest.fn();
                Object.defineProperty(tree.instance(), "dropdown", {
                    value: {
                        current: {
                            validate: validateMock
                        }
                    }
                });
            });
            it("trigger validate when target column changed", () => {
                tree.setProps({
                    targetColumn: "item1"
                });
                expect(validateMock)
                    .toBeCalled();
            });
            it("trigger validate when feature columns changed", () => {
                tree.setProps({
                    selectedFeatures: new Set<string>(["item1"])
                });
                expect(validateMock)
                    .toBeCalled();
            });
            it("should not trigger validate when no column changed", () => {
                tree.setProps({
                    selectedFeatures: new Set<string>(["time", "item1", "item2", "item3"])
                });
                expect(validateMock)
                    .not
                    .toBeCalled();
            });
        });
    });
});
