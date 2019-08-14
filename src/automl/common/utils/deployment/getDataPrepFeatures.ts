import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { safeParseJson } from "../safeParseJson";

export const getDataPrepFeatures = (
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined,
) => {
    const dataPrepJson = parentRun && parentRun.properties && parentRun.properties.DataPrepJsonString;
    if (!dataPrepJson) {
        return undefined;
    }

    const dataPrep = safeParseJson(safeParseJson(`"${dataPrepJson}"`));
    if (!dataPrep || !dataPrep.features) {
        return undefined;
    }

    return dataPrep.features;
};
