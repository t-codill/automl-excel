import { download } from "./download";

describe("download", () => {
    it("should work as expected", () => {
        const setAttributeMock = jest.fn();
        const dispatchMock = jest.fn();
        const link: Partial<HTMLAnchorElement> = {
            setAttribute: setAttributeMock,
            dispatchEvent: dispatchMock
        };
        const createElementMock = jest.fn(() => link);

        Object.defineProperty(window.document, "createElement", {
            value: createElementMock
        });

        download("test_url", "test_file");

        expect(createElementMock)
            .toBeCalledTimes(1);
        expect(createElementMock)
            .toBeCalledWith("a");

        expect(setAttributeMock)
            .toBeCalledTimes(2);
        expect(setAttributeMock)
            .toBeCalledWith("href", "test_url");
        expect(setAttributeMock)
            .toBeCalledWith("download", "test_file");

        expect(dispatchMock)
            .toBeCalledTimes(1);

    });
});
