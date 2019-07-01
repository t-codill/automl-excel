import { ICommandBarItemProps } from "@uifabric/experiments";
import { shallow } from "enzyme";
import * as React from "react";
import { classificationSuccessRun } from "../childRun/__data__/classificationSuccessRun";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ConfirmationDialog } from "../components/Dialog/ConfirmationDialog";
import { PageRedirectRender } from "../components/Redirect/PageRedirectRender";
import { JasmineService } from "../services/JasmineService";
import { RunHistoryService } from "../services/RunHistoryService";
import { parentSuccessRun } from "./__data__/parentSuccessRun";
import { ParentRun } from "./ParentRun";

jest.mock("../services/ArtifactService");
jest.mock("../services/RunHistoryService");
jest.mock("../services/JasmineService");
let rhsGetRun: jest.SpyInstance<ReturnType<RunHistoryService["getRun"]>>;
let rhsGetChildRuns: jest.SpyInstance<ReturnType<RunHistoryService["getChildRuns"]>>;
let rhsGetChildRunMetrics: jest.SpyInstance<ReturnType<RunHistoryService["getChildRunMetrics"]>>;
let jasmineCancelRun: jest.SpyInstance<ReturnType<JasmineService["cancelRun"]>>;

describe("Parent Run", () => {
    const routeProps = {
        experimentName: "Test",
        runId: "AutoML_000"
    };

    let buttons: ICommandBarItemProps[] = [];
    beforeEach(() => {
        rhsGetRun = jest.spyOn(RunHistoryService.prototype, "getRun");
        rhsGetChildRuns = jest.spyOn(RunHistoryService.prototype, "getChildRuns");
        rhsGetChildRunMetrics = jest.spyOn(RunHistoryService.prototype, "getChildRunMetrics");
        jasmineCancelRun = jest.spyOn(JasmineService.prototype, "cancelRun");
        jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
            .mockImplementation((b) => { buttons = b; });
    });
    describe("cancel run", () => {
        it("should not cancel if experiment name is undefined", async () => {
            const mockGetRun = Promise.resolve(parentSuccessRun.run);
            rhsGetRun.mockReturnValue(mockGetRun);
            const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
            await mockGetRun;
            t.setState({ experimentName: "" });
            await mockGetRun;
            const cancel = buttons.find((b) => b.key === "cancelRun");
            const logSpy = getLogCustomEventSpy();
            if (cancel && cancel.onClick) {
                cancel.onClick();
            }
            expect(logSpy)
                .toBeCalledWith(
                    "ParentRun_CancelRun_UserAction",
                    testContext,
                    { component: "CancelRun", pageName: "ParentRun", parentRunId: "AutoML_000" }
                );
            expect(t.state("hideCancelDialog"))
                .toBeFalsy();
            expect(t)
                .toMatchSnapshot();
            t.find(ConfirmationDialog)
                .simulate("confirm");
            expect(t.state("canceling"))
                .toBeFalsy();

        });
        it("should not remove cancel dialog if JOS call fails", async () => {
            jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
                .mockImplementation((b) => { buttons = b; });
            const josCancelMock = Promise.resolve(undefined);
            jasmineCancelRun.mockReturnValue(josCancelMock);
            const mockGetRun = Promise.resolve(parentSuccessRun.run);
            rhsGetRun.mockReturnValue(mockGetRun);
            const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
            await mockGetRun;
            await josCancelMock;

            const cancel = buttons.find((b) => b.key === "cancelRun");
            const logSpy = getLogCustomEventSpy();
            if (cancel && cancel.onClick) {
                cancel.onClick();
            }
            expect(logSpy)
                .toBeCalledWith(
                    "ParentRun_CancelRun_UserAction",
                    testContext,
                    { component: "CancelRun", pageName: "ParentRun", parentRunId: "AutoML_000" }
                );
            expect(t.state("hideCancelDialog"))
                .toBeFalsy();
            expect(t)
                .toMatchSnapshot();

            // cancel dialog should be dismissed even if JOS cancel fails
            t.find(ConfirmationDialog)
                .simulate("confirm");
            expect(t.state("canceling"))
                .toBeTruthy();
            expect(t.state("hideCancelDialog"))
                .toBeTruthy();

        });
        it("should successfully cancel", async () => {
            jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
                .mockImplementation((b) => { buttons = b; });
            const josCancelMock = Promise.resolve("Succeed");
            jasmineCancelRun.mockReturnValue(josCancelMock);
            const mockGetRun = Promise.resolve(parentSuccessRun.run);
            rhsGetRun.mockReturnValue(mockGetRun);
            const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
            await mockGetRun;
            await josCancelMock;
            const cancel = buttons.find((b) => b.key === "cancelRun");
            const logSpy = getLogCustomEventSpy();
            if (cancel && cancel.onClick) {
                cancel.onClick();
            }
            expect(logSpy)
                .toBeCalledWith(
                    "ParentRun_CancelRun_UserAction",
                    testContext,
                    { component: "CancelRun", pageName: "ParentRun", parentRunId: "AutoML_000" }
                );
            expect(t.state("hideCancelDialog"))
                .toBeFalsy();
            expect(t)
                .toMatchSnapshot();

            t.find(ConfirmationDialog)
                .simulate("confirm");
            expect(t.state("canceling"))
                .toBeTruthy();

        });

        it("should disable cancel button for local run", async () => {
            rhsGetRun.mockReturnValue(Promise.resolve({ ...parentSuccessRun.run, status: "Running", target: "local" }));
            shallow<ParentRun>(<ParentRun {...routeProps} />);
            await Promise.resolve(undefined);
            const cancel = buttons.find((b) => b.key === "cancelRun");
            let disabled: boolean | undefined;
            if (cancel) {
                disabled = cancel.disabled;
            }
            expect(disabled)
                .toBe(true);
        });

        it("should touch cancel button if cancel run button missing", async () => {
            rhsGetRun.mockImplementation(async () => {
                const cancelButton = buttons.find((b) => b.key === "cancelRun");
                if (cancelButton) {
                    cancelButton.key = "cancelButtonBak";
                }
                return Promise.resolve({ ...parentSuccessRun.run, status: "Running", target: "local" });
            });
            shallow<ParentRun>(<ParentRun {...routeProps} />);
            await Promise.resolve(undefined);
            const cancel = buttons.find((b) => b.key === "cancelRun");
            let disabled: boolean | undefined;
            if (cancel) {
                disabled = cancel.disabled;
            }
            if (cancel) {
                cancel.key = "cancelButton";
            }
            expect(disabled)
                .toBeUndefined();
        });
    });
    it("should not render when get run returns undefined", async () => {
        const mockGetRun = Promise.resolve(undefined);
        rhsGetRun.mockReturnValue(mockGetRun);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetRun;
        expect(t)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should return if child run", async () => {
        const mockGetChildRun = Promise.resolve(classificationSuccessRun.run);
        rhsGetRun.mockReturnValue(mockGetChildRun);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetChildRun;
        expect(t)
            .toMatchSnapshot();
    });
    it("should not setup logs render without setup run id", async () => {
        const mockGetRun = Promise.resolve(parentSuccessRun.run);
        const mockGetChildRuns = Promise.resolve(parentSuccessRun.childRuns);
        rhsGetRun.mockReturnValue(mockGetRun);
        rhsGetChildRuns.mockReturnValue(mockGetChildRuns);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetRun;
        await mockGetChildRuns;
        expect(t)
            .toMatchSnapshot();
    });

    it("should redirect to log page", async () => {
        jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
            .mockImplementation((b) => { buttons = b; });
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);

        const logs = buttons.find((b) => b.key === "log");
        const logSpy = getLogCustomEventSpy();
        if (logs && logs.onClick) {
            logs.onClick();
        }
        expect(logSpy)
            .toBeCalledWith(
                "ParentRun_Log_UserAction",
                testContext,
                { component: "Log", pageName: "ParentRun", parentRunId: "AutoML_000" }
            );
        expect(t.state("goToLog"))
            .toBeTruthy();
        expect(t.find(PageRedirectRender)
            .props())
            .toEqual({
                expendedRoutePath: "logs/Test/LogDetails/parent/AutoML_000",
                noPush: false,
            });
    });

    it("should redirect to run list page", async () => {
        const mockGetRun = Promise.resolve(parentSuccessRun.run);
        rhsGetRun.mockReturnValue(mockGetRun);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        t.setState({ goBack: true });
        t.update();
        await mockGetRun;
        expect(t.find(PageRedirectRender)
            .props())
            .toEqual({
                expendedRoutePath: "",
                noPush: false,
            });
    });
    it("should render grid when child runs are undefined", async () => {
        const mockGetRun = Promise.resolve(parentSuccessRun.run);
        rhsGetRun.mockReturnValue(mockGetRun);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetRun;
        expect(t)
            .toMatchSnapshot();
    });
    it("should render parent run grid with success run", async () => {
        const mockGetChildRunsMetrics = Promise.resolve([
            { metric1: "metric1Value" },
            { metric2: "metric2Value" },
            { metric3: "metric3Value" },
            { metric4: "metric4Value" },
            { metric5: "metric5Value" }]);
        rhsGetChildRunMetrics.mockReturnValue(mockGetChildRunsMetrics);
        const mockGetRun = Promise.resolve(parentSuccessRun.run);
        rhsGetRun.mockReturnValue(mockGetRun);
        const mockGetChildRuns = Promise.resolve(parentSuccessRun.childRuns);
        rhsGetChildRuns.mockReturnValue(mockGetChildRuns);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetChildRunsMetrics;
        await mockGetChildRuns;
        await mockGetRun;
        expect(t)
            .toMatchSnapshot();

    });
    it("should render grid when run has no properties", async () => {
        const runWithoutProps = parentSuccessRun;
        if (runWithoutProps && runWithoutProps.run) {
            runWithoutProps.run.properties = undefined;
        }
        const mockGetRun = Promise.resolve(runWithoutProps.run);
        rhsGetRun.mockReturnValue(mockGetRun);
        const mockGetChildRuns = Promise.resolve(runWithoutProps.childRuns);
        rhsGetChildRuns.mockReturnValue(mockGetChildRuns);
        const t = shallow<ParentRun>(<ParentRun {...routeProps} />);
        await mockGetChildRuns;
        await mockGetRun;
        expect(t)
            .toMatchSnapshot();
    });
});
