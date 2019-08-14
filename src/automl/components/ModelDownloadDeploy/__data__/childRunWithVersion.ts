import { RunHistoryAPIsModels } from "@vienna/runhistory";

export const childRunWithVersion: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
    runId: "test-run-id_1",
    properties: {
        dependencies_versions: "{\"azureml-train-automl\": \"1.0.0\"}"
    }
};
