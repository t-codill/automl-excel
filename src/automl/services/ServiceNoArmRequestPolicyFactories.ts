import { RequestPolicy, RequestPolicyFactory, RequestPolicyOptions } from "@azure/ms-rest-js";
import { ILogger } from "../common/utils/ILogger";
import { ServiceNoArmRequestPolicy } from "./ServiceNoArmRequestPolicy";

const serviceNoArmRequestPolicyFactories = (logger: ILogger) => {
    const loggerClosure: ILogger = logger;
    return (defaultRequestPolicyFactories: RequestPolicyFactory[]) => {
        return [
            {
                create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
                    return new ServiceNoArmRequestPolicy(nextPolicy, options, loggerClosure);
                }
            },
            ...defaultRequestPolicyFactories
        ];
    };
};
export { serviceNoArmRequestPolicyFactories as ServiceNoArmRequestPolicyFactories };
