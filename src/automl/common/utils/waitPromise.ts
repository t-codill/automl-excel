export async function waitPromise(times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
        await Promise.resolve();
    }
}
