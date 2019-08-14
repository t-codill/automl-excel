import { forEach } from "lodash";
import { IDictionary } from "../../common/IDictionary";

export type MappedStatus = "Running" | "Completed" | "Failed" | "Others";

const statusMapping: IDictionary<MappedStatus> = {
    Running: "Running",
    Preparing: "Running",
    Provisioning: "Running",
    Queued: "Running",
    Starting: "Running",
    Finalizing: "Running",
    Completed: "Completed",
    Failed: "Failed",
    NotStarted: "Others",
    CancelRequested: "Others",
    Canceled: "Others",
    NotResponding: "Others"
};

const isTerminatedRunStatus = (status: string | undefined) => {
    return status === "Completed" ||
        status === "Failed" ||
        status === "NotStarted" ||
        status === "CancelRequested" ||
        status === "Canceled" ||
        status === "NotResponding";
};

const mergeRunStatus = (runStatus: IDictionary<number>): { [key in MappedStatus]: number } => {
    const result = {
        Running: 0,
        Completed: 0,
        Failed: 0,
        Others: 0
    };
    forEach(runStatus, (value, key) => {
        result[statusMapping[key]] += value;
    });
    return result;
};

const shouldShowParentRunModel = (status: string | undefined): boolean => {
    const allowedState = new Set(["Completed", "Failed", "Canceled"]);
    if (!status) {
        return false;
    }
    return allowedState.has(status);
};

const isRunCompleted = (run: { status?: string } | undefined): boolean => {
    return !!run && run.status === "Completed";
};

export {
    isTerminatedRunStatus,
    mergeRunStatus,
    statusMapping,
    shouldShowParentRunModel,
    isRunCompleted
};
