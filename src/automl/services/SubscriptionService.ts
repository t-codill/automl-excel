import { SubscriptionClient, SubscriptionModels } from "@azure/arm-subscriptions";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class SubscriptionService extends ServiceBaseNonArm<SubscriptionClient> {
    constructor(props: IServiceBaseProps) {
        super(props, SubscriptionClient);
    }

    public async listSubscriptions(): Promise<SubscriptionModels.Subscription[] | undefined> {
        return this.send(async (client, abortSignal) => {
            return client.subscriptions.list({ abortSignal });
        });
    }
}
