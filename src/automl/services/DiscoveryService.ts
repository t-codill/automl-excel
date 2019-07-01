import { AzureMachineLearningDiscoveryClient } from "@vienna/discovery";
import { IDictionary } from "../common/IDictionary";
import { IServiceBaseProps } from "./ServiceBase";
import { ServiceBaseNonArm } from "./ServiceBaseNonArm";

export class DiscoveryService extends ServiceBaseNonArm<AzureMachineLearningDiscoveryClient> {
    constructor(props: IServiceBaseProps, discoveryUrl: string) {
        super(props, AzureMachineLearningDiscoveryClient, discoveryUrl.replace(/\/?discovery\/?$/, ""));
    }

    public async get(): Promise<IDictionary<string> | undefined> {
        const response = await this.send(async (client, abortSignal) => {
            return client.get({
                abortSignal
            });
        });

        return response;
    }
}
