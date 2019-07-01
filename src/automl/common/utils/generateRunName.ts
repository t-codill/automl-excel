import { RunHistoryAPIsModels } from "@vienna/runhistory";

export function generateRunName(run: RunHistoryAPIsModels.MicrosoftMachineLearningRunHistoryContractsRunDto | undefined): string {
    if (!run || !run.properties) {
        return "<N/A>";
    }
    const runPreprocessor = run.properties.run_preprocessor;
    const runAlgorithm = run.properties.run_algorithm;
    if (!runPreprocessor && !runAlgorithm) {
        return "<N/A>";
    }
    if (!runPreprocessor) {
        return runAlgorithm;
    }
    if (!runAlgorithm) {
        return runPreprocessor;
    }
    return `${runPreprocessor}, ${runAlgorithm}`;
}
