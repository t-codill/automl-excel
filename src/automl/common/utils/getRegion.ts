import { getEnv } from "./getEnv";

export type Region =
    "development"
    | "test"
    | "australiaeast"
    | "australiasoutheast"
    | "centralus"
    | "centraluseuap"
    | "eastasia"
    | "eastus"
    | "eastus2"
    | "eastus2euap"
    | "northcentralus"
    | "northeurope"
    | "southcentralus"
    | "southeastasia"
    | "westcentralus"
    | "westeurope"
    | "westus"
    | "westus2";

export const getRegion = () => {
    const env = getEnv();
    switch (env) {
        case "production":
            return "##VIENNA_ENVIRONMENT##" as Region;
        case "development":
            return "development";
        default:
            return "test";
    }
};
