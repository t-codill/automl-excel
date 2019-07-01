import { shallow, ShallowWrapper } from "enzyme";
import { ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { BaseComponent } from "../components/Base/BaseComponent";
import { DataTable } from "../components/DataTable/DataTable";
import { PageRedirectRender } from "../components/Redirect/PageRedirectRender";
import { AccessService } from "../services/AccessService";
import { IRunDtoWithExperimentName, RunHistoryService } from "../services/RunHistoryService";
import { IRunListState, RunList } from "./RunList";
import { RunListDateSelector } from "./RunListDateSelector";
import { RunListExperimentSelector } from "./RunListExperimentSelector";
import { RunStatusCardContainer } from "./RunStatusCardContainer";

jest.mock("../services/RunHistoryService");
jest.mock("../services/AccessService");
describe("RunList", () => {
    let getRunListSpy: jest.SpyInstance<
        ReturnType<RunHistoryService["getRunList"]>
    >;
    beforeEach(() => {
        getRunListSpy = jest.spyOn(RunHistoryService.prototype, "getRunList");
    });
    it("should show spinning", async () => {
        getRunListSpy.mockReturnValue(Promise.resolve(undefined));
        const tree = shallow<RunList>(<RunList />);
        await Promise.resolve();
        await Promise.resolve();
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should render", async () => {
        const tree = shallow<RunList>(<RunList />);
        await Promise.resolve();
        await Promise.resolve();
        expect(tree)
            .toMatchSnapshot();
    });
    it("should redirect to welcome page", async () => {
        getRunListSpy.mockReturnValue(Promise.resolve([]));
        const tree = shallow<RunList>(<RunList />);
        await Promise.resolve();
        await Promise.resolve();
        expect(tree
            .find(PageRedirectRender)
            .props())
            .toEqual({
                expendedRoutePath: "Welcome",
                noPush: false
            });
    });

    describe("start run button", () => {
        let checkPermissionSpy: jest.SpyInstance<
            ReturnType<AccessService["checkPermission"]>
        >;
        let startRunButton: ICommandBarItemProps | undefined;
        let tree: ShallowWrapper<{}, IRunListState>;
        beforeEach(async () => {
            checkPermissionSpy = jest.spyOn(
                AccessService.prototype,
                "checkPermission"
            );
            const setButtonSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
            setButtonSpy.mockImplementation((buttons: ICommandBarItemProps[]) => {
                startRunButton = buttons.find((b) => b.key === "startRun");
            });
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
        });
        it("should show when have access", () => {
            let disabled: boolean | undefined;
            if (startRunButton) {
                disabled = startRunButton.disabled;
            }
            expect(disabled)
                .toBe(false);
        });
        it("should disable when no access", async () => {
            checkPermissionSpy.mockReturnValue(Promise.resolve(false));
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            let disabled: boolean | undefined;
            if (startRunButton) {
                disabled = startRunButton.disabled;
            }
            expect(disabled)
                .toBe(true);
        });
        it("should not touch button if not found", async () => {
            checkPermissionSpy.mockImplementation(async () => {
                if (startRunButton) {
                    startRunButton.key = "startRunBak";
                    startRunButton.disabled = true;
                }
                return true;
            });
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            let disabled: boolean | undefined;
            if (startRunButton) {
                disabled = startRunButton.disabled;
            }
            expect(disabled)
                .toBe(true);
        });
        it("should redirect to start run page", async () => {
            const logSpy = getLogCustomEventSpy();
            if (startRunButton && startRunButton.onClick) {
                startRunButton.onClick();
            }
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_CreateExperiment_UserAction",
                    testContext,
                    { component: "CreateExperiment", pageName: "RunList" }
                );
            await Promise.resolve();
            expect(tree
                .find(PageRedirectRender)
                .props())
                .toEqual({
                    expendedRoutePath: "startRun",
                    noPush: false
                });
        });
    });

    describe("handleDateFilterChange", () => {
        const laterRun = {
            experimentName: "Experiment",
            createdUtc: new Date(12345)
        };
        const earlierRun = {
            experimentName: "Experiment",
            createdUtc: new Date(1234)
        };
        const sameTimeRun = {
            experimentName: "Experiment",
            createdUtc: new Date(10000)
        };
        const runs = [laterRun, earlierRun, sameTimeRun];
        let onDateChange: (d: Date) => void;
        let tree: ShallowWrapper<{}, IRunListState>;
        beforeAll(async () => {
            getRunListSpy.mockReturnValue(Promise.resolve(runs));
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            onDateChange = tree.find(RunListDateSelector)
                .prop("onDateChange");
        });
        it("should filter", async () => {
            expect(tree.state("filteredRuns"))
                .toEqual(runs);
            const logSpy = getLogCustomEventSpy();
            onDateChange(new Date(10000));
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_DateFilter_UserAction",
                    testContext,
                    { DateFilterValue: "Thu Jan 01 1970 00:00:10 GMT+0000", component: "DateFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([laterRun, sameTimeRun]);
        });
        it("should not filter if runs are undefined", async () => {
            tree.setState({ runs: undefined });
            const logSpy = getLogCustomEventSpy();
            onDateChange(new Date(20000));
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_DateFilter_UserAction",
                    testContext,
                    { DateFilterValue: "Thu Jan 01 1970 00:00:20 GMT+0000", component: "DateFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([laterRun, sameTimeRun]);
        });
    });

    describe("handleExperimentFilterChange", () => {
        const runs = [
            {
                experimentName: "Experiment1",
                status: "Completed"
            },
            {
                experimentName: "Experiment2",
                status: "Running"
            },
            {
                experimentName: "Experiment3",
                status: "Cancelled"
            }
        ];
        let onExperimentChange: (d: string[]) => void;
        let tree: ShallowWrapper<{}, IRunListState>;
        beforeAll(async () => {
            getRunListSpy.mockReturnValue(Promise.resolve(runs));
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            onExperimentChange = tree
                .find(RunListExperimentSelector)
                .prop("onExperimentChange");
        });

        it("should filter", async () => {
            expect(tree.state("filteredRuns"))
                .toEqual(runs);
            const logSpy = getLogCustomEventSpy();
            onExperimentChange(["Experiment1", "Experiment4"]);
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_ExperimentFilter_UserAction",
                    testContext,
                    { ExperimentFilterValue: "[\"Experiment1\",\"Experiment4\"]", component: "ExperimentFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([
                    {
                        experimentName: "Experiment1",
                        status: "Completed"
                    }
                ]);
            expect(tree.state("runStatistics"))
                .toEqual({
                    Running: 0,
                    Completed: 1,
                    Failed: 0,
                    Others: 0
                });
        });
        it("should not filter if runs are undefined", async () => {
            tree.setState({ runs: undefined });
            const logSpy = getLogCustomEventSpy();
            onExperimentChange(["not exist"]);
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_ExperimentFilter_UserAction",
                    testContext,
                    { ExperimentFilterValue: "[\"not exist\"]", component: "ExperimentFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([
                    {
                        experimentName: "Experiment1",
                        status: "Completed"
                    }
                ]);
        });
    });

    describe("handleStatusFilterChange", () => {
        const runs = [
            {
                experimentName: "Experiment1",
                status: "Completed"
            },
            {
                experimentName: "Experiment2",
                status: "Running"
            },
            {
                experimentName: "Experiment3",
                status: "Cancelled"
            }
        ];
        let onStatusFilterChange: (d: string) => void;
        let tree: ShallowWrapper<{}, IRunListState>;
        beforeAll(async () => {
            getRunListSpy.mockReturnValue(Promise.resolve(runs));
            tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            onStatusFilterChange = tree
                .find(RunStatusCardContainer)
                .prop("onStatusFilterChange");
        });

        it("should filter", async () => {
            expect(tree.state("filteredRuns"))
                .toEqual(runs);
            const logSpy = getLogCustomEventSpy();
            onStatusFilterChange("Completed");
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_StatusFilter_UserAction",
                    testContext,
                    { StatusFilterValue: "Completed", component: "StatusFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([
                    {
                        experimentName: "Experiment1",
                        status: "Completed"
                    }
                ]);
        });
        it("should not filter if runs are undefined", async () => {
            tree.setState({ runs: undefined });
            const logSpy = getLogCustomEventSpy();
            onStatusFilterChange("not exist");
            expect(logSpy)
                .toBeCalledWith(
                    "RunList_StatusFilter_UserAction",
                    testContext,
                    { StatusFilterValue: "not exist", component: "StatusFilter", pageName: "RunList" }
                );
            expect(tree.state("filteredRuns"))
                .toEqual([
                    {
                        experimentName: "Experiment1",
                        status: "Completed"
                    }
                ]);
        });
    });

    describe("renderRunId", () => {
        let render: (
            content: React.ReactNode,
            data: IRunDtoWithExperimentName
        ) => React.ReactNode;
        beforeEach(async () => {
            const tree = shallow<RunList>(<RunList />);
            await Promise.resolve();
            await Promise.resolve();
            render = tree
                .find(DataTable)
                .prop("columns")[1].render as (
                    content: React.ReactNode,
                    data: IRunDtoWithExperimentName
                ) => React.ReactNode;
        });
        it("should return undefined without run id", async () => {
            expect(
                render(<div>Content</div>, {
                    experimentName: "ExpName"
                })
            )
                .toBeUndefined();
        });
        it("should return parent run link", async () => {
            expect(
                render(<div>Content</div>, {
                    experimentName: "ExpName",
                    runId: "runId"
                })
            )
                .toMatchInlineSnapshot(`
<PageRedirectLinkRender
  expendedRoutePath="experiments/ExpName/parentrun/runId"
>
  <div>
    Content
  </div>
</PageRedirectLinkRender>
`);
        });
        it("should return child run link", async () => {
            expect(
                render(<div>Content</div>, {
                    experimentName: "ExpName",
                    runId: "runId",
                    parentRunId: "parentRunId"
                })
            )
                .toMatchInlineSnapshot(`
<PageRedirectLinkRender
  expendedRoutePath="experiments/ExpName/childrun/runId"
>
  <div>
    Content
  </div>
</PageRedirectLinkRender>
`);
        });
    });
});
