import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { FormDropdown } from "../../components/Form/FormDropdown";
import { ComputeType, getComputeResources } from "./__data__/ComputeResourcesGenerator";
import { ComputeSelector } from "./ComputeSelector";

describe("Compute Selector", () => {
    const computeTypes: ComputeType[] = ["Compute", "AKS", "AmlCompute", "VirtualMachine", "HDInsight", "DataFactory", "Databricks", "DataLakeAnalytics"];
    const provisioningStates: Array<AzureMachineLearningWorkspacesModels.ProvisioningState | undefined> = ["Unknown", "Updating", "Creating", "Deleting", "Succeeded", "Failed", "Canceled", undefined];
    let onEditClickMock: jest.Mock;
    beforeAll(() => {
        onEditClickMock = jest.fn();
    });

    describe.each(computeTypes)("For compute type: '%s'", (testComputeType) => {
        describe.each(provisioningStates)("With provisioningState: '%s'", (prov) => {
            let tree: ShallowWrapper;

            const computes = getComputeResources(testComputeType, prov);
            beforeAll(() => {
                tree = shallow(
                    <ComputeSelector
                        computes={computes}
                        selectedComputeId={computes[0].id}
                        readonly={true}
                        onEditClick={onEditClickMock}
                        refreshing={false}
                    />);
            });

            it("should render", () => {
                expect(tree)
                    .toMatchSnapshot();
            });

            it("Add a new compute and it should get selected in the dropdown", async () => {
                const newCompute = {
                    name: "NewCompute1", id: "NewComputeId1", properties: {
                        computeType: "AmlCompute", provisioningState: "Succeeded",
                        properties: { scaleSettings: { maxNodeCount: 2, minNodeCount: 0 } }
                    }
                };
                tree.setProps({ computes: [...computes, newCompute], selectedComputeId: newCompute.id });
                expect(tree)
                    .toMatchSnapshot();
            });

            it("on click should invoke onEditClickMock()", () => {
                const onDropDownClick = tree.find(FormDropdown)
                    .prop("onClick");
                if (onDropDownClick) {
                    onDropDownClick(reactMouseEvent);
                }
                expect(onEditClickMock)
                    .toBeCalledTimes(1);
            });
        });
    });

    it("editable", () => {
        const tree = shallow(
            <ComputeSelector
                computes={[]}
                selectedComputeId={undefined}
                readonly={false}
                onEditClick={onEditClickMock}
                refreshing={false}
            />);
        expect(tree.find(FormDropdown)
            .props())
            .toEqual(expect.objectContaining({
                buttonIconProps: {
                    iconName: "ChevronDown"
                }
            }));
    });

    it("refreshing", () => {
        const tree = shallow(
            <ComputeSelector
                computes={[]}
                selectedComputeId={undefined}
                readonly={false}
                onEditClick={onEditClickMock}
                refreshing={true}
            />);
        expect(tree.find(FormDropdown)
            .props())
            .toEqual(expect.objectContaining({
                buttonIconProps: {
                    iconName: "ProgressRingDots"
                }
            }));
    });

    describe("For empty options", () => {
        let tree: ShallowWrapper;
        beforeAll(() => {
            tree = shallow(
                <ComputeSelector
                    computes={[]}
                    selectedComputeId={undefined}
                    readonly={true}
                    onEditClick={onEditClickMock}
                    refreshing={false}
                />);
        });

        it("should render", () => {
            expect(tree)
                .toMatchSnapshot();
        });

        it("Add a new compute and it should get selected in the dropdown", async () => {
            const newCompute = {
                name: "NewCompute1", id: "NewComputeId1", properties: {
                    computeType: "AmlCompute", provisioningState: "Succeeded",
                    properties: { scaleSettings: { maxNodeCount: 2, minNodeCount: 0 } }
                }
            };
            tree.setProps({ computes: [newCompute], selectedComputeId: newCompute.id });
            expect(tree)
                .toMatchSnapshot();
        });

        it("Add a new notebook VM compute and it should not be added to dropdown", async () => {
            const newCompute = {
                name: "NewNBVMCompute1", id: "NewNBVMComputeId1", properties: {
                    computeType: "VirtualMachine", provisioningState: "Succeeded",
                    properties: { isNotebookInstanceCompute: true }
                }
            };
            tree.setProps({ computes: [newCompute] });
            expect(tree)
                .toMatchSnapshot();
        });

        it("on click should invoke onEditClickMock()", () => {
            const onDropDownClick = tree.find(FormDropdown)
                .prop("onClick");
            if (onDropDownClick) {
                onDropDownClick(reactMouseEvent);
            }
            expect(onEditClickMock)
                .toBeCalledTimes(1);
        });
    });
});
