import { ServiceClient, ServiceClientOptions, TokenCredentials } from "@azure/ms-rest-js";
//import { XhrHttpClient } from "@azure/ms-rest-js/es/lib/xhrHttpClient";
import { IServiceClient } from "./IServiceClient";
import { IServiceBaseProps, ServiceBase } from "./ServiceBase";
import { ServiceNoArmRequestPolicyFactories } from "./ServiceNoArmRequestPolicyFactories";
//import { XhrHttpClient } from '@azure/ms-rest-js'

export abstract class ServiceBaseNonArm<TClient extends ServiceClient & IServiceClient> extends ServiceBase<TClient> {
    constructor(props: IServiceBaseProps, clientInitializer: new (cred: TokenCredentials, option: ServiceClientOptions & { baseUri: string | undefined }) => TClient, baseUri?: string) {
        super(props, new clientInitializer(new TokenCredentials(props.getToken()), {
            baseUri,
            requestPolicyFactories: ServiceNoArmRequestPolicyFactories(props.logger),
        }));
    }
}
