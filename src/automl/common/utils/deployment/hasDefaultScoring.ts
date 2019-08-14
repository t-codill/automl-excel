import { RunHistoryAPIsModels } from "@vienna/runhistory";
import { getDataPrepFeatures } from "./getDataPrepFeatures";

export const hasDefaultScoring = (
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined,
    scoringUri: string | undefined | null
) => {
    const dataPrepFeatures = getDataPrepFeatures(parentRun);
    return dataPrepFeatures || scoringUri;
};
