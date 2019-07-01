import { shallow, ShallowWrapper } from "enzyme";
import { CommandBar, ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react";
import { testContext } from "./common/context/__data__/testContext";
import { IWorkspaceContextProps, IWorkspaceRouteProps } from "./common/context/IWorkspaceProps";
import { WorkspaceContext } from "./common/context/WorkspaceContext";
import { ErrorMessageBar } from "./components/ErrorMessageBar";
import { IMainState, Main } from "./Main";
import { DiscoveryService } from "./services/DiscoveryService";
import { WorkSpaceService } from "./services/WorkSpaceService";

jest.mock("./services/DiscoveryService");
jest.mock("./services/WorkSpaceService");

describe("Main", () => {
    describe("Loading", () => {
        it("render with loading icon", () => {
            const tree = shallow(<Main
                {...testContext}
            />);
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should set delete if no workspace found", async () => {
            const workspace = Promise.resolve(null);
            const spy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            spy.mockReturnValueOnce(workspace);
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            expect(tree.state().deleted)
                .toBe(true);
            expect(tree)
                .toMatchSnapshot();
        });

        it("should show loading icon if get workspace is canceled ", async () => {
            const workspace = Promise.resolve(undefined);
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should show loading icon if get workspace has no discover url ", async () => {
            const workspace = Promise.resolve({});
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should show loading icon if get discover url is canceled", async () => {
            const workspace = Promise.resolve({ discoveryUrl: "testUrl" });
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const discoverUrls = Promise.resolve(undefined);
            const discoverUrlsSpy = jest.spyOn(DiscoveryService.prototype, "get");
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls);
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            await discoverUrls;
            expect(discoverUrlsSpy)
                .toBeCalledTimes(1);
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should dispose previous discover service", async () => {
            const workspace = Promise.resolve({ discoveryUrl: "testUrl" });
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const discoverUrls = Promise.resolve(undefined);
            const discoverUrlsSpy = jest.spyOn(DiscoveryService.prototype, "get");
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls);
            const discoverUrlsDisposeSpy = jest.spyOn(DiscoveryService.prototype, "dispose");
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            await discoverUrls;
            const discoverUrls2 = Promise.resolve(undefined);
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls2);
            tree.instance()
                .componentDidMount();
            await discoverUrls2;
            expect(discoverUrlsDisposeSpy)
                .toBeCalledTimes(1);
        });

        it("should show loading icon if get discover url return no history url", async () => {
            const workspace = Promise.resolve({ discoveryUrl: "testUrl" });
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const discoverUrls = Promise.resolve({ invalid: "http://runhistory.com" });
            const discoverUrlsSpy = jest.spyOn(DiscoveryService.prototype, "get");
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls);
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            await discoverUrls;
            expect(discoverUrlsSpy)
                .toBeCalledTimes(1);
            expect(tree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should dispose workspace service", async () => {
            const workspace = Promise.resolve(undefined);
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const workSpaceServiceDisposeSpy = jest.spyOn(WorkSpaceService.prototype, "dispose");
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            tree.instance()
                .componentWillUnmount();
            expect(workSpaceServiceDisposeSpy)
                .toBeCalledTimes(1);
        });

        it("should dispose discoverUrls service", async () => {
            const workspace = Promise.resolve({ discoveryUrl: "testUrl" });
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const discoverUrls = Promise.resolve({ invalid: "http://runhistory.com" });
            const discoverUrlsSpy = jest.spyOn(DiscoveryService.prototype, "get");
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls);
            const discoverUrlsDisposeSpy = jest.spyOn(DiscoveryService.prototype, "dispose");
            const tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            await discoverUrls;
            tree.instance()
                .componentWillUnmount();
            expect(discoverUrlsDisposeSpy)
                .toBeCalledTimes(1);
        });
    });
    describe("Loaded", () => {
        let tree: ShallowWrapper<IWorkspaceRouteProps, IMainState>;
        let context: IWorkspaceContextProps;
        beforeAll(async () => {
            const workspace = Promise.resolve({ discoveryUrl: "testUrl" });
            const tryGetWorkspaceSpy = jest.spyOn(WorkSpaceService.prototype, "tryGetWorkspace");
            tryGetWorkspaceSpy.mockReturnValueOnce(workspace);
            const discoverUrls = Promise.resolve({ history: "http://runhistory.com" });
            const discoverUrlsSpy = jest.spyOn(DiscoveryService.prototype, "get");
            discoverUrlsSpy.mockReturnValueOnce(discoverUrls);
            tree = shallow<Main>(<Main
                {...testContext}
            />);
            await workspace;
            await discoverUrls;
            context = tree.find(WorkspaceContext.Provider)
                .props()
                .value;
        });

        it("should load", async () => {
            expect(tree)
                .toMatchSnapshot();
        });

        it("should set header", async () => {
            const testHeader = "this is test header";
            context.setHeader(testHeader);
            expect(tree
                .find("div.app-container > header.app-header > h2")
                .text()
            )
                .toBe(testHeader);
        });

        describe("Error Handling", () => {
            const sampleError = {
                code: "111",
                name: "SampleError",
                message: "This is a test Error"
            };
            it("should log error", async () => {
                const instance = tree
                    .instance();
                if (instance.componentDidCatch) {
                    instance.componentDidCatch(sampleError, {
                        componentStack: "Main"
                    });
                }
                expect(tree.find(ErrorMessageBar).length)
                    .toBe(1);
                expect(
                    tree
                        .find(ErrorMessageBar)
                        .props()
                        .error
                        .error
                )
                    .toEqual(sampleError);
            });

            it("should consolidate same error", async () => {
                context.onError(sampleError);
                expect(tree.find(ErrorMessageBar).length)
                    .toBe(1);
                expect(
                    tree
                        .find(ErrorMessageBar)
                        .props()
                        .error
                        .count
                )
                    .toBe(2);
            });

            it("should add new error", async () => {
                context.onError({
                    code: "123",
                    name: "new error",
                    message: "This is a new error"
                });
                expect(tree.find(ErrorMessageBar).length)
                    .toBe(2);
            });

            it("should clear error", async () => {
                context.clearErrors();
                expect(tree.find(ErrorMessageBar).length)
                    .toBe(0);
            });
        });

        describe("Loading", () => {
            it("should show loading", () => {
                context.setLoading(true);
                expect(tree.find(ProgressIndicator).length)
                    .toBe(1);
            });
            it("should show loading when increasing loading items", () => {
                context.setLoading(true);
                expect(tree.find(ProgressIndicator).length)
                    .toBe(1);
            });
            it("should show loading if not decreased to 0", () => {
                context.setLoading(false);
                expect(tree.find(ProgressIndicator).length)
                    .toBe(1);
            });
            it("should not show loading if loading items 0", () => {
                context.setLoading(false);
                expect(tree.find(ProgressIndicator).length)
                    .toBe(0);
            });
        });

        describe("Buttons", () => {
            it("no buttons", () => {
                expect(tree.find(CommandBar).length)
                    .toBe(0);
            });
            it("no buttons", () => {
                context.setNavigationBarButtons([
                    {
                        key: "button 1",
                        text: "text 1",
                        iconProps: {
                            iconName: "Back"
                        },
                    }
                ],
                    [
                        {
                            key: "button 2",
                            text: "text 2",
                            iconProps: {
                                iconName: "Refresh"
                            },
                        }
                    ],
                    [
                        {
                            key: "button 3",
                            text: "text 3",
                            iconProps: {
                                iconName: "Checkbox"
                            },
                        }
                    ]);
                expect(tree.find("section.app-command-bar"))
                    .toMatchSnapshot();
            });
            it("remove buttons", () => {
                context.setNavigationBarButtons([], [], []);
                expect(tree.find(CommandBar).length)
                    .toBe(0);
            });
        });
    });
});
