import { RunHistoryAPIsModels } from "@vienna/runhistory";

export const getCondaFileFromTemplate = (
    run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined
): string | undefined => {
    if (!run) {
        return "";
    }

    return `mock conda file content for run: ${run.runId}`;
};
