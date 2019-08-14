export function getModelNameFromRunId(runId: string): string {
    const prefix = runId.replace(new RegExp("-", "g"), "")
        .replace(new RegExp("_", "g"), "")
        .substr(0, 15);
    if (runId.indexOf("_") < 0) {
        return prefix;
    }
    const childRunNumber = runId.substring(runId.lastIndexOf("_") + 1);
    return `${prefix}${childRunNumber}`;
}
