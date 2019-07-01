import { render } from "enzyme";
import * as React from "react";
import { NotImplementedError } from "../NotImplementedError";
import { PageNames } from "../PageNames";
import { IWorkspaceContextProps } from "./IWorkspaceProps";
import { WorkspaceContext } from "./WorkspaceContext";

describe("WorkspaceContext", () => {
    let context!: IWorkspaceContextProps;
    beforeEach(() => {
        render(
            <div>
                <WorkspaceContext.Consumer>
                    {
                        (value) => {
                            context = value;
                            return <div />;
                        }
                    }
                </WorkspaceContext.Consumer>
            </div>
        );
    });
    it("should read default context", () => {
        expect(context)
            .toMatchSnapshot();
    });
    it("clearErrors should throw not implemented error ", () => {
        expect(() => {
            context.clearErrors();
        })
            .toThrowError(new NotImplementedError());
    });
    it("setHeader should throw not implemented error ", () => {
        expect(() => {
            context.setHeader("");
        })
            .toThrowError(new NotImplementedError());
    });
    it("setPageName should throw not implemented error ", () => {
        expect(() => {
            context.setPageName(PageNames.Unknown);
        })
            .toThrowError(new NotImplementedError());
    });
    it("setLoading should throw not implemented error ", () => {
        expect(() => {
            context.setLoading(true);
        })
            .toThrowError(new NotImplementedError());
    });
    it("setNavigationBarButtons should throw not implemented error ", () => {
        expect(() => {
            context.setNavigationBarButtons([], [], []);
        })
            .toThrowError(new NotImplementedError());
    });
    it("getToken should throw not implemented error ", () => {
        expect(() => {
            context.getToken();
        })
            .toThrowError(new NotImplementedError());
    });
    it("onError should throw not implemented error ", () => {

        expect(() => {
            context.onError({
                name: "test error",
                message: "test message"
            });
        })
            .toThrowError(new NotImplementedError());
    });
});
