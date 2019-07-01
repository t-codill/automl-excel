import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { FormTagPicker } from "../../components/Form/FormTagPicker";
import { validate } from "../../components/Form/validate";
import { IValidator } from "../../components/Form/Validators";
import { GrainColumnSelector, IGrainColumnSelectorProps } from "./GrainColumnSelector";

describe("GrainColumnSelector", () => {
    it("should render", () => {
        const tree = shallow(
            <GrainColumnSelector
                timeSeriesColumn={undefined}
                targetColumn={undefined}
                columns={["item1", "item2", "item3"]}
                selectedFeatures={new Set<string>(["item1", "item2", "item3"])} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with empty list", () => {
        const tree = shallow(
            <GrainColumnSelector
                timeSeriesColumn={undefined}
                targetColumn={undefined}
                columns={[]}
                selectedFeatures={new Set<string>()} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    describe("should validate", () => {
        let tree: ShallowWrapper<IGrainColumnSelectorProps>;
        let validators: Array<IValidator<string[]>>;
        let tagPicker: ShallowWrapper;
        beforeEach(() => {
            tree = shallow(
                <GrainColumnSelector
                    timeSeriesColumn={"time"}
                    targetColumn={"target"}
                    columns={["time", "item1", "item2", "item3", "item4", "item5"]}
                    selectedFeatures={new Set<string>(["time", "item1", "item2", "item3"])} />
            );
            tagPicker = tree
                .find(FormTagPicker);
            validators = tagPicker
                .prop("validators");
        });
        it("should validate target column", () => {
            expect(validate([], validators))
                .toBeUndefined();
        });
        it("should not contain target column", () => {
            expect(validate(["target"], validators))
                .toMatch(/not.*target/);
        });
        it("should not contain time column", () => {
            expect(validate(["time"], validators))
                .toMatch(/not.*time/);
        });
        it("should not contain none feature column", () => {
            expect(validate(["item4"], validators))
                .toMatch(/item4.*has.*excluded/);
        });
        it("should use plural form", () => {
            expect(validate(["item4", "item5"], validators))
                .toMatch(/item4,item5.*have.*excluded/);
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
                Object.defineProperty(tree.instance(), "tagPicker", {
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
            it("trigger validate when time column changed", () => {
                tree.setProps({
                    timeSeriesColumn: "item1"
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
