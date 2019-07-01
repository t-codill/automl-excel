import { ICommandBarItemProps } from "office-ui-fabric-react";
import { IComponentWithRoute } from "../../common/IComponentWithRoute";
import { PageNames } from "../../common/PageNames";
import { BaseComponent } from "./BaseComponent";

export interface IBackButton<TRouteProp> {
    component: IComponentWithRoute<TRouteProp>;
    routeProps: Readonly<TRouteProp>;
    text: string;
}

export interface IBasePageState {
    goBack: boolean;
}

export abstract class BasePage<
    TProps,
    TState,
    TServices extends {
        [key: string]: {
            dispose(): void;
            reset(): void;
        };
    }> extends BaseComponent<TProps, Exclude<TState, IBasePageState> & IBasePageState, TServices>{

    protected readonly abstract header: string | undefined;
    protected readonly abstract pageName: PageNames;
    protected readonly noBackButton: boolean = false;
    protected readonly navigationBarButtons: ICommandBarItemProps[] = [];
    protected readonly navigationBarOverflowButtons: ICommandBarItemProps[] = [];
    protected readonly navigationBarFarButtons: ICommandBarItemProps[] = [];

    private buttons!: ICommandBarItemProps[];
    private overflowButtons!: ICommandBarItemProps[];
    private farButtons!: ICommandBarItemProps[];

    private autoRefreshButton!: ICommandBarItemProps;

    public async componentDidMount(): Promise<void> {
        this.context.setPageName(this.pageName);
        this.context.logger.logPageView(this.pageName, this.context);
        this.buttons = [...this.navigationBarButtons];
        this.overflowButtons = [...this.navigationBarOverflowButtons];
        this.farButtons = [...this.navigationBarFarButtons];
        if (this.getData) {
            if (this.autoRefreshInMs) {
                this.autoRefreshButton = {
                    key: "AutoRefresh",
                    text: `Auto refresh every ${(this.autoRefreshInMs / 1000)} seconds`,
                    iconProps: {
                        iconName: "Checkbox"
                    },
                    onClick: this.autoRefreshClicked
                };
                this.farButtons.push(this.autoRefreshButton);
            }
            this.buttons.unshift(
                {
                    key: "Refresh",
                    text: "Refresh",
                    iconProps: {
                        iconName: "Refresh"
                    },
                    onClick: this.refreshClicked
                });
        }
        if (!this.noBackButton) {
            this.buttons.unshift(
                {
                    key: "Back",
                    text: "Back",
                    iconProps: {
                        iconName: "Back"
                    },
                    onClick: this.goBack,
                });
        }
        this.context.setNavigationBarButtons(this.buttons, this.overflowButtons, this.farButtons);
        this.context.setHeader(this.header);
        await super.componentDidMount();
    }

    public componentWillUnmount(): void {
        this.context.setNavigationBarButtons([], [], []);
        this.context.clearErrors();
        super.componentWillUnmount();
    }

    protected readonly refreshButtons = () => {
        this.context.setNavigationBarButtons(this.buttons, this.overflowButtons, this.farButtons);
    }

    protected readonly changeAutoRefresh = (enable: boolean) => {
        this.autoRefreshButton.iconProps = {
            iconName: enable ? "CheckboxComposite" : "Checkbox"
        };
        this.refreshButtons();
        super.changeAutoRefresh(enable);
    }

    private readonly goBack = () => {
        this.setState((prev) => {
            return { ...prev, goBack: true };
        });
    }

    private readonly refreshClicked = () => {
        this.refresh();
    }

    private readonly autoRefreshClicked = () => {
        this.changeAutoRefresh(!this.autoRefreshEnabled);
    }
}
