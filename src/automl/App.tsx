import { AzureCustomizationsDark, AzureCustomizationsLight } from "@uifabric/azure-themes";
import { Customizer } from "office-ui-fabric-react";
import * as React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { BaseContext } from "./common/context/BaseContext";
import { WorkspaceFlight } from "./common/context/WorkspaceFlight";
import { PageNames } from "./common/PageNames";
import { getEnv } from "./common/utils/getEnv";
import { getRegion } from "./common/utils/getRegion";
import { Logger } from "./common/utils/logger";
import { PageLoadingSpinner } from "./components/Progress/PageLoadingSpinner";
import { BaseRoute, DefaultRoute } from "./components/Redirect/PageRoute";
import { Main } from "./Main";
import { NotFound } from "./notFound/NotFound";
import { AuthenticationService } from "./services/AuthenticationService";
import { SubscriptionList } from "./subscriptionList/SubscriptionList";
import { WorkspaceList } from "./workspaceList/WorkspaceList";

export enum MessageKind {
    Ready = "ready",
    Error = "error",
    GetAuthContext = "getAuthContext",
    GetAuthContextResponse = "getAuthContextResponse",
    Theme = "theme"
}

export enum MessageSignature {
    FxFrameBlade = "FxFrameBlade"
}

export interface IWindowMessage {
    data: {
        armToken?: string;
        themeName?: string;
    };
    kind: MessageKind;
    signature: MessageSignature;
}

interface IAppData {
    token: string;
    flight: WorkspaceFlight;
    theme: string;
    pageName: PageNames;
}

export class App extends React.Component<{}, IAppData> {
    private refreshTokenTimeout: number | undefined;
    private readonly logger: Logger;
    public constructor(props: {}) {
        super(props);
        this.logger = new Logger(getRegion());
        const search = new URLSearchParams(window.location.search);
        this.state = {
            token: "",
            flight: new WorkspaceFlight(search.get("flight") || ""),
            theme: "light",
            pageName: PageNames.Unknown
        };
    }

    public componentDidMount(): void {
        this.init();
    }

    public componentWillUnmount(): void {
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
    }

    public render(): React.ReactNode {
        if (!this.state || !this.state.token) {
            return <PageLoadingSpinner />;
        }

        let customizations = AzureCustomizationsLight;
        if (this.state.theme === "dark") {
            customizations = AzureCustomizationsDark;
        }

        const context = {
            logger: this.logger,
            getToken: this.getToken,
            flight: this.state.flight,
            theme: this.state.theme,
            pageName: this.state.pageName,
            setPageName: this.setPageName,
        };
        return <div id="theme" className={this.state.theme}>
            <Customizer {...customizations}>
                <BaseContext.Provider value={context}>
                    <BrowserRouter basename="automl">
                        <Switch>
                            {BaseRoute(SubscriptionList)}
                            {BaseRoute(WorkspaceList)}
                            {DefaultRoute(Main)}
                            {BaseRoute(NotFound)}
                        </Switch>
                    </BrowserRouter>
                </BaseContext.Provider>
            </Customizer>
        </div>;
    }

    private readonly setPageName = (value: PageNames) => {
        this.setState({ pageName: value });
    }

    private readonly getToken = () => {
        return this.state.token;
    }

    private init(): void {
        window.addEventListener("message", this.messageHandler);
        const readyMessage: IWindowMessage = {
            data: {},
            kind: MessageKind.Ready,
            signature: MessageSignature.FxFrameBlade
        };
        window.parent.postMessage(readyMessage, "*");
        const themeMessage: IWindowMessage = {
            data: {},
            kind: MessageKind.Theme,
            signature: MessageSignature.FxFrameBlade
        };
        window.parent.postMessage(themeMessage, "*");
        this.refreshToken();
    }
    private readonly messageHandler = (event: MessageEvent) => {
        const response = event.data as IWindowMessage;
        if (!response) {
            return;
        }
        if (response.signature !== MessageSignature.FxFrameBlade) {
            return;
        }
        switch (response.kind) {
            case MessageKind.Error:
                throw new Error(`Error from parent window:  ${JSON.stringify(response)}`);
            case MessageKind.GetAuthContextResponse:
                if (response.data.armToken) {
                    this.setState({ token: response.data.armToken });
                }
                break;
            case MessageKind.Theme:
                if (response.data.themeName) {
                    this.setTheme(response.data.themeName);
                }
                break;
            default:
                return;
        }
    }

    private readonly refreshToken = async (): Promise<void> => {
        const env = getEnv();
        if (env === "development") {
            const token = await AuthenticationService.getToken();
            if (token) {
                const message: IWindowMessage = {
                    kind: MessageKind.GetAuthContextResponse,
                    data: {
                        armToken: token
                    },
                    signature: MessageSignature.FxFrameBlade
                };
                window.postMessage(message, "*");
            }
        }
        else {
            const getAuthContextMessage: IWindowMessage = {
                data: {},
                kind: MessageKind.GetAuthContext,
                signature: MessageSignature.FxFrameBlade
            };
            window.parent.postMessage(getAuthContextMessage, "*");
        }
        if (this.refreshTokenTimeout) {
            clearTimeout(this.refreshTokenTimeout);
        }
        this.refreshTokenTimeout = window.setTimeout(this.refreshToken, 60000);
    }

    private readonly setTheme = (theme: string) => {
        if (theme === "dark") {
            this.setState({ theme: "dark" });
        } else {
            this.setState({ theme: "light" });
        }
    }
}
