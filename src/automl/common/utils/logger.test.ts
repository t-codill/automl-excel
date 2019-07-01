import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { testContext } from "../context/__data__/testContext";
import { Region } from "./getRegion";
import { Logger } from "./logger";

jest.unmock("./logger");

let loadAppInsightsSpy: jest.SpyInstance<ReturnType<ApplicationInsights["loadAppInsights"]>>;
let trackPageViewSpy: jest.SpyInstance<ReturnType<ApplicationInsights["trackPageView"]>>;
let trackUserEventSpy: jest.SpyInstance<ReturnType<ApplicationInsights["trackEvent"]>>;

describe("logger", () => {
    beforeEach(() => {
        loadAppInsightsSpy = jest.spyOn(ApplicationInsights.prototype, "loadAppInsights");
        trackPageViewSpy = jest.spyOn(ApplicationInsights.prototype, "trackPageView");
        trackUserEventSpy = jest.spyOn(ApplicationInsights.prototype, "trackEvent");
    });
    describe("valid region", () => {
        let logger: Logger;

        it("should init", () => {
            logger = new Logger("development");
            expect(logger)
                .toBeDefined();
            expect(loadAppInsightsSpy)
                .toBeCalledTimes(1);
        });

        it("should log page view", () => {
            logger.logPageView("test page", testContext);
            expect(trackPageViewSpy)
                .toBeCalledWith(
                    {
                        name: "test page",
                        properties: {
                            location: "eastus",
                            resourceGroupName: "testResource",
                            subscriptionId: "00000000-0000-0000-0000-000000000000",
                            workspaceName: "testWorkSpace"
                        }
                    },
                );
        });

        it("should log custom event", () => {
            logger.logCustomEvent("custom event", testContext, { p1: "v1" }, { m1: 1.23 });
            expect(trackUserEventSpy)
                .toBeCalledWith(
                    {
                        measurements: {
                            m1: 1.23
                        },
                        name: "custom event",
                        properties: {
                            location: "eastus",
                            p1: "v1",
                            resourceGroupName: "testResource",
                            subscriptionId: "00000000-0000-0000-0000-000000000000",
                            workspaceName: "testWorkSpace"
                        }
                    }
                );
        });
        it("should log error", () => {
            const err = new Error("This is a test error");
            const trackExceptionSpy = jest.spyOn(ApplicationInsights.prototype, "trackException");
            logger.logError(err, testContext);
            expect(trackExceptionSpy)
                .toBeCalledWith(
                    {
                        error: err,
                        properties: {
                            location: "eastus",
                            resourceGroupName: "testResource",
                            subscriptionId: "00000000-0000-0000-0000-000000000000",
                            workspaceName: "testWorkSpace"
                        }
                    },
                );
        });

        it("should get session id", () => {
            expect(logger.getSessionId())
                .toBe("sessionId");
        });

        it("should get blank session id if session id is undefined", () => {
            const spy: jest.SpyInstance = jest.spyOn(ApplicationInsights.prototype, "context", "get");
            spy.mockReturnValue({
                sessionManager: {
                    automaticSession: {
                        id: undefined
                    }
                }
            });
            expect(logger.getSessionId())
                .toBe("");
        });

    });
    describe("invalid region", () => {
        let logger: Logger;

        it("should not init", () => {
            logger = new Logger("" as Region);
            expect(logger)
                .toBeDefined();
            expect(loadAppInsightsSpy)
                .toBeCalledTimes(0);
        });

        it("should not log page view", () => {
            logger.logPageView("test page", testContext);
            expect(trackPageViewSpy)
                .toBeCalledTimes(0);
        });

        it("should not log custom event", () => {
            logger.logCustomEvent("custom event", testContext, { p1: "v1" }, { m1: 1.23 });
            expect(trackUserEventSpy)
                .toBeCalledTimes(0);
        });
        it("should not log error", () => {
            const err = new Error("This is a test error");
            const trackExceptionSpy = jest.spyOn(ApplicationInsights.prototype, "trackException");
            logger.logError(err, testContext);
            expect(trackExceptionSpy)
                .toBeCalledTimes(0);
        });

        it("should not get session id", () => {
            expect(logger.getSessionId())
                .toBe("");
        });
    });
});
