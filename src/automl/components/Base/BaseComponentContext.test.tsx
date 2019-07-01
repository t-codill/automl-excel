import { render } from "enzyme";
import * as React from "react";
import serializeJavascript from "serialize-javascript";
import { testContext } from "../../common/context/__data__/testContext";
import { WorkspaceContext } from "../../common/context/WorkspaceContext";
import { BaseComponentContext } from "./BaseComponentContext";

jest.unmock("./BaseComponentContext");

class BaseComponentContextTester extends BaseComponentContext<{}, {}> {
    public render(): React.ReactNode {
        return <div>{serializeJavascript(this.context)}</div>;
    }
}

describe("BaseComponentContext", () => {
    it("render with context", () => {
        const tree = render(
            <WorkspaceContext.Provider value={testContext}>
                <BaseComponentContextTester />
            </WorkspaceContext.Provider>);
        expect(tree.text())
            .toBe(serializeJavascript(testContext));
    });
});
