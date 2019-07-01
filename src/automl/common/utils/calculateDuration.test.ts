import { calculateDuration } from "./calculateDuration";

describe("calculateDuration", () => {

    describe("invalid", () => {
        it("should return empty string if startTime is undefined", async () => {
            expect(calculateDuration(undefined, new Date()))
                .toBe("");
        });
        it("should return empty string if endTime is undefined", async () => {
            expect(calculateDuration(new Date(), undefined))
                .toBe("");
        });
        it("should return empty string if endTime is before startTime", async () => {
            expect(calculateDuration(
                new Date("2000-01-02T01:01:55"),
                new Date("2000-01-01T01:01:55")
            ))
                .toBe("");
        });
    });

    describe("equal", () => {
        it("should return valid string", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:01:00"),
                new Date("2000-01-01T01:01:00")
            ))
                .toBe("00:00:00");
        });
    });

    describe("less than 1 second", () => {
        it("should return valid second less than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:01:00"),
                new Date("2000-01-01T01:01:01")
            ))
                .toBe("00:00:01");
        });
        it("should return valid second more than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:20:45"),
                new Date("2000-01-01T01:21:01")
            ))
                .toBe("00:00:16");
        });
    });

    describe("less than 1 minute", () => {
        it("should return valid minute less than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:01:00"),
                new Date("2000-01-01T01:02:01")
            ))
                .toBe("00:01:01");
        });
        it("should return valid minute more than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:02:27"),
                new Date("2000-01-01T02:01:00")
            ))
                .toBe("00:58:33");
        });
    });

    describe("less than 24 hours", () => {
        it("should return valid hour less than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:01:27"),
                new Date("2000-01-01T03:12:00")
            ))
                .toBe("02:10:33");
        });
        it("should return valid hour more than 10", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:11:44"),
                new Date("2000-01-02T01:01:01")
            ))
                .toBe("23:49:17");
        });
    });
    describe("more than 24 hours", () => {
        it("should return valid hour", async () => {
            expect(calculateDuration(
                new Date("2000-01-01T01:01:00"),
                new Date("2000-02-01T01:02:01")
            ))
                .toBe("744:01:01");
        });
    });
});
