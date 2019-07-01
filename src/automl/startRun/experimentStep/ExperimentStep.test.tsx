import { shallow, ShallowWrapper } from "enzyme";
import { DefaultButton, Dialog, Link, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { Form } from "../../components/Form/Form";
import { RunHistoryService } from "../../services/RunHistoryService";
import { WorkSpaceService } from "../../services/WorkSpaceService";
import { ComputeCreator, IComputeCreatorProps } from "./ComputeCreator";
import { ComputeSelector } from "./ComputeSelector";
import { ExperimentStep, IExperimentStepProps, IExperimentStepState } from "./ExperimentStep";

jest.mock("../../services/WorkSpaceService");
jest.mock("../../services/RunHistoryService");
describe("ExperimentStep", () => {
    let tree: ShallowWrapper<IExperimentStepProps, IExperimentStepState, ExperimentStep>;
    let listComputesSpy: jest.SpyInstance<ReturnType<WorkSpaceService["listComputes"]>>;
    let listVmSizesSpy: jest.SpyInstance<ReturnType<WorkSpaceService["listVmSizes"]>>;
    let listExperimentsSpy: jest.SpyInstance<ReturnType<RunHistoryService["listExperiments"]>>;
    let onNext: jest.Mock;
    let onCancel: jest.Mock;
    beforeEach(async () => {
        onNext = jest.fn();
        onCancel = jest.fn();
        tree = shallow(
            <ExperimentStep
                readOnly={false}
                onEditClick={jest.fn()}
                experimentName={undefined}
                compute={undefined}
                onNext={onNext}
                onCancel={onCancel}
            />);
        await Promise.resolve();
        listComputesSpy = jest.spyOn(WorkSpaceService.prototype, "listComputes");
        listVmSizesSpy = jest.spyOn(WorkSpaceService.prototype, "listVmSizes");
        listExperimentsSpy = jest.spyOn(RunHistoryService.prototype, "listExperiments");
    });
    it("should render", () => {
        expect(tree)
            .toMatchSnapshot();
    });
    it("should pass compute id", () => {
        const root = shallow(
            <ExperimentStep
                readOnly={false}
                onEditClick={jest.fn()}
                experimentName={undefined}
                compute={{
                    id: "computeId"
                }}
                onNext={jest.fn()}
                onCancel={jest.fn()}
            />);
        expect(root.find(ComputeSelector)
            .prop("selectedComputeId"))
            .toBe("computeId");
    });
    it("should show create compute", () => {
        const links = tree.find(Link);
        links
            .filterWhere((l) => {
                return l.prop("id") === "linkCreateCompute";
            })
            .simulate("click");
        expect(tree.state("showComputeCreator"))
            .toBe(true);
    });
    it("should refresh compute", async () => {
        const links = tree.find(Link);
        links
            .filterWhere((l) => {
                return l.prop("id") === "linkRefreshCompute";
            })
            .simulate("click");
        await Promise.resolve();
        expect(listComputesSpy)
            .toBeCalled();
    });

    describe("create compute", () => {
        let propsCreator: IComputeCreatorProps;
        beforeEach(() => {
            tree.setState({ showComputeCreator: true });
            propsCreator = tree.find(ComputeCreator)
                .props();
        });
        it("should show compute create", () => {
            expect(tree.find(ComputeCreator).length)
                .toBe(1);
        });
        it("should call onComputeCreated ", () => {
            const newCompute = {
                id: "newComputeId"
            };
            propsCreator.onComputeCreated(newCompute);
            expect(tree.state())
                .toEqual(expect.objectContaining({
                    showComputeCreator: false,
                    selectedCompute: newCompute
                }));
        });
        it("should call onComputeCreateCancel ", () => {
            propsCreator.onCancel();
            expect(tree.state())
                .toEqual(expect.objectContaining({
                    showComputeCreator: false
                }));
        });
    });

    it("should get experiment name", async () => {
        expect(tree.state("experimentNames"))
            .toEqual(["Experiment Name 1", "Experiment Name 2", ""]);
    });

    it("should still refreshing experiment name", async () => {
        listExperimentsSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const refreshingTree = shallow<ExperimentStep>(
            <ExperimentStep
                readOnly={false}
                onEditClick={jest.fn()}
                experimentName={undefined}
                compute={undefined}
                onNext={jest.fn()}
                onCancel={jest.fn()}
            />);
        await Promise.resolve();
        expect(refreshingTree.state("experimentNames"))
            .toBeUndefined();
    });

    it("should get computes", async () => {
        expect(tree.state())
            .toEqual(expect.objectContaining({
                computeRefreshing: false,
                computes: [{
                    id: "Test_ID",
                    location: "eastus",
                    name: "Test_Compute",
                }]
            }));
    });

    it("should still refreshing computes", async () => {
        listComputesSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const refreshingTree = shallow<ExperimentStep>(
            <ExperimentStep
                readOnly={false}
                onEditClick={jest.fn()}
                experimentName={undefined}
                compute={undefined}
                onNext={jest.fn()}
                onCancel={jest.fn()}
            />);
        await Promise.resolve();
        expect(refreshingTree.state("computes"))
            .toBeUndefined();
        expect(refreshingTree.state("computeRefreshing"))
            .toBe(true);
    });

    it("should get vm sizes", async () => {
        expect(tree.state("vmSizes"))
            .toEqual({
                0: {
                    family: "standardDSv2Family",
                    lowPriorityCapable: true,
                    maxResourceVolumeMB: 7168,
                    memoryGB: 3.5,
                    name: "Standard_DS1_v2",
                    osVhdSizeMB: 1047552,
                    premiumIO: true,
                    vCPUs: 1,
                },
                amlCompute: [
                    {
                        family: "standardDSv2Family",
                        lowPriorityCapable: true,
                        maxResourceVolumeMB: 7168,
                        memoryGB: 3.5,
                        name: "Standard_DS1_v2",
                        osVhdSizeMB: 1047552,
                        premiumIO: true,
                        vCPUs: 1,
                    },
                ],
            });
    });

    it("should still refreshing vm sizes", async () => {
        listVmSizesSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const refreshingTree = shallow<ExperimentStep>(
            <ExperimentStep
                readOnly={false}
                onEditClick={jest.fn()}
                experimentName={undefined}
                compute={undefined}
                onNext={jest.fn()}
                onCancel={jest.fn()}
            />);
        await Promise.resolve();
        expect(refreshingTree.state("vmSizes"))
            .toBeUndefined();
    });

    it("should submit", async () => {
        const value = {
            computeId: "Test_ID",
            experimentName: "testName"
        };
        const onSubmit = tree.find(Form)
            .prop("onSubmit");
        onSubmit(value);
        expect(onNext)
            .toBeCalledWith("testName", expect.objectContaining({ id: "Test_ID" }));
    });

    it("should not submit without compute id", async () => {
        const value = {
            computeId: undefined,
            experimentName: "testName"
        };
        const onSubmit = tree.find(Form)
            .prop("onSubmit");
        onSubmit(value);
        expect(onNext)
            .not
            .toBeCalled();
    });

    describe("cancel", () => {
        beforeEach(() => {
            tree.find(DefaultButton)
                .filterWhere((b) => b.prop("text") === "Cancel")
                .simulate("click");
        });
        it("should show cancel dialog", () => {
            expect(tree.state("showCancelDialog"))
                .toBe(true);
            expect(tree.find(Dialog).length)
                .toBe(1);
        });
        it("should cancel when click yes", () => {
            tree.find(PrimaryButton)
                .filterWhere((b) => b.prop("text") === "Yes")
                .simulate("click");
            expect(onCancel)
                .toBeCalled();
            expect(tree.state("showCancelDialog"))
                .toBe(false);
        });
        it("should not cancel when click no", () => {
            tree.find(DefaultButton)
                .filterWhere((b) => b.prop("text") === "No")
                .simulate("click");
            expect(onCancel)
                .not
                .toBeCalled();
            expect(tree.state("showCancelDialog"))
                .toBe(false);
        });
    });
});
