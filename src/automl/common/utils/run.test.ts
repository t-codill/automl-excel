import {
    isRunCompleted,
    isTerminatedRunStatus,
    mergeRunStatus,
    shouldShowParentRunModel
} from "./run";

describe("run", () => {
    describe("isTerminatedRunStatus", () => {
        it.each([
            "Completed",
            "Failed",
            "NotStarted",
            "CancelRequested",
            "Canceled",
            "NotResponding"
        ])("should return true for %s", (status) => {
            expect(isTerminatedRunStatus(status))
                .toBe(true);
        });

        it.each([
            "Running",
            "Preparing",
            "Provisioning",
            "Queued",
            "Starting",
            "Finalizing"
        ])("should return true for %s", (status) => {
            expect(isTerminatedRunStatus(status))
                .toBe(false);
        });
    });

    describe("mergeRunStatus", () => {
        it("should return property name", () => {
            expect(mergeRunStatus({
                Running: 1,
                Preparing: 1,
                Provisioning: 1,
                Queued: 1,
                Starting: 1,
                Finalizing: 1,

                Completed: 1,

                NotStarted: 1,
                CancelRequested: 1,
                Canceled: 1,
                NotResponding: 1
            }))
                .toEqual({
                    Running: 6,
                    Completed: 1,
                    Failed: 0,
                    Others: 4
                });
        });
    });
    describe("isRunCompleted", () => {
        it.each([
            "Completed",
        ])("should return true for %s", (status) => {
            expect(isRunCompleted({ status }))
                .toBe(true);
        });

        it.each([
            undefined,
            "Failed",
            "Canceled",
            "Test",
            "Preparing",
            "Provisioning",
            "Queued",
            "Starting",
            "Finalizing"
        ])("should return true for %s", (status) => {
            expect(isRunCompleted({ status }))
                .toBe(false);
        });
    });

    describe("shouldShowParentRunModel", () => {
        it.each([
            "Completed",
            "Failed",
            "Canceled"
        ])("should return true for %s", (status) => {
            expect(shouldShowParentRunModel(status))
                .toBe(true);
        });

        it.each([
            undefined,
            "Test",
            "Preparing",
            "Provisioning",
            "Queued",
            "Starting",
            "Finalizing"
        ])("should return true for %s", (status) => {
            expect(shouldShowParentRunModel(status))
                .toBe(false);
        });
    });

});
