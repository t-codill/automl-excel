import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { defaultSdkVersion } from "../defaultSdkVersion";
import { safeParseJson } from "./safeParseJson";

export const getSdkVersion = (
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined,
    defaultVersion: string = defaultSdkVersion
) => {
    if (!run || !run.properties || !run.properties.dependencies_versions) {
        return defaultVersion;
    }
    const dependenciesVersions = safeParseJson(run.properties.dependencies_versions);
    if (!dependenciesVersions
        || !dependenciesVersions["azureml-train-automl"]) {
        return defaultVersion;
    }
    return dependenciesVersions["azureml-train-automl"];
};
