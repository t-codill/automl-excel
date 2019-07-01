import { shallow } from "enzyme";
import * as React from "react";
import { BrowserRouter } from "react-router-dom";
import { ParentRun } from "../../parentRun/ParentRun";
import { WorkspaceList } from "../../workspaceList/WorkspaceList";
import { BaseRedirect, BaseRedirectLink, PageRedirect, PageRedirectLink } from "./PageRedirect";

describe("PageRedirect", () => {
    it("should render PageRedirectLink", () => {
        const tree = shallow(
            <BrowserRouter>
                {PageRedirectLink("Parent Run", ParentRun, { experimentName: "expName", runId: "AutoML_123" })}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render PageRedirect", () => {
        const tree = shallow(
            <BrowserRouter>
                {PageRedirect(ParentRun, { experimentName: "expName", runId: "AutoML_123" })}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render BaseRedirectLink", () => {
        const tree = shallow(
            <BrowserRouter>
                {BaseRedirectLink("WorkspaceList", WorkspaceList, { subscriptionId: "00000000-0000-0000-0000-000000000000" })}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render BaseRedirect", () => {
        const tree = shallow(
            <BrowserRouter>
                {BaseRedirect(WorkspaceList, { subscriptionId: "00000000-0000-0000-0000-000000000000" })}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render BaseRedirect with no push", () => {
        const tree = shallow(
            <BrowserRouter>
                {BaseRedirect(WorkspaceList, { subscriptionId: "00000000-0000-0000-0000-000000000000" }, true)}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
});
