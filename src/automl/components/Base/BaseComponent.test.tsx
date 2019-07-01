import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { RunHistoryService } from "../../services/RunHistoryService";
import { BaseComponent } from "./BaseComponent";

jest.unmock("./BaseComponent");
jest.mock("../../services/RunHistoryService");

interface IBaseComponentTesterProps {
    autoRefreshInMs?: number;
    getData?(): Promise<void>;
}
class BaseComponentTester extends BaseComponent<IBaseComponentTesterProps, { testState: boolean }, { history: RunHistoryService }> {
    protected getData?: () => Promise<void>;
    protected serviceConstructors = { history: RunHistoryService };
    constructor(props: IBaseComponentTesterProps) {
        super(props);
        this.autoRefreshInMs = props.autoRefreshInMs;
        this.getData = props.getData;
    }
    public render(): React.ReactNode {
        return <div />;
    }

    public changeAutoRefresh(enable: boolean): void {
        super.changeAutoRefresh(enable);
    }

    public getAutoRefreshEnabled(): boolean | undefined {
        return this.autoRefreshEnabled;
    }

    public getServices(): { history: RunHistoryService } {
        return this.services;
    }
}

describe("BaseComponent", () => {
    it("render", () => {
        const tree = shallow(<BaseComponentTester />);
        expect(tree)
            .toMatchSnapshot();
    });

    describe("refresh", () => {

        let setTimeoutSpy: jest.SpyInstance<ReturnType<Window["setTimeout"]>>;
        let clearTimeoutSpy: jest.SpyInstance<ReturnType<Window["clearTimeout"]>>;
        let refreshFunction: (() => Promise<void>) | undefined;
        beforeEach(() => {
            refreshFunction = undefined;
            setTimeoutSpy = jest.spyOn(window, "setTimeout");
            setTimeoutSpy.mockImplementation((func: () => Promise<void>) => {
                refreshFunction = func;
                return 1;
            });
            clearTimeoutSpy = jest.spyOn(window, "clearTimeout");
            clearTimeoutSpy.mockImplementation(() => {
                return;
            });
        });
        it("should not change auto refresh is autoRefreshInMs is not set", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester />);
            tree.instance()
                .changeAutoRefresh(true);
            expect(setTimeoutSpy)
                .toBeCalledTimes(0);
        });
        it("should set auto refresh", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester autoRefreshInMs={30000} />);
            tree.instance()
                .changeAutoRefresh(true);
            expect(setTimeoutSpy)
                .toBeCalledTimes(1);
        });
        it("should not set auto refresh is unmounted", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester autoRefreshInMs={30000} />);
            tree.instance()
                .componentWillUnmount();
            tree.instance()
                .changeAutoRefresh(true);
            expect(setTimeoutSpy)
                .toBeCalledTimes(0);
        });
        it("should disable auto refresh", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester autoRefreshInMs={30000} />);
            tree.instance()
                .changeAutoRefresh(true);
            setTimeoutSpy.mockClear();
            clearTimeoutSpy.mockClear();
            tree.instance()
                .changeAutoRefresh(false);
            expect(setTimeoutSpy)
                .toBeCalledTimes(0);
            expect(clearTimeoutSpy)
                .toBeCalledTimes(1);
            expect(tree.instance()
                .getAutoRefreshEnabled())
                .toBe(false);
        });
        it("should clear timeout when unload", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester autoRefreshInMs={30000} />);
            tree.instance()
                .changeAutoRefresh(true);
            setTimeoutSpy.mockClear();
            clearTimeoutSpy.mockClear();
            tree.instance()
                .componentWillUnmount();
            expect(clearTimeoutSpy)
                .toBeCalledTimes(1);
        });

        describe("refresh", () => {
            it("should set loading and call get data in refresh", (done) => {
                const props = {
                    autoRefreshInMs: 30000,
                    async getData(): Promise<void> { return; }
                };
                const setLoadingSpy = jest.spyOn(BaseComponent.prototype.context, "setLoading");
                const getDataSpy = jest.spyOn(props, "getData");
                shallow<BaseComponentTester>(<BaseComponentTester {...props} />);
                setImmediate(() => {
                    expect(getDataSpy)
                        .toBeCalledTimes(1);
                    expect(setLoadingSpy)
                        .toBeCalledTimes(2);
                    done();
                });
            });
            it("should clear timeout and set new timeout if auto refresh is enabled", async (done) => {
                const props = {
                    autoRefreshInMs: 30000,
                    async getData(): Promise<void> { return; }
                };
                const tree = shallow<BaseComponentTester>(<BaseComponentTester {...props} />);
                tree.instance()
                    .changeAutoRefresh(true);
                setImmediate(async () => {
                    clearTimeoutSpy.mockClear();
                    setTimeoutSpy.mockClear();
                    if (refreshFunction) {
                        refreshFunction();
                    }
                    setImmediate(() => {
                        expect(clearTimeoutSpy)
                            .toBeCalledTimes(1);
                        expect(setTimeoutSpy)
                            .toBeCalledTimes(1);
                        done();
                    });
                });
            });
            it("unmount component should not refresh", (done) => {
                const props = {
                    autoRefreshInMs: 30000,
                    async getData(): Promise<void> { return; }
                };
                const tree = shallow<BaseComponentTester>(<BaseComponentTester {...props} />);
                tree.instance()
                    .changeAutoRefresh(true);
                tree.instance()
                    .componentWillUnmount();
                const getDataSpy = jest.spyOn(props, "getData");
                if (refreshFunction) {
                    refreshFunction();
                }
                setImmediate(() => {
                    expect(getDataSpy)
                        .toBeCalledTimes(0);
                    done();
                });
            });
        });
    });
    describe("services", () => {
        let runHistoryServiceDisposeSpy: jest.SpyInstance<ReturnType<RunHistoryService["dispose"]>>;
        beforeEach(() => {
            runHistoryServiceDisposeSpy = jest.spyOn(RunHistoryService.prototype, "dispose");
        });
        it("should create service", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester />);
            expect(tree.instance()
                .getServices().history)
                .toBeDefined();
        });
        it("should dispose service", () => {
            const tree = shallow<BaseComponentTester>(<BaseComponentTester />);
            tree.instance()
                .componentWillUnmount();
            expect(runHistoryServiceDisposeSpy)
                .toBeCalledTimes(1);
        });
    });

    describe("setState", () => {
        let tree: ShallowWrapper<BaseComponentTester["props"], BaseComponentTester["state"], BaseComponentTester>;
        beforeAll(() => {
            tree = shallow<BaseComponentTester>(<BaseComponentTester />);
        });
        it("init state is undefined", () => {
            expect(tree.state())
                .toBeNull();
        });
        it("should setState", () => {
            tree.instance()
                .setState({ testState: true });
            expect(tree.state())
                .toEqual({ testState: true });
        });
        it("should not setState after unload", () => {
            tree.instance()
                .componentWillUnmount();
            tree.instance()
                .setState({ testState: false });
            expect(tree.state())
                .toEqual({ testState: true });
        });
    });
});
