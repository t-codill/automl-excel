import { shallow } from "enzyme";
import { createBrowserHistory } from "history";
import * as React from "react";
import { BrowserRouter, Route, RouteProps } from "react-router-dom";
import { NotFound } from "../../notFound/NotFound";
import { ParentRun } from "../../parentRun/ParentRun";
import { BaseRoute, DefaultRoute, PageRoute } from "./PageRoute";

describe("PageRoute", () => {
    it("should render route", () => {
        const tree = shallow(
            <BrowserRouter>
                {PageRoute(ParentRun)}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render component", () => {
        const tree = shallow(
            <BrowserRouter>
                {PageRoute(ParentRun)}
            </BrowserRouter>);
        const route = tree.find<RouteProps>(Route);
        let component: React.ReactNode;

        const props = route.props();
        if (props.render) {
            component = props.render({
                history: createBrowserHistory(),
                location: { ...window.location, state: {} },
                match: {
                    path: "",
                    isExact: true,
                    url: "",
                    params: {
                        experimentName: "experimentName",
                        runId: "runId"
                    }
                }
            });
        }
        expect(component)
            .toMatchSnapshot();
    });
});

describe("BaseRoute", () => {
    it("should render route", () => {
        const tree = shallow(
            <BrowserRouter>
                {BaseRoute(NotFound)}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render component", () => {
        const tree = shallow(
            <BrowserRouter>
                {BaseRoute(NotFound)}
            </BrowserRouter>);
        const route = tree.find<RouteProps>(Route);
        let component: React.ReactNode;

        const props = route.props();
        if (props.render) {
            component = props.render({
                history: createBrowserHistory(),
                location: { ...window.location, state: {} },
                match: {
                    path: "",
                    isExact: true,
                    url: "",
                    params: {
                        param1: "param1",
                        param2: "param2"
                    }
                }
            });
        }
        expect(component)
            .toMatchSnapshot();
    });
});

describe("DefaultRoute", () => {
    it("should render route", () => {
        const tree = shallow(
            <BrowserRouter>
                {DefaultRoute(NotFound)}
            </BrowserRouter>);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render component", () => {
        const tree = shallow(
            <BrowserRouter>
                {DefaultRoute(NotFound)}
            </BrowserRouter>);
        const route = tree.find<RouteProps>(Route);
        let component: React.ReactNode;

        const props = route.props();
        if (props.render) {
            component = props.render({
                history: createBrowserHistory(),
                location: { ...window.location, state: {} },
                match: {
                    path: "",
                    isExact: true,
                    url: "",
                    params: {
                        param1: "param1",
                        param2: "param2"
                    }
                }
            });
        }
        expect(component)
            .toMatchSnapshot();
    });
});
