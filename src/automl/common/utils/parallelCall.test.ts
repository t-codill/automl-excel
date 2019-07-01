import { parallelCall } from "./parallelCall";

describe("parallelCall", () => {
    const action = jest.fn();
    const tasks = Array(5)
        .fill(async () => {
            action();
        });
    it("should call all tasks if parallel is small than task count", async () => {
        await parallelCall(tasks, 3);
        expect(action)
            .toBeCalledTimes(5);
    });
    it("should call all tasks if parallel is greater than task count", async () => {
        await parallelCall(tasks, 13);
        expect(action)
            .toBeCalledTimes(5);
    });
    it("should only queue parallel count", async () => {
        const spy = jest.spyOn(Promise, "all");
        await parallelCall(tasks, 3);
        expect(spy)
            .toBeCalledWith(
                [
                    expect.anything(),
                    expect.anything(),
                    expect.anything()
                ]
            );
    });
});
