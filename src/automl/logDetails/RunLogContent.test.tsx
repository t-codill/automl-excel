import { shallow } from "enzyme";
import * as React from "react";
import { testContext } from "../common/context/__data__/testContext";
import { BaseComponentContext } from "../components/Base/BaseComponentContext";
import { ArtifactService } from "../services/ArtifactService";
import { RunLogContent } from "./RunLogContent";

jest.mock("../services/ArtifactService");
let asGetContent: jest.SpyInstance<ReturnType<ArtifactService["getContent"]>>;
let themeMock: jest.SpyInstance<BaseComponentContext<{}, {}>["context"]>;

describe("Run Log Content Loading", () => {
    const log = {
        logName: "log1",
        prefix: "l1",
        origin: "origin",
        container: "container",
        path: "path"
    };
    beforeEach(() => {
        asGetContent = jest.spyOn(ArtifactService.prototype, "getContent");
        themeMock = jest.spyOn(BaseComponentContext.prototype, "context", "get");
    });
    it("should render spinner when no content", async () => {
        const getContentMock = Promise.resolve(undefined);
        asGetContent.mockReturnValueOnce(getContentMock);
        const tree = shallow(<RunLogContent runLog={log} />);
        await getContentMock;
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should try get data", async () => {
        asGetContent.mockReturnValueOnce(Promise.resolve(undefined));
        const tree = shallow<RunLogContent>(<RunLogContent runLog={log} />);
        await Promise.resolve();
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
        asGetContent.mockClear();
        tree.setProps({
            refreshTimestamp: 1
        });
        await Promise.resolve();
        expect(asGetContent)
            .toBeCalledTimes(1);
    });
});
describe("Run Log Context Theme", () => {
    const log = {
        logName: "log1",
        prefix: "l1",
        origin: "origin",
        container: "container",
        path: "path"
    };
    beforeEach(() => {
        themeMock = jest.spyOn(BaseComponentContext.prototype, "context", "get");
    });
    it("should render log content when valid content with light theme", async () => {
        const getContentMock = Promise.resolve("light theme content");
        asGetContent.mockReturnValueOnce(getContentMock);
        const tree = shallow(<RunLogContent runLog={log} />);
        await getContentMock;
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render log content when dark theme", async () => {
        const getContentMock = Promise.resolve("dark theme content");
        asGetContent.mockReturnValueOnce(getContentMock);
        themeMock.mockImplementation(() => {
            const newContext = { ...testContext, theme: "dark" };
            return newContext;
        });
        const tree = shallow(<RunLogContent runLog={log} />);
        await getContentMock;
        expect(tree)
            .toMatchSnapshot();
    });
});
