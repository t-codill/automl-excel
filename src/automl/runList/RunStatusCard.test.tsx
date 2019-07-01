import { shallow, ShallowWrapper } from "enzyme";
import { FocusZone } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../__data__/reactMouseEvent";
import { RunStatusCard } from "./RunStatusCard";

describe("RunStatusCard", () => {
    let tree: ShallowWrapper;
    const mockCallBack = jest.fn();
    describe("Active Card", () => {
        beforeEach(() => {
            const props = {
                runStatusLabel: "Failed",
                runStatusCount: 123,
                isActive: true,
                handleStatusFilterChange: mockCallBack,
                className: ""
            };
            tree = shallow(
                <RunStatusCard {...props} />
            );
            mockCallBack.mockClear();
        });
        it("should render", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should deactivate filter", () => {
            const runStatusCardProps = tree.find(FocusZone)
                .props();
            if (runStatusCardProps && runStatusCardProps.onClick) {
                runStatusCardProps.onClick(reactMouseEvent);
            }
            expect(mockCallBack)
                .toBeCalledWith(undefined);
        });
    });
    describe("Inactive Card", () => {
        beforeEach(() => {
            const props = {
                runStatusLabel: "Failed",
                runStatusCount: 123,
                isActive: false,
                handleStatusFilterChange: mockCallBack,
                className: ""
            };
            tree = shallow(
                <RunStatusCard {...props} />
            );
            mockCallBack.mockClear();
        });
        it("should render", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should active filter", () => {
            const runStatusCardProps = tree.find(FocusZone)
                .props();
            if (runStatusCardProps && runStatusCardProps.onClick) {
                runStatusCardProps.onClick(reactMouseEvent);
            }
            expect(mockCallBack)
                .toBeCalledWith("Failed");
        });
    });
});
