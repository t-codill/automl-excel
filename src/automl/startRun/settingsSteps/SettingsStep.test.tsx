import { shallow, ShallowWrapper } from "enzyme";
import { DefaultButton, IButtonProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { Form, IFormProps } from "../../components/Form/Form";
import { GrainColumnSelector } from "./GrainColumnSelector";
import { ISettingsStepParams } from "./ISettingsStepParams";
import { ISettingsStepProps, ISettingsStepState, SettingsStep } from "./SettingsStep";
import { TimeSeriesColumnSelector } from "./TimeSeriesColumnSelector";

describe("SettingsStep", () => {
    describe("Invalid Props", () => {
        it("should render with undefined props", () => {
            const undefinedProps: ISettingsStepProps = {
                blobHeader: [],
                selectedFeatures: new Set<string>(),
                compute: undefined,
                dataStoreName: undefined,
                onCancel: jest.fn(),
                onStart: jest.fn()
            };
            const tree = shallow(
                <SettingsStep {...undefinedProps} />
            );
            expect(tree)
                .toMatchSnapshot();
        });
    });
    describe("Valid Props", () => {
        let tree: ShallowWrapper<ISettingsStepProps, ISettingsStepState>;
        const mockOnCancel = jest.fn();
        const mockOnStart = jest.fn();
        const validProps: ISettingsStepProps = {
            blobHeader: ["A", "B", "C"],
            selectedFeatures: new Set<string>(["A", "B", "C"]),
            compute: {
                computeType: "AmlCompute"
            },
            dataStoreName: "ABCD",
            onCancel: mockOnCancel,
            onStart: mockOnStart
        };
        let cancelButtonProps: IButtonProps;
        let formProps: IFormProps<ISettingsStepParams>;
        beforeEach(() => {
            tree = shallow(
                <SettingsStep {...validProps} />
            );
            cancelButtonProps = tree.find(DefaultButton)
                .props();
            formProps = tree.find<IFormProps<ISettingsStepParams>>(Form)
                .props();
        });
        it("should render with valid props", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should trigger cancel with click cancelButton", () => {
            if (cancelButtonProps && cancelButtonProps.onClick) {
                cancelButtonProps.onClick(reactMouseEvent);
            }
            expect(mockOnCancel)
                .toBeCalledTimes(1);
        });
        it("should trigger submit with form submit", () => {
            const settings = {
                jobType: undefined,
                column: undefined,
                metric: undefined,
                trainingJobTime: undefined,
                maxIteration: undefined,
                metricThreshold: undefined,
                maxConcurrentIterations: undefined,
                maxCores: undefined,
                preprocessing: undefined,
                blacklistAlgos: [],
                crossValidationNumber: undefined,
                percentageValidation: undefined,
                timeSeriesColumn: undefined,
                maxHorizon: undefined,
                grainColumns: []
            };

            if (formProps && formProps.onSubmit) {
                formProps.onSubmit(settings);
            }
            expect(mockOnStart)
                .toBeCalledWith(settings);
        });

        describe("onFormUpdated", () => {
            let onFormUpdated: (key: keyof ISettingsStepParams, value: ISettingsStepParams[keyof ISettingsStepParams]) => void;
            beforeEach(() => {
                if (formProps && formProps.onUpdated) {
                    onFormUpdated = formProps.onUpdated;
                }
            });
            it("should not error without props", () => {
                onFormUpdated("metric", undefined);
                expect(tree.state("primaryMetric"))
                    .toBe("accuracy");
            });
            it("should update metric", () => {
                onFormUpdated("metric", "abcd");
                expect(tree.state("primaryMetric"))
                    .toBe("abcd");
            });
            it("should not update metric if metric stays same", () => {
                onFormUpdated("metric", "accuracy");
                expect(tree.state("primaryMetric"))
                    .toBe("accuracy");
            });
            it("should update column", () => {
                onFormUpdated("column", "abcd");
                expect(tree.state("column"))
                    .toBe("abcd");
            });
            it("should update timeSeriesColumn ", () => {
                onFormUpdated("timeSeriesColumn", "abcd");
                expect(tree.state("timeSeriesColumn"))
                    .toBe("abcd");
            });
            it("should update jobType", () => {
                onFormUpdated("jobType", "forecasting");
                expect(tree.state("jobType"))
                    .toBe("forecasting");
                expect(
                    tree
                        .find(TimeSeriesColumnSelector)
                        .length)
                    .toBe(1);
                expect(
                    tree
                        .find(GrainColumnSelector)
                        .length)
                    .toBe(1);
            });
            it("should not update for others", () => {
                onFormUpdated("trainingJobTime", "12");
                expect(tree.state("primaryMetric"))
                    .toBe("accuracy");
            });
        });
    });
});
