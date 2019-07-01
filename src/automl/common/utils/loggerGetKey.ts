import { Region } from "./getRegion";

enum Geographies {
    Asia = "asia",
    Australia = "australia",
    Euap = "euap",
    Europe = "europe",
    UnitedStates = "unitedstates",
    Development = "development"
}

const instrumentationKeys: {
    [key: string]: string | undefined;
} = {
    [Geographies.Asia]: "6d8dfd01-1ce0-486c-905f-7ffe96403fba",
    [Geographies.Australia]: "6d8dfd01-1ce0-486c-905f-7ffe96403fba",
    [Geographies.Euap]: "780d5f6b-af1b-47b2-9130-dcbfbce9c90f",
    [Geographies.Europe]: "d8a12332-ff3d-48c8-a332-eba3203f9d21",
    [Geographies.UnitedStates]: "37bee233-bf42-415c-aaf3-2e3385a31175",
    [Geographies.Development]: "09ab9f4a-c812-418a-8ef7-36c860aa003e",
};

const regionToGeographyMapping: {
    [key in Region]: string | undefined;
} = {
    australiaeast: Geographies.Australia,
    australiasoutheast: Geographies.Australia,
    centralus: Geographies.UnitedStates,
    centraluseuap: Geographies.Euap,
    eastasia: Geographies.Asia,
    eastus: Geographies.UnitedStates,
    eastus2: Geographies.UnitedStates,
    eastus2euap: Geographies.Euap,
    northcentralus: Geographies.UnitedStates,
    northeurope: Geographies.Europe,
    southcentralus: Geographies.UnitedStates,
    southeastasia: Geographies.Asia,
    westcentralus: Geographies.UnitedStates,
    westeurope: Geographies.Europe,
    westus: Geographies.UnitedStates,
    westus2: Geographies.UnitedStates,
    development: Geographies.Development,
    test: Geographies.Development
};

export function loggerGetKey(region: Region): string | undefined {
    const geography = regionToGeographyMapping[region];
    const key = geography ? instrumentationKeys[geography] : undefined;
    return key;
}
