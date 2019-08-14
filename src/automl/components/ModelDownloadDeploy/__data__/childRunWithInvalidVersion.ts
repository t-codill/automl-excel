import { RunHistoryAPIsModels } from "@vienna/runhistory";

export const childRunWithInvalidVersion: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
    runId: "test-run-id_1",
    properties: {
        dependencies_versions: "{\"test\": \"1.0.0\"}"
    }
};
