// * NotStarted - This is a temporary state client-side Run objects are in before cloud submission
// * Starting - The Run has started being processed in the cloud - the caller has a run ID at this point
// * Provisioning - Used when on-demand compute is being created for a given job submission
// * Preparing - The run environment is being prepared:
//     * docker image build
//     * conda environment setup
// * Queued - The job is queued in the compute target. For example, in BatchAI the job is in queued state
//      while waiting for all the requested nodes to be ready.
// * Running - The job started to run in the compute target.
// * Finalizing - User code has completed and the run is in post-processing stages.
// * CancelRequested - Cancellation has been requested for the job.
// * Completed - The run completed successfully. This includes both the user code and run
//     post-processing stages.
// * Failed - The run failed. Usually the Error property on a run will provide details as to why.
// * Canceled - Following cancellation request, the run is now successfully cancelled.
// * NotResponding - For runs that have Heartbeats enabled, no heartbeat has been recently sent.

export function isAutoRefreshStatus(runStatus: string | undefined): boolean {
    const nonAutoRefreshStatus: Set<string | undefined> = new Set(["Completed", "Failed", "Canceled"]);
    return !nonAutoRefreshStatus.has(runStatus);
}
