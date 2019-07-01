import { ServiceClient, ServiceClientOptions, TokenCredentials } from "@azure/ms-rest-js";
import { IServiceClient } from "./IServiceClient";
import { IServiceBaseProps, ServiceBase } from "./ServiceBase";

export abstract class ServiceBaseArm<TClient extends ServiceClient & IServiceClient> extends ServiceBase<TClient> {
    constructor(props: IServiceBaseProps, clientInitializer: new (cred: TokenCredentials, subscriptionId: string, option?: ServiceClientOptions) => TClient) {
        super(props, new clientInitializer(new TokenCredentials(props.getToken()), props.subscriptionId, {
            noRetryPolicy: true
        }));
    }
}
