import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { IRunStatusCardProps, RunStatusCard } from "./RunStatusCard";
import { RunStatusCardContainer } from "./RunStatusCardContainer";

describe("RunStatusCard", () => {
    let tree: ShallowWrapper;
    let statusCardProps: IRunStatusCardProps;
    const mockCallBack = jest.fn();

    describe("Invalid Props", () => {
        beforeEach(() => {
            const emptyRunStatistics = {};
            const props = {
                runStatus: emptyRunStatistics,
                onStatusFilterChange: mockCallBack
            };
            tree = shallow(
                <RunStatusCardContainer {...props} />
            );
            statusCardProps = tree.find(RunStatusCard)
                .get(0)
                .props;
            mockCallBack.mockClear();
        });
        it("should match snapshot", () => {
            expect(tree)
                .toMatchSnapshot();
        });
    });

    describe("Valid Props", () => {
        beforeEach(() => {
            const runStatistics = {
                Running: 8,
                Completed: 17,
                Failed: 47,
                Others: 16
            };
            const props = {
                runStatus: runStatistics,
                onStatusFilterChange: mockCallBack
            };
            tree = shallow(
                <RunStatusCardContainer {...props} />
            );
            statusCardProps = tree.find(RunStatusCard)
                .get(0)
                .props;
            mockCallBack.mockClear();
        });
        it("should match snapshot", () => {
            expect(tree)
                .toMatchSnapshot();
        });
        it("should find first status card", () => {
            expect(statusCardProps)
                .toBeDefined();
        });
        it("should not call onDateChange with undefined option", () => {
            if (statusCardProps && statusCardProps.handleStatusFilterChange) {
                statusCardProps.handleStatusFilterChange("Running");
            }
            expect(mockCallBack)
                .toBeCalledWith("Running");
        });
    });
});
