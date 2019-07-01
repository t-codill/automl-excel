import { WorkspaceFlight } from "./WorkspaceFlight";
describe("WorkspaceFlight", () => {
    const flightSearchParams = "master,dataPrep,sdkFlight=master,sdkVersion=1.2312";
    const flight = new WorkspaceFlight(flightSearchParams);
    it("should read master flight", () => {
        expect(flight.has("master"))
            .toBe(true);
    });
    it("should be case insensitive", () => {
        expect(flight.has("Dataprep"))
            .toBe(true);
    });
    it("should not match partial word 'dataprep' vs 'data'", () => {
        expect(flight.has("data"))
            .toBe(false);
    });
    it("should get sdk version", () => {
        expect(flight.get("sdkVersion"))
            .toBe("1.2312");
    });
    it("should return undefined for dataPrep because value not provided", () => {
        expect(flight.get("dataPrep"))
            .toBeUndefined();
    });
    describe("appendQueryParam", () => {
        it("should return empty string without flight search params", () => {
            expect(new WorkspaceFlight("").appendQueryParam(""))
                .toBe("?flight=");
        });
        it("should append flight", () => {
            expect(flight.appendQueryParam(""))
                .toBe(`?flight=master,dataprep,sdkflight=master,sdkversion=1.2312`);
        });
        it("should append flight if url has query param already", () => {
            expect(flight.appendQueryParam("?demo=true"))
                .toBe(`?demo=true&flight=master,dataprep,sdkflight=master,sdkversion=1.2312`);
        });
        it("should append before hash", () => {
            expect(flight.appendQueryParam("/path/#hash123"))
                .toBe(`/path/?flight=master,dataprep,sdkflight=master,sdkversion=1.2312#hash123`);
        });
    });
});
