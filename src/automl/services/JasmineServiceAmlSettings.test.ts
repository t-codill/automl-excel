import { testContext } from "../common/context/__data__/testContext";
import { settingParams } from "./__data__/settingParams";
import { getAmlSettings } from "./JasmineServiceAmlSettings";

describe("JasmineServiceAmlSettings", () => {
    it("should get an error without compute properties", async () => {
        expect(() => {
            getAmlSettings("experiment", {}, testContext, settingParams);
        })
            .toThrowError("undefined is not a valid compute");
    });

    it("should getAmlSettings", async () => {
        const result = getAmlSettings("experiment", {
            name: "compute",
            properties: {
                computeType: "AmlCompute"
            }
        }, testContext, settingParams);
        expect(result)
            .toMatchSnapshot();
    });

    it("should getAmlSettings for forecasting", async () => {
        const result = getAmlSettings("experiment", {
            name: "compute",
            properties: {
                computeType: "AmlCompute"
            }
        }, testContext, { ...settingParams, jobType: "forecasting" });
        expect(result)
            .toMatchSnapshot();
    });

    it("should not enableEnsembling when iteration is less than or equal to 2", async () => {
        const result = getAmlSettings("experiment", {
            name: "compute",
            properties: {
                computeType: "VirtualMachine"
            }
        }, testContext, { ...settingParams, maxIteration: 1 });
        expect(result.enable_ensembling)
            .toBe(false);
    });

    it("ensembleIterations should be same as iteration when between 2 and 15", async () => {
        const result = getAmlSettings("experiment", {
            name: "compute",
            properties: {
                computeType: "VirtualMachine"
            }
        }, testContext, { ...settingParams, maxIteration: 12 });
        expect(result.enable_ensembling)
            .toBe(true);
        expect(result.ensemble_iterations)
            .toBe(12);
    });

    it("ensembleIterations should not be more than 15", async () => {
        const result = getAmlSettings("experiment", {
            name: "compute",
            properties: {
                computeType: "VirtualMachine"
            },
        }, testContext, { ...settingParams, maxIteration: 15 });
        expect(result.enable_ensembling)
            .toBe(true);
        expect(result.ensemble_iterations)
            .toBe(15);
    });
});
