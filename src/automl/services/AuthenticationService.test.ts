import { AuthenticationService } from "./AuthenticationService";

describe("AuthenticationService", () => {
    it("should getToken", async () => {
        const spy = jest.spyOn(window, "fetch");
        spy.mockImplementation(async () => {
            return new Response(`{
                "accessToken": "test Token"
            }`);
        });
        const token = await AuthenticationService.getToken();
        expect(spy)
            .toBeCalled();
        expect(token)
            .toBe("test Token");
    });
});
