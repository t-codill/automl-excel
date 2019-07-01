import { shallow } from "enzyme";
import * as officeFabric from "office-ui-fabric-react";
import * as React from "react";
import { App, MessageKind, MessageSignature } from "./App";
import { BaseContext } from "./common/context/BaseContext";
import { PageNames } from "./common/PageNames";
import * as getEnv from "./common/utils/getEnv";
import { AuthenticationService } from "./services/AuthenticationService";

const map = {
    message: (_event: Partial<MessageEvent>) => { return; }
};
window.addEventListener = jest.fn((event, cb) => {
    map[event] = cb;
});

const tree = shallow<App>(<App />);

describe("App", () => {

    it("render with loading", () => {
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });

    it("should not set token, if armToken does not have value", () => {
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.GetAuthContextResponse,
                data: {
                    armToken: undefined
                }
            }
        };
        map.message(message);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });

    it("render page after get token", () => {
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.GetAuthContextResponse,
                data: {
                    armToken: "test token"
                }
            }
        };
        map.message(message);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should clear previous refresh token timeout", () => {
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        let refToken: TimerHandler = () => { return; };
        setTimeoutSpy.mockImplementationOnce((ref: TimerHandler) => {
            refToken = ref;
            return 1;
        });
        shallow(<App />);
        refToken();
        expect(clearTimeoutSpy)
            .toBeCalledWith(1);
    });

    it("should not clear previous timeout without refresh timeout defined", () => {
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
        const setTimeoutSpy = jest.spyOn(window, "setTimeout");
        setTimeoutSpy.mockReturnValue(0);
        const unmountTree = shallow(<App />);
        const instance = unmountTree.instance();
        if (instance && instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        expect(clearTimeoutSpy)
            .toBeCalledTimes(0);
    });

    it("should not set theme if theme not changed", () => {
        const loadThemeSpy = jest.spyOn(officeFabric, "loadTheme");
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.Theme,
                data: {
                    themeName: "light"
                }
            }
        };
        map.message(message);
        expect(loadThemeSpy)
            .toBeCalledTimes(0);
    });

    it("should not set theme if theme name missing", () => {
        const setThemeSpy = jest.spyOn(tree.instance(), "setState");
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.Theme,
                data: {
                    themeName: undefined
                }
            }
        };
        map.message(message);
        expect(setThemeSpy)
            .toBeCalledTimes(0);
    });

    it("should refresh token for development", (done) => {
        const getEnvSpy = jest.spyOn(getEnv, "getEnv");
        getEnvSpy.mockReturnValue("development");
        const postMessageSpy = jest.spyOn(window.parent, "postMessage");
        const getTokenSpy = jest.spyOn(AuthenticationService, "getToken");
        getTokenSpy.mockReturnValue(Promise.resolve("test token"));
        shallow(<App />);
        setImmediate(() => {
            expect(postMessageSpy)
                .toHaveBeenLastCalledWith(
                    {
                        data: {
                            armToken: "test token",
                        },
                        kind: "getAuthContextResponse",
                        signature: "FxFrameBlade",
                    },
                    "*");
            done();
        });
    });

    it("should not set token for development if get token undefined", () => {
        const getEnvSpy = jest.spyOn(getEnv, "getEnv");
        getEnvSpy.mockReturnValue("development");
        const getTokenSpy = jest.spyOn(AuthenticationService, "getToken");
        getTokenSpy.mockReturnValue(Promise.resolve(undefined));
        const postMessageSpy = jest.spyOn(window, "postMessage");
        shallow(<App />);
        expect(postMessageSpy)
            .not
            .toHaveBeenLastCalledWith(
                {
                    data: {
                        armToken: "test token",
                    },
                    kind: "getAuthContextResponse",
                    signature: "FxFrameBlade",
                },
                "*");
    });

    it("should not do anything if message data is missing", () => {
        const setThemeSpy = jest.spyOn(tree.instance(), "setState");
        const message: Partial<MessageEvent> = {
        };
        map.message(message);
        expect(setThemeSpy)
            .toBeCalledTimes(0);
    });

    it("should not do anything if signature is not blade", () => {
        const setThemeSpy = jest.spyOn(tree.instance(), "setState");
        const message: Partial<MessageEvent> = {
            data: {
                signature: "" as MessageSignature.FxFrameBlade,
                kind: MessageKind.Theme,
            }
        };
        map.message(message);
        expect(setThemeSpy)
            .toBeCalledTimes(0);
    });

    it("should not do anything for unknown message kind", () => {
        const setThemeSpy = jest.spyOn(tree.instance(), "setState");
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: "" as MessageKind,
            }
        };
        map.message(message);
        expect(setThemeSpy)
            .toBeCalledTimes(0);
    });

    it("should error", () => {
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.Error,
                data: "this is test error"
            }
        };
        expect(() => { map.message(message); })
            .toThrowErrorMatchingSnapshot();
    });

    it("should set page name", async () => {
        tree
            .find(BaseContext.Provider)
            .props()
            .value
            .setPageName(PageNames.LogDetails);
        await Promise.resolve();
        expect(tree
            .find(BaseContext.Provider)
            .props()
            .value
            .pageName)
            .toBe(PageNames.LogDetails);
    });

    it("should pass token", () => {
        const context = tree.find(BaseContext.Provider);
        expect(context
            .props()
            .value
            .getToken())
            .toBe("test token");
    });

    it("unmount will clear timeout", () => {
        const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
        const instance = tree.instance();
        if (instance && instance.componentWillUnmount) {
            instance.componentWillUnmount();
        }
        expect(clearTimeoutSpy)
            .toBeCalledTimes(1);
    });

    it("should set dark theme", () => {
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.Theme,
                data: {
                    themeName: "dark"
                }
            }
        };
        map.message(message);
        tree.update();
        const customizerElem = tree.find(officeFabric.Customizer)
            .getElement();
        expect(customizerElem.props.theme)
            .toBe("darkTheme");
        expect(tree.instance().state.theme)
            .toBe("dark");
        expect(tree.find(".dark"))
            .toHaveLength(1);

    });

    it("should set light theme", () => {
        const message: Partial<MessageEvent> = {
            data: {
                signature: MessageSignature.FxFrameBlade,
                kind: MessageKind.Theme,
                data: {
                    themeName: "light"
                }
            }
        };
        map.message(message);
        tree.update();
        const customizerElem = tree.find(officeFabric.Customizer)
            .getElement();
        expect(customizerElem.props.theme)
            .toBe("lightTheme");
        expect(tree.state("theme"))
            .toBe("light");
        expect(tree.find(".light"))
            .toHaveLength(1);

    });
});
