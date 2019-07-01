import { SubscriptionClient, SubscriptionModels } from "@azure/arm-subscriptions";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class SubscriptionService extends ServiceBaseNonArm<SubscriptionClient> {
    constructor(props: IServiceBaseProps) {
        console.log('constructor called');
        super(props, SubscriptionClient);
        console.log('constructor done');
    }

    public async listSubscriptions(): Promise<SubscriptionModels.Subscription[] | undefined> {
        console.log('listing subscriptions');
        return this.send(async (client, abortSignal) => {
            return client.subscriptions.list({ abortSignal });
        });
    }
}
