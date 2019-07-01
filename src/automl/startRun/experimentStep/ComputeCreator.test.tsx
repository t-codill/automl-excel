import { shallow, ShallowWrapper } from "enzyme";
import { Dictionary } from "lodash";
import { DefaultButton } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../../common/context/__data__/testContext";
import { Form } from "../../components/Form/Form";
import { FormDataType } from "../../components/Form/FormDataType";
import { PopupProgressIndicator } from "../../components/Progress/PopupProgressIndicator";
import { WorkSpaceService } from "../../services/WorkSpaceService";
import { ComputeCreator, IComputeCreatorProps, IComputeCreatorState } from "./ComputeCreator";
import { ICreateComputeParams } from "./ICreateComputeParams";

jest.mock("../../services/WorkSpaceService");

describe("ComputeCreator", () => {
    let root: ShallowWrapper<IComputeCreatorProps, IComputeCreatorState, ComputeCreator>;
    let onCancel: jest.Mock;
    let onComputeCreated: jest.Mock;
    let createComputeSpy: jest.SpyInstance<ReturnType<WorkSpaceService["createCompute"]>>;
    beforeEach(() => {
        onCancel = jest.fn();
        onComputeCreated = jest.fn();
        createComputeSpy = jest.spyOn(WorkSpaceService.prototype, "createCompute");
        root = shallow(<ComputeCreator
            onCancel={onCancel}
            onComputeCreated={onComputeCreated}
            vmSizes={{
                amlCompute: []
            }}
        />);
    });
    it("should render", () => {
        expect(root)
            .toMatchSnapshot();
    });
    it("should show loading icon", () => {
        root.setState({ creating: true });
        expect(root.exists(PopupProgressIndicator))
            .toBe(true);
    });
    it("should cancel", () => {
        root.find(DefaultButton)
            .simulate("click");
        expect(onCancel)
            .toBeCalled();
    });
    it("should cancel", () => {
        root.find(DefaultButton)
            .simulate("click");
        expect(onCancel)
            .toBeCalled();
    });
    describe("onFormUpdated", () => {
        let onFormUpdated: (key: keyof ICreateComputeParams, value: ICreateComputeParams[keyof ICreateComputeParams]) => void;
        beforeEach(() => {
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onUpdated) {
                onFormUpdated = formProps.onUpdated;
            }
        });
        it("should update minNodeCount", () => {
            onFormUpdated("minNodeCount", "12");
            expect(root.state("minNodeCount"))
                .toBe("12");
        });
        it("should not update without value", () => {
            onFormUpdated("minNodeCount", "");
            expect(root.state("minNodeCount"))
                .toBe("0");
        });
        it("should not update for other props", () => {
            onFormUpdated("maxNodeCount", "12");
            expect(root.state("minNodeCount"))
                .toBe("0");
        });
    });

    describe("create", () => {
        let onSubmit: (data: ICreateComputeParams & Dictionary<FormDataType>) => void;
        let logSpy: jest.SpyInstance;
        beforeEach(() => {
            const formProps = root
                .find(Form)
                .props();
            if (formProps.onSubmit) {
                onSubmit = formProps.onSubmit;
            }
            logSpy = getLogCustomEventSpy();
        });
        it("should not submit if data missing", async () => {
            onSubmit({
                maxNodeCount: "",
                minNodeCount: "",
                name: "",
                vmSize: ""
            });
            expect(root.state("creating"))
                .toBe(false);
            await Promise.resolve();
            expect(createComputeSpy)
                .not
                .toBeCalled();
        });
        it("should creat", async () => {
            const data = {
                maxNodeCount: "2",
                minNodeCount: "1",
                name: "test",
                vmSize: "testSize"
            };
            onSubmit(data);
            expect(root.state("creating"))
                .toBe(true);
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith("_CreateCompute_UserAction", testContext, expect.objectContaining({ component: "CreateCompute", data: JSON.stringify(data) }));
            expect(createComputeSpy)
                .toBeCalledWith(data.name,
                    data.vmSize,
                    parseInt(data.minNodeCount, 10),
                    parseInt(data.maxNodeCount, 10));
            expect(root.state("creating"))
                .toBe(false);
            expect(onComputeCreated)
                .toBeCalled();
        });
        it("should not callback if create compute return undefined", async () => {
            createComputeSpy.mockReturnValueOnce(Promise.resolve(undefined));
            const data = {
                maxNodeCount: "2",
                minNodeCount: "1",
                name: "test",
                vmSize: "testSize"
            };
            onSubmit(data);
            expect(root.state("creating"))
                .toBe(true);
            await Promise.resolve();
            expect(onComputeCreated)
                .not
                .toBeCalled();
        });
    });
});
