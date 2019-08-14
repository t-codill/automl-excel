import { mapValues } from "lodash";
import { BasicTypes } from "../../common/BasicTypes";
import { IDictionary } from "../../common/IDictionary";
import { IServiceBaseProps } from "../../services/ServiceBase";
import { BaseComponentContext } from "./BaseComponentContext";

export abstract class BaseComponent<
    TProp,
    TState,
    TServices extends {
        [key: string]: {
            dispose(): void;
            reset(): void;
        };
    }> extends BaseComponentContext<TProp, TState> {

    protected get autoRefreshEnabled(): boolean | undefined {
        return this._autoRefreshEnabled;
    }

    protected set autoRefreshEnabled(flag: boolean | undefined) {
        this._autoRefreshEnabled = flag;
    }

    protected services!: { [key in keyof TServices]: TServices[key] };

    protected abstract readonly serviceConstructors: { [key in keyof TServices]: (new (context: IServiceBaseProps, props: TProp) => TServices[key]) };

    protected abstract readonly getData?: () => Promise<void>;

    protected autoRefreshInMs: number | undefined;

    protected refreshTimeOut: number | undefined;

    private mounted = false;
    private _autoRefreshEnabled: boolean | undefined;

    constructor(props: TProp) {
        super(props);
        this.setState = this.setState.bind(this);
        this.refresh = this.refresh.bind(this);
        this.changeAutoRefresh = this.changeAutoRefresh.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.mounted = true;
        this.services = mapValues(this.serviceConstructors, (cons) => {
            return new cons(this.context, this.props);
        }) as { [key in keyof TServices]: TServices[key] };
        await this.refresh();
    }

    public componentWillUnmount(): void {
        this.mounted = false;
        if (this.refreshTimeOut) {
            clearTimeout(this.refreshTimeOut);
        }
        Object.keys(this.services)
            .forEach((key) => {
                this.services[key].dispose();
            });
    }

    public setState<K extends keyof TState>(
        state: ((prevState: Readonly<TState>, props: Readonly<TProp>) => (Pick<TState, K> | TState | null)) | (Pick<TState, K> | TState | null),
        callback?: () => void
    ): void {
        if (this.mounted) {
            super.setState(state, callback);
        }
    }

    protected logUserAction(component: string, properties?: IDictionary<BasicTypes>): void {
        this.context.logger.logCustomEvent(
            `${this.context.pageName}_${component}_UserAction`,
            this.context,
            {
                ...properties,
                pageName: this.context.pageName,
                component
            }
        );
    }

    protected async refresh(): Promise<void> {
        if (!this.mounted) {
            return;
        }
        if (this.getData) {
            if (this.refreshTimeOut) {
                clearTimeout(this.refreshTimeOut);
            }
            this.resetService();
            this.context.setLoading(true);
            await this.getData();
            this.context.setLoading(false);
            if (this.mounted && this._autoRefreshEnabled && this.autoRefreshInMs) {
                this.refreshTimeOut = window.setTimeout(this.refresh.bind(this), this.autoRefreshInMs);
            }
        }
    }

    protected changeAutoRefresh(enable: boolean): void {
        if (!this.autoRefreshInMs) {
            return;
        }
        if (this.refreshTimeOut) {
            clearTimeout(this.refreshTimeOut);
        }
        if (!this.mounted) {
            return;
        }
        if (enable) {
            this.refreshTimeOut = window.setTimeout(this.refresh.bind(this), this.autoRefreshInMs);
        }
        this._autoRefreshEnabled = enable;
    }

    private resetService(): void {
        Object.keys(this.services)
            .forEach((key) => {
                this.services[key].reset();
            });
    }
}
