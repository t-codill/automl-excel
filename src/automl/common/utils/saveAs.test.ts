import { saveAs } from "./saveAs";

describe("saveAs", () => {
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

        const createObjectURLMock = jest.fn(() => "test_object_url");
        Object.defineProperty(window.URL, "createObjectURL", {
            value: createObjectURLMock
        });

        saveAs(new Blob(["test"]), "test_file");

        expect(createElementMock)
            .toBeCalledTimes(1);
        expect(createElementMock)
            .toBeCalledWith("a");

        expect(createObjectURLMock)
            .toBeCalledTimes(1);
        expect(createObjectURLMock)
            .toBeCalledWith(new Blob(["test"]));

        expect(setAttributeMock)
            .toBeCalledTimes(2);
        expect(setAttributeMock)
            .toBeCalledWith("href", "test_object_url");
        expect(setAttributeMock)
            .toBeCalledWith("download", "test_file");

        expect(dispatchMock)
            .toBeCalledTimes(1);

    });
});
