
export async function parallelCall<T>(
    jobs: Array<() => Promise<T>>,
    current: number
): Promise<T[]> {
    let idx = 0;
    const result: T[] = Array(jobs.length);
    await Promise.all(Array(current)
        .fill(1)
        .map(
            async () => {
                while (idx < jobs.length) {
                    const curr = idx++;
                    const job = jobs[curr];
                    result[curr] = await job();
                }
            }
        ));
    return result;
}
