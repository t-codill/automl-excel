import { RunHistoryAPIsModels } from "@vienna/runhistory";

export const parentRun: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDetailsDto = {
    runId: "test-run-id",
    properties: {
        DataPrepJsonString: "{\"features\":[\"timeStamp\",\"precip\",\"temp\"]}"
    }
};
