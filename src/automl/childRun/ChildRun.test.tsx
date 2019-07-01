import { ICommandBarItemProps } from "@uifabric/experiments";
import { shallow } from "enzyme";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { BaseComponent } from "../components/Base/BaseComponent";
import { ConfirmationDialog } from "../components/Dialog/ConfirmationDialog";
import { PageRedirectRender } from "../components/Redirect/PageRedirectRender";
import { parentSuccessRun } from "../parentRun/__data__/parentSuccessRun";
import { ArtifactService } from "../services/ArtifactService";
import { JasmineService } from "../services/JasmineService";
import { RunHistoryService } from "../services/RunHistoryService";
import { classificationSuccessRun } from "./__data__/classificationSuccessRun";
import { ChildRun, IChildRunRouteProps } from "./ChildRun";

jest.mock("../services/ArtifactService");
jest.mock("../services/RunHistoryService");
let rhsGetRunMetrics: jest.SpyInstance<ReturnType<RunHistoryService["getRunMetrics"]>>;
let rhsGetRun: jest.SpyInstance<ReturnType<RunHistoryService["getRun"]>>;
let asGetAllContents: jest.SpyInstance<ReturnType<ArtifactService["getAllContents"]>>;
let asGetModelUrl: jest.SpyInstance<ReturnType<ArtifactService["getModelUrl"]>>;

const childRunRouteProps = {
  experimentName: "experimentName",
  runId: "AutoML_002"
};
const renderChildRun = async (routeProps: IChildRunRouteProps) => {
  return Promise.resolve(shallow<ChildRun>(<ChildRun {...routeProps} />));
};
describe("Child run page", () => {
  let buttons: ICommandBarItemProps[] = [];
  beforeEach(() => {
    jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
      .mockImplementation((b) => { buttons = b; });
    rhsGetRunMetrics = jest.spyOn(RunHistoryService.prototype, "getRunMetrics");
    rhsGetRun = jest.spyOn(RunHistoryService.prototype, "getRun");
    asGetAllContents = jest.spyOn(ArtifactService.prototype, "getAllContents");
    asGetModelUrl = jest.spyOn(ArtifactService.prototype, "getModelUrl");
  });

  it("should render loading image when run is undefined", async () => {
    rhsGetRun.mockImplementationOnce(() => Promise.resolve(undefined));
    expect(await renderChildRun(childRunRouteProps))
      .toMatchInlineSnapshot("<pageLoadingSpinner />");
  });
  it("should render grid when no run metrics", async () => {
    rhsGetRunMetrics.mockImplementationOnce(() => Promise.resolve(undefined));
    expect(await renderChildRun(childRunRouteProps))
      .toMatchSnapshot();
  });

  it("should render grid and status bar without model url", async () => {
    asGetModelUrl.mockImplementationOnce(() => Promise.resolve(undefined));
    expect(await renderChildRun(childRunRouteProps))
      .toMatchSnapshot();
  });
  it("should render grid with model url", async () => {
    expect(await renderChildRun(childRunRouteProps))
      .toMatchSnapshot();
  });

  it("should render grid when run artifact contents are undefined", async () => {
    asGetAllContents.mockImplementationOnce(() => Promise.resolve(undefined));
    expect(await renderChildRun(childRunRouteProps))
      .toMatchSnapshot();
  });

  it("should go back to run list page page", async () => {
    const tree = await renderChildRun(childRunRouteProps);
    tree.setState({ run: parentSuccessRun.run, goBack: true });
    expect(tree.find(PageRedirectRender)
      .props())
      .toEqual({
        expendedRoutePath: "",
        noPush: false,
      });
  });

  it("should redirect to parent run", async () => {
    const tree = await renderChildRun(childRunRouteProps);
    tree.setState({ goBack: true });
    expect(tree.find(PageRedirectRender)
      .props())
      .toEqual({
        expendedRoutePath: "experiments/experimentName/parentrun/AutoML_000",
        noPush: false,
      });
  });

  it("should redirect to log page", async () => {
    const tree = await renderChildRun(childRunRouteProps);
    const logSpy = getLogCustomEventSpy();
    const logs = buttons.find((b) => b.key === "log");
    if (logs && logs.onClick) {
      logs.onClick();
    }
    expect(logSpy)
      .toBeCalledWith(
        "ChildRun_Log_UserAction",
        testContext,
        { childRunId: "AutoML_002", component: "Log", pageName: "ChildRun", parentRunId: "AutoML_000" });
    expect(tree.state("goToLog"))
      .toBe(true);
    expect(tree.find(PageRedirectRender)
      .props())
      .toEqual({
        expendedRoutePath: "logs/experimentName/LogDetails/child/AutoML_002",
        noPush: false,
      });

  });

  it("should render redirect to parent run page for parent run", async () => {
    const tree = await renderChildRun(childRunRouteProps);
    tree.setState({ run: parentSuccessRun.run });
    expect(tree.find(PageRedirectRender)
      .props())
      .toEqual({
        expendedRoutePath: "experiments/experimentName/parentrun/AutoML_000",
        noPush: false,
      });
  });

  it("should render redirect to lif of run page for parent run without run id", async () => {
    const tree = await renderChildRun(childRunRouteProps);
    tree.setState({ run: { ...parentSuccessRun.run, runId: undefined } });
    expect(tree.find(PageRedirectRender)
      .props())
      .toEqual({
        expendedRoutePath: "",
        noPush: false,
      });
  });

  it("should cancel run", async (done) => {
    const tree = await renderChildRun(childRunRouteProps);
    rhsGetRun.mockClear();
    const logSpy = getLogCustomEventSpy();
    const cancel = buttons.find((b) => b.key === "cancelRun");
    if (cancel && cancel.onClick) {
      cancel.onClick();
    }
    expect(logSpy)
      .toBeCalledWith(
        "ChildRun_CancelRun_UserAction",
        testContext,
        { childRunId: "AutoML_002", component: "CancelRun", pageName: "ChildRun", parentRunId: "AutoML_000" });
    expect(tree.state("hideCancelDialog"))
      .toBe(false);
    expect(tree)
      .toMatchSnapshot();
    tree.find(ConfirmationDialog)
      .simulate("confirm");
    expect(tree.state("canceling"))
      .toBe(true);
    setImmediate(() => {
      expect(rhsGetRun)
        .toBeCalledTimes(1);
      done();
    });
  });

  it("if cancel run return undefined should not refresh page", async (done) => {
    const logSpy = getLogCustomEventSpy();
    const asCancelRun = jest.spyOn(JasmineService.prototype, "cancelRun");
    asCancelRun.mockReturnValue(Promise.resolve(undefined));
    const tree = await renderChildRun(childRunRouteProps);
    rhsGetRun.mockClear();
    const cancel = buttons.find((b) => b.key === "cancelRun");
    if (cancel && cancel.onClick) {
      cancel.onClick();
    }
    expect(logSpy)
      .toBeCalledWith(
        "ChildRun_CancelRun_UserAction",
        testContext,
        { childRunId: "AutoML_002", component: "CancelRun", pageName: "ChildRun", parentRunId: "AutoML_000" });
    expect(tree.state("hideCancelDialog"))
      .toBe(false);
    tree.find(ConfirmationDialog)
      .simulate("confirm");
    expect(tree.state("canceling"))
      .toBe(true);
    setImmediate(() => {
      expect(rhsGetRun)
        .toBeCalledTimes(0);
      done();
    });
  });

  it("should not cancel run when experiment name is undefined", async () => {
    const logSpy = getLogCustomEventSpy();
    const unnamedRun: IChildRunRouteProps = {
      experimentName: "",
      runId: "AutoML_002"
    };
    const tree = await renderChildRun(unnamedRun);
    const cancel = buttons.find((b) => b.key === "cancelRun");
    if (cancel && cancel.onClick) {
      cancel.onClick();
    }
    expect(logSpy)
      .toBeCalledWith(
        "ChildRun_CancelRun_UserAction",
        testContext,
        { childRunId: "AutoML_002", component: "CancelRun", pageName: "ChildRun", parentRunId: "AutoML_000" });
    expect(tree.state("hideCancelDialog"))
      .toBe(false);
    expect(tree)
      .toMatchSnapshot();
    tree.find(ConfirmationDialog)
      .simulate("confirm");
    expect(tree.state("canceling"))
      .toBe(false);
  });

  it("should disable cancel button for local run", async () => {
    const unnamedRun: IChildRunRouteProps = {
      experimentName: "",
      runId: "AutoML_002"
    };
    rhsGetRun.mockReturnValue(Promise.resolve({ ...classificationSuccessRun.run, status: "Running", target: "local" }));
    await renderChildRun(unnamedRun);
    const cancel = buttons.find((b) => b.key === "cancelRun");
    let disabled: boolean | undefined;
    if (cancel) {
      disabled = cancel.disabled;
    }
    expect(disabled)
      .toBe(true);
  });

  it("should touch cancel button if cancel run button missing", async () => {
    const unnamedRun: IChildRunRouteProps = {
      experimentName: "",
      runId: "AutoML_002"
    };
    rhsGetRun.mockImplementation(async () => {
      const cancelButton = buttons.find((b) => b.key === "cancelRun");
      if (cancelButton) {
        cancelButton.key = "cancelButtonBak";
      }
      return Promise.resolve({ ...classificationSuccessRun.run, status: "Running", target: "local" });
    });
    await renderChildRun(unnamedRun);
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
