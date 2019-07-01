import { shallow } from "enzyme";
import { Link, MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { sampleHttpResponse } from "../../__data__/sampleHttpResponse";
import { reactMouseEvent } from "../__data__/reactMouseEvent";
import { ErrorMessageBar } from "./ErrorMessageBar";

describe("ErrorMessageBar", () => {

    it("should render", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message"
            },
            count: 1
        }} />);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render count", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message"
            },
            count: 2
        }} />);
        const actions = shallow(tree
            .find(MessageBar)
            .props()
            .actions || <div />);
        expect(actions.text())
            .toBe("2");
    });

    it("should render detail link with body", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    ...sampleHttpResponse,
                    body: "This is error detail",
                }
            },
            count: 1,
        }} />);
        expect(tree.find("[children=\"Show more details\"]")
            .exists())
            .toBe(true);
    });

    it("should render detail link with bodyAsText", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    ...sampleHttpResponse,
                    body: undefined,
                    bodyAsText: "This is error detail for body as text"
                }
            },
            count: 1,
        }} />);
        expect(tree.find("[children=\"Show more details\"]")
            .exists())
            .toBe(true);
    });

    it("should NOT render detail link without body or bodyAsText", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    ...sampleHttpResponse,
                    body: undefined,
                    bodyAsText: undefined
                }
            },
            count: 1,
        }} />);
        expect(tree.find("[children=\"Show more details\"]")
            .exists())
            .toBe(false);
    });

    it("should show detail", () => {
        const tree = shallow<ErrorMessageBar>(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    body: "This is error detail",
                    ...sampleHttpResponse
                }
            },
            count: 1,
        }} />);
        const onClick =
            tree
                .find(Link)
                .props()
                .onClick;
        if (onClick) {
            onClick(reactMouseEvent);
        }
        expect(tree.state().showingDetail)
            .toBe(true);
        expect(tree.find("pre.error-detail")
            .text())
            .toBe("This is error detail");
        expect(tree.find("[children=\"Hide more details\"]")
            .exists())
            .toBe(true);
    });

    it("should hide detail", () => {
        const tree = shallow<ErrorMessageBar>(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    body: "This is error detail",
                    ...sampleHttpResponse
                }
            },
            count: 1,
        }} />);
        tree.setState({ showingDetail: true });
        const onClick =
            tree
                .find(Link)
                .props()
                .onClick;
        if (onClick) {
            onClick(reactMouseEvent);
        }
        expect(tree.state().showingDetail)
            .toBe(false);
    });

    it("should show details with bodyAsText", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    ...sampleHttpResponse,
                    body: undefined,
                    bodyAsText: "This is error detail for body as text"
                }
            },
            count: 1,
        }} />);
        tree.setState({ showingDetail: true });
        expect(tree.find("pre.error-detail")
            .text())
            .toBe("This is error detail for body as text");
    });

    it("should NOT show details without body or bodyAsText", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message",
                response: {
                    ...sampleHttpResponse,
                    body: undefined,
                    bodyAsText: undefined
                }
            },
            count: 1,
        }} />);
        tree.setState({ showingDetail: true });
        expect(tree.find("pre.error-detail")
            .exists())
            .toBe(false);
    });

    it("should dismiss", () => {
        const tree = shallow<ErrorMessageBar>(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message"
            },
            count: 1
        }} />);
        const onDismiss =
            tree
                .find(MessageBar)
                .props()
                .onDismiss;
        if (onDismiss) {
            onDismiss();
        }
        expect(tree.state().dismissed)
            .toBe(true);
    });

    it("dismissed should not render", () => {
        const tree = shallow(<ErrorMessageBar error={{
            error: {
                name: "test error",
                message: "test message"
            },
            count: 1
        }} />);
        tree.setState({ dismissed: true });
        expect(tree)
            .toMatchSnapshot();
    });
});
