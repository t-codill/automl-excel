import { RunHistoryAPIsModels } from "@vienna/runhistory";

export const getScoringFileFromTemplate = (
    parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto | undefined,
    runId: string | undefined,
): string | undefined => {
    if (!runId || !parentRun) {
        return "";
    }

    return `mock scoring file content for runId: ${runId}, run: ${parentRun.runId}`;
};
