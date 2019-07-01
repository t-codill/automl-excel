import { shallow } from "enzyme";
import { ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { testContext } from "../../common/context/__data__/testContext";
import { PageNames } from "../../common/PageNames";
import { Logger } from "../../common/utils/logger";
import { BaseComponent } from "./BaseComponent";
import { BasePage } from "./BasePage";

jest.unmock("./BasePage");

const testButtons = {
    navigationBarButtons: [
        {
            key: "navigationBarButton1",
            text: "navigationBarButton1 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        },
        {
            key: "navigationBarButton2",
            text: "navigationBarButton2 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        }
    ],
    navigationBarFarButtons: [
        {
            key: "navigationBarFarButton1",
            text: "navigationBarFarButton1 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        },
        {
            key: "navigationBarFarButton2",
            text: "navigationBarFarButton2 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        }
    ],
    navigationBarOverflowButtons: [
        {
            key: "navigationBarOverflowButton1",
            text: "navigationBarOverflowButton1 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        },
        {
            key: "navigationBarOverflowButton2",
            text: "navigationBarOverflowButton2 Text",
            iconProps: {
                iconName: "TextDocument"
            },
            onClick: () => { return; }
        }
    ]
};

interface IBasePageTesterProps {
    autoRefreshInMs?: number;
    header?: string;
    noBackButton?: boolean;
    getData?(): Promise<void>;
}

class BasePageTester extends BasePage<IBasePageTesterProps, {}, {}> {

    public static onClick = () => { return; };
    protected readonly noBackButton: boolean = false;
    protected header: string | undefined;
    protected pageName: PageNames;
    protected getData?: () => Promise<void>;
    protected serviceConstructors = {};
    protected navigationBarButtons = testButtons.navigationBarButtons;
    protected navigationBarFarButtons = testButtons.navigationBarFarButtons;
    protected navigationBarOverflowButtons = testButtons.navigationBarOverflowButtons;
    constructor(props: IBasePageTesterProps) {
        super(props);
        this.autoRefreshInMs = props.autoRefreshInMs;
        this.getData = props.getData;
        this.header = props.header;
        this.pageName = PageNames.RunList;
        this.noBackButton = props.noBackButton || false;
    }
    public render(): React.ReactNode {
        return <div />;
    }
    public readonly callRefreshButtons = () => {
        this.refreshButtons();
    }
    public readonly callChangeAutoRefresh = (enable: boolean) => {
        this.changeAutoRefresh(enable);
    }
    public readonly getAutoRefreshEnabled = () => {
        return this.autoRefreshEnabled;
    }

}

describe("BasePage", () => {
    it("render with context", () => {
        const loggerSpy = jest.spyOn(Logger.prototype, "logPageView");
        shallow(<BasePageTester />);
        expect(loggerSpy)
            .toBeCalledWith("RunList", testContext);
    });
    it("render with header", () => {
        const setHeaderSpy = jest.spyOn(BaseComponent.prototype.context, "setHeader");
        shallow(<BasePageTester header="test header" />);
        expect(setHeaderSpy)
            .toBeCalledWith("test header");
    });
    it("base component component did mount should be called.", () => {
        const baseMountSpy = jest.spyOn(BaseComponent.prototype, "componentDidMount");
        shallow(<BasePageTester />);
        expect(baseMountSpy)
            .toBeCalledTimes(1);
    });
    it("should set buttons", () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        shallow(<BasePageTester />);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith([
                {
                    key: "Back",
                    text: "Back",
                    iconProps: {
                        iconName: "Back"
                    },
                    onClick: expect.anything(),
                },
                ...testButtons.navigationBarButtons
            ],
                testButtons.navigationBarOverflowButtons,
                testButtons.navigationBarFarButtons);
    });
    it("should have no back buttons", () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        shallow(<BasePageTester noBackButton={true} />);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith(
                testButtons.navigationBarButtons,
                testButtons.navigationBarOverflowButtons,
                testButtons.navigationBarFarButtons);
    });
    it("should set refresh ", () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        shallow(<BasePageTester getData={async () => { return; }} />);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith([
                {
                    key: "Back",
                    text: "Back",
                    iconProps: {
                        iconName: "Back"
                    },
                    onClick: expect.anything()
                },
                {
                    key: "Refresh",
                    text: "Refresh",
                    iconProps: {
                        iconName: "Refresh"
                    },
                    onClick: expect.anything()
                },
                ...testButtons.navigationBarButtons
            ],
                testButtons.navigationBarOverflowButtons,
                testButtons.navigationBarFarButtons);
    });
    it("should set refresh and auto refresh buttons", () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        const autoRefreshInMs = 30000;
        shallow(<BasePageTester getData={async () => { return; }} autoRefreshInMs={autoRefreshInMs} />);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith([
                {
                    key: "Back",
                    text: "Back",
                    iconProps: {
                        iconName: "Back"
                    },
                    onClick: expect.anything()
                },
                {
                    key: "Refresh",
                    text: "Refresh",
                    iconProps: {
                        iconName: "Refresh"
                    },
                    onClick: expect.anything()
                },
                ...testButtons.navigationBarButtons
            ],
                testButtons.navigationBarOverflowButtons,
                [
                    ...testButtons.navigationBarFarButtons,
                    {
                        key: "AutoRefresh",
                        text: `Auto refresh every ${(autoRefreshInMs / 1000)} seconds`,
                        iconProps: {
                            iconName: "Checkbox"
                        },
                        onClick: expect.anything()
                    }
                ]);
    });
    it("unmount will clear buttons", () => {
        const tree = shallow<BasePageTester>(<BasePageTester />);
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        tree.instance()
            .componentWillUnmount();
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith([], [], []);
    });
    it("unmount will clear errors", () => {
        const tree = shallow<BasePageTester>(<BasePageTester />);
        const clearErrorsSpy = jest.spyOn(BaseComponent.prototype.context, "clearErrors");
        tree.instance()
            .componentWillUnmount();
        expect(clearErrorsSpy)
            .toBeCalled();
    });
    it("unmount will call base unmount", () => {
        const tree = shallow<BasePageTester>(<BasePageTester />);
        const componentWillUnmountSpy = jest.spyOn(BaseComponent.prototype, "componentWillUnmount");
        tree.instance()
            .componentWillUnmount();
        expect(componentWillUnmountSpy)
            .toBeCalled();
    });
    it("refresh buttons will set buttons", () => {
        const tree = shallow<BasePageTester>(<BasePageTester />);
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        tree.instance()
            .callRefreshButtons();
        expect(setNavigationBarButtonsSpy)
            .toBeCalled();
    });
    it("change auto refresh to true should show check button", () => {
        const autoRefreshInMs = 30000;
        const tree = shallow<BasePageTester>(<BasePageTester getData={async () => { return; }} autoRefreshInMs={autoRefreshInMs} />);
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        tree.instance()
            .callChangeAutoRefresh(true);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith(
                expect.anything(),
                expect.anything(),
                [
                    ...testButtons.navigationBarFarButtons,
                    {
                        key: expect.anything(),
                        text: expect.anything(),
                        iconProps: {
                            iconName: "CheckboxComposite"
                        },
                        onClick: expect.anything()
                    }
                ]);
    });
    it("change auto refresh to false should remove check", () => {
        const autoRefreshInMs = 30000;
        const tree = shallow<BasePageTester>(<BasePageTester getData={async () => { return; }} autoRefreshInMs={autoRefreshInMs} />);
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        tree.instance()
            .callChangeAutoRefresh(false);
        expect(setNavigationBarButtonsSpy)
            .toBeCalledWith(
                expect.anything(),
                expect.anything(),
                [
                    ...testButtons.navigationBarFarButtons,
                    {
                        key: expect.anything(),
                        text: expect.anything(),
                        iconProps: {
                            iconName: "Checkbox"
                        },
                        onClick: expect.anything()
                    }
                ]);
    });

    it("should go back", () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        const autoRefreshInMs = 30000;
        const tree = shallow<BasePageTester>(<BasePageTester getData={async () => { return; }} autoRefreshInMs={autoRefreshInMs} />);
        const buttons: ICommandBarItemProps[] = setNavigationBarButtonsSpy.mock.calls[0][0];
        const backButton: ICommandBarItemProps | undefined = buttons.find((b) => b.key === "Back");
        if (backButton && backButton.onClick) {
            backButton.onClick(reactMouseEvent);
        }
        expect(tree.state().goBack)
            .toEqual(true);
    });

    it("should refresh", (done) => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        const props = {
            getData: async (): Promise<void> => { return; },
            autoRefreshInMs: 3000
        };
        const getDataSpy = jest.spyOn(props, "getData");
        getDataSpy.mockReturnValueOnce(Promise.resolve(undefined));
        shallow<BasePageTester>(<BasePageTester {...props} />);
        const buttons: ICommandBarItemProps[] = setNavigationBarButtonsSpy.mock.calls[0][0];
        const refreshButton: ICommandBarItemProps | undefined = buttons.find((b) => b.key === "Refresh");
        getDataSpy.mockReturnValueOnce(Promise.resolve(undefined));
        getDataSpy.mockClear();
        if (refreshButton && refreshButton.onClick) {
            refreshButton.onClick(reactMouseEvent);
        }
        setImmediate(() => {
            expect(getDataSpy)
                .toBeCalledTimes(1);
            done();
        });
    });

    it("should auto refresh", async () => {
        const setNavigationBarButtonsSpy = jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons");
        const props = {
            getData: async (): Promise<void> => { return; },
            autoRefreshInMs: 3000
        };
        const tree = shallow<BasePageTester>(<BasePageTester {...props} />);
        const buttons: ICommandBarItemProps[] = setNavigationBarButtonsSpy.mock.calls[0][2];
        const autoRefreshButton: ICommandBarItemProps | undefined = buttons.find((b) => b.key === "AutoRefresh");
        if (autoRefreshButton && autoRefreshButton.onClick) {
            autoRefreshButton.onClick(reactMouseEvent);
        }
        expect(tree.instance()
            .getAutoRefreshEnabled())
            .toBe(true);
        if (autoRefreshButton && autoRefreshButton.onClick) {
            autoRefreshButton.onClick(reactMouseEvent);
        }
        expect(tree.instance()
            .getAutoRefreshEnabled())
            .toBe(false);
    });
});
