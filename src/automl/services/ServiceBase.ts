import { TokenCredentials } from "@azure/ms-rest-js";
import { map } from "lodash";
import { IWorkspaceProps, WorkspaceError } from "../common/context/IWorkspaceProps";
import { ILogger } from "../common/utils/ILogger";
import { parallelCall } from "../common/utils/parallelCall";
import { IServiceClient } from "./IServiceClient";

export interface IServiceBaseProps extends IWorkspaceProps {
    logger: ILogger;
    onError(err: WorkspaceError): void;
}

export abstract class ServiceBase<TClient extends IServiceClient> {

    protected props: IServiceBaseProps;
    private readonly client: TClient;
    // this should be the only place to use abort controller
    // tslint:disable-next-line:ban-types
    private controller: AbortController;
    private disposed = false;
    constructor(props: IServiceBaseProps, client: TClient) {
        this.client = client;
        this.props = props;
        this.controller = new AbortController();
    }

    public dispose(): void {
        if (!this.controller.signal.aborted) {
            this.controller.abort();
        }
        this.disposed = true;
    }

    public reset(): void {
        if (this.disposed) {
            return;
        }
        this.controller.abort();
        this.controller = new AbortController();
    }

    protected async getAllValuesWithContinuationToken<T>(getFunc: (client: TClient, abortSignal: AbortSignal, continuationToken: string | undefined) => Promise<
        {
            value?: T[];
            continuationToken?: string;
        }>): Promise<T[] | undefined> {
        return this.getAllWithContinuationToken(true, getFunc, (res) => res.value);
    }

    protected async parallelGetAllValues<T, TData>(
        data: TData[],
        getFunc: (
            d: TData,
            client: TClient,
            abortSignal: AbortSignal
        ) => Promise<T>,
        concurrent = 7
    ): Promise<T[] | undefined> {
        let cancelled = false;
        const allRuns = await parallelCall(
            map(data,
                (d: TData) => {
                    return async () => {
                        const response = await this.send(async (client: TClient, abortSignal: AbortSignal) => {
                            return getFunc(d, client, abortSignal);
                        }, false);

                        if (!response) {
                            cancelled = true;
                            return response as T;
                        }
                        return response;
                    };
                }
            ),
            concurrent);
        if (cancelled) {
            return undefined;
        }
        return allRuns;
    }

    protected async parallelGetAllValuesWithContinuationToken<T, TData>(
        data: TData[],
        getFunc: (
            d: TData,
            client: TClient,
            abortSignal: AbortSignal,
            continuationToken: string | undefined
        ) => Promise<
            {
                value?: T[];
                continuationToken?: string;
            }>,
        concurrent = 7
    ): Promise<T[][] | undefined> {

        let cancelled = false;
        const allRuns = await parallelCall(
            map(data,
                (d: TData) => {
                    return async () => {
                        const response = await this.getAllWithContinuationToken(false, async (client: TClient, abortSignal: AbortSignal, continuationToken: string | undefined) => {
                            return getFunc(d, client, abortSignal, continuationToken);
                        }, (res) => res.value);

                        if (!response) {
                            cancelled = true;
                            return [] as T[];
                        }
                        return response;
                    };
                }
            ), concurrent);
        if (cancelled) {
            return undefined;
        }
        return allRuns;
    }

    protected async getAllWithNext<T, TResponse, TToken>(
        getFunc: (client: TClient, abortSignal: AbortSignal) => Promise<TResponse | undefined>,
        getWithNextFunc: (client: TClient, abortSignal: AbortSignal, continuationToken: TToken) => Promise<TResponse | undefined>,
        getValueFunc: (res: TResponse) => T[] | undefined,
        getNextFunc: (res: TResponse) => TToken | undefined
    ): Promise<T[] | undefined> {

        return this.getAll(true, getFunc, getWithNextFunc, getValueFunc, getNextFunc);
    }

    protected async send<T>(action: (c: TClient, signal: AbortSignal) => Promise<T>, resetAbortController = true): Promise<T | undefined> {
        const value = this.baseSend(action, resetAbortController, false);
        return value;
    }

    protected async trySend<T>(action: (c: TClient, signal: AbortSignal) => Promise<T>, resetAbortController = true): Promise<T | null | undefined> {
        return this.baseSend(action, resetAbortController, true);
    }

    private async baseSend<T>(action: (c: TClient, signal: AbortSignal) => Promise<T>, resetAbortController: boolean, ignore404: true): Promise<T | undefined | null>;
    private async baseSend<T>(action: (c: TClient, signal: AbortSignal) => Promise<T>, resetAbortController: boolean, ignore404: false): Promise<T | undefined>;
    private async baseSend<T>(action: (c: TClient, signal: AbortSignal) => Promise<T>, resetAbortController: boolean, ignore404: boolean)
        : Promise<T | undefined | null> {
        try {
            if (this.controller.signal.aborted) {
                return undefined;
            }
            if (resetAbortController) {
                this.reset();
            }
            if (this.client && this.client.credentials && (this.client.credentials as TokenCredentials).token) {
                (this.client.credentials as TokenCredentials).token = this.props.getToken();
            }
            return await action(this.client, this.controller.signal);
        }
        catch (err) {
            if (err.code === "REQUEST_ABORTED_ERROR") {
                return undefined;
            }
            if (err.statusCode === 404) {
                if (ignore404) {
                    return null;
                }
            }
            this.props.logger.logError(err, this.props);
            this.props.onError(err);
            return undefined;
        }
    }

    private async getAll<T, TResponse, TToken>(
        resetAbortController: boolean,
        getFunc: (client: TClient, abortSignal: AbortSignal) => Promise<TResponse | undefined>,
        getWithNextFunc: (client: TClient, abortSignal: AbortSignal, continuationToken: TToken) => Promise<TResponse | undefined>,
        getValueFunc: (res: TResponse) => T[] | undefined,
        getNextFunc: (res: TResponse) => TToken | undefined
    ): Promise<T[] | undefined> {
        let continuationToken: TToken | undefined;
        let returnValue: T[] = [];
        do {
            const response = await this.getByToken(continuationToken, resetAbortController, getFunc, getWithNextFunc);
            if (!response) {
                // cancelled;
                return undefined;
            }
            continuationToken = getNextFunc(response);
            const value = getValueFunc(response);
            if (value) {
                returnValue = [...returnValue, ...value];
            }
        } while (continuationToken);

        return returnValue;
    }
    private async getByToken<TResponse, TToken>(
        continuationToken: TToken | undefined,
        resetAbortController: boolean,
        getFunc: (client: TClient, abortSignal: AbortSignal) => Promise<TResponse | undefined>,
        getWithNextFunc: (client: TClient, abortSignal: AbortSignal, continuationToken: TToken) => Promise<TResponse | undefined>
    ): Promise<TResponse | undefined> {
        return continuationToken ?
            this.send(async (client, signal) => getWithNextFunc(client, signal, continuationToken), resetAbortController)
            : this.send(getFunc, resetAbortController);
    }

    private async getAllWithContinuationToken<T, TResponse extends
        {
            continuationToken?: TToken;
        }, TToken>(
            resetAbortController: boolean,
            getFunc: (client: TClient, abortSignal: AbortSignal, continuationToken: TToken | undefined) => Promise<TResponse | undefined>,
            getValueFunction: (res: TResponse) => T[] | undefined
        ): Promise<T[] | undefined> {
        return this.getAll(
            resetAbortController,
            async (client: TClient, abortSignal: AbortSignal) => getFunc(client, abortSignal, undefined),
            getFunc,
            getValueFunction,
            (res) => res.continuationToken);
    }

}
