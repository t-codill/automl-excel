import { RunHistoryAPIs } from "@vienna/runhistory";
import { restCanceledError } from "../../__data__/restCanceledError";
import { testContext } from "../common/context/__data__/testContext";
import { parentSuccessRun } from "../parentRun/__data__/parentSuccessRun";
import { RunHistoryService } from "./RunHistoryService";

jest.mock("@vienna/runhistory");

const service = new RunHistoryService(testContext);

describe("RunHistoryService", () => {
    it("should getExperiment", async () => {
        const result = await service.getExperiment("sampleExperimentName");
        expect(result)
            .toMatchSnapshot();
    });
    it("should getRun", async () => {
        const result = await service.getRun("00000000-0000-0000-0000-000000000000", "sampleExperimentName");
        expect(result)
            .toMatchSnapshot();
    });
    it("should getRunMetrics", async () => {
        const result = await service.getRunMetrics("00000000-0000-0000-0000-000000000000", "sampleExperimentName");
        expect(result)
            .toMatchSnapshot();
    });
    it("should getChildRuns", async () => {
        const result = await service.getChildRuns("00000000-0000-0000-0000-000000000000", "sampleExperimentName");
        expect(result)
            .toMatchSnapshot();
    });
    it("getChildRuns should sort by iteration", async () => {
        jest.spyOn(RunHistoryAPIs.prototype, "getChildRuns")
            .mockImplementationOnce(async () => ({
                value: [
                    {
                        runId: "AutoML_001",
                        properties: { iteration: "23" }
                    },
                    {
                        runId: "AutoML_000",
                        properties: { iteration: "9" }
                    }
                ]
            }));
        const result = await service.getChildRuns("00000000-0000-0000-0000-000000000000", "sampleExperimentName");
        expect(result)
            .toEqual([
                {
                    runId: "AutoML_000",
                    properties: { iteration: "9" }
                },
                {
                    runId: "AutoML_001",
                    properties: { iteration: "23" }
                }
            ]
            );
    });
    it("getChildRuns should return undefined if canceled", async () => {
        jest.spyOn(RunHistoryAPIs.prototype, "getChildRuns")
            .mockImplementationOnce(async () => { throw restCanceledError; });
        const result = await service.getChildRuns("00000000-0000-0000-0000-000000000000", "sampleExperimentName");
        expect(result)
            .toBeUndefined();
    });
    it("should listExperiments", async () => {
        const result = await service.listExperiments();
        expect(result)
            .toMatchSnapshot();
    });
    it("should update tag", async () => {
        const result = await service.updateTag(parentSuccessRun.run,
            parentSuccessRun.experimentName, "test tag", "test value");
        expect(result)
            .toMatchSnapshot();
    });
    it("should not update tag without run id", async () => {
        const result = await service.updateTag({ ...parentSuccessRun.run, runId: undefined },
            parentSuccessRun.experimentName, "test tag", "test value");
        expect(result)
            .toBeUndefined();
    });
    it("should update tags", async () => {
        const result = await service.updateTags(parentSuccessRun.run,
            parentSuccessRun.experimentName, ["test tag1", "test tag2", "test tag3"], ["test value1", "test value2", "test value3"]);
        expect(result)
            .toMatchSnapshot();
    });
    it("should not update tags without run id", async () => {
        const result = await service.updateTags({ ...parentSuccessRun.run, runId: undefined },
            parentSuccessRun.experimentName, ["test tag1", "test tag2", "test tag3"], ["test value1", "test value2", "test value3"]);
        expect(result)
            .toBeUndefined();
    });
    it("should not update tag without invalid key-value pair", async () => {
        const result = await service.updateTags(parentSuccessRun.run,
            parentSuccessRun.experimentName, ["test tag1", "test tag2", "test tag3"], ["test value1", "test value2"]);
        expect(result)
            .toMatchSnapshot();
    });
    describe("getChildRunMetrics", () => {
        it("should be empty without child run", async () => {
            const result = await service.getChildRunMetrics([], [], "sampleExperimentName");
            expect(result)
                .toEqual([]);
        });

        it("should be empty with no child run completed", async () => {
            const result = await service.getChildRunMetrics([
                { runId: "runId1", status: "Running" },
                { runId: "runId1", status: "Canceled" },
                { runId: "runId1", status: "Failed" }
            ], [], "sampleExperimentName");
            expect(result)
                .toEqual([{}, {}, {}]);
        });
        it("should be undefined when canceled", async () => {
            const spy = jest.spyOn(RunHistoryAPIs.prototype, "queryRunMetrics");
            spy.mockImplementationOnce(() => { throw restCanceledError; });
            const result = await service.getChildRunMetrics([{ runId: "runId1", status: "Completed" }], [], "sampleExperimentName");
            expect(result)
                .toBeUndefined();
        });
        it("should getChildRunMetrics", async () => {
            const result = await service.getChildRunMetrics([{ runId: "runId1", status: "Completed" }, { runId: "runId2", status: "Canceled" }], ["metric1"], "sampleExperimentName");
            expect(result)
                .toMatchSnapshot();
        });
    });

    describe("getArtifactBackedMetricNames", () => {
        it("should not get value without data location", async () => {
            const result = service.getArtifactBackedMetricNames([
                {
                    name: "noDataLocation",
                    metricType: "azureml.v1.residuals",
                    dataLocation: undefined
                }
            ]);
            expect(result)
                .toEqual([]);
        });
        it("should not get value with wrong location", async () => {
            const result = service.getArtifactBackedMetricNames([
                {
                    name: "metricName1",
                    dataLocation: "inlineMetric"
                }
            ]);
            expect(result)
                .toEqual([]);
        });
        it("should not value with unsupported metric type", async () => {
            const result = service.getArtifactBackedMetricNames([
                {
                    name: "metricName2",
                    metricType: "azureml.v1.image",
                    dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/residuals"
                }
            ]);
            expect(result)
                .toEqual([]);
        });
        it("should get value with aml data location v1", async () => {
            const result = service.getArtifactBackedMetricNames([
                {
                    name: "metricName2",
                    metricType: "azureml.v1.residuals",
                    dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/residuals"
                }
            ]);
            expect(result)
                .toEqual([
                    [
                        "metricName2",
                        {
                            container: "AutoML_00000000-0000-0000-0000-000000000000_00",
                            origin: "ExperimentRun",
                            path: "residuals",
                        },
                    ],
                ]);
        });
        it("should get value with aml data location v2", async () => {
            const result = service.getArtifactBackedMetricNames([
                {
                    name: "metricName2",
                    metricType: "azureml.v2.residuals",
                    dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/residuals"
                }
            ]);
            expect(result)
                .toEqual([
                    [
                        "metricName2",
                        {
                            container: "AutoML_00000000-0000-0000-0000-000000000000_00",
                            origin: "ExperimentRun",
                            path: "residuals",
                        },
                    ],
                ]);
        });
    });
    describe("getRuns", () => {
        it("should getRunList", async () => {
            const spy = jest.spyOn(RunHistoryAPIs.prototype, "getRuns");
            const result = await service.getRuns({});
            expect(spy)
                .toBeCalledTimes(1);
            expect(result)
                .toMatchSnapshot();
        });
        it("should be undefined if canceled", async () => {
            const spy = jest.spyOn(RunHistoryAPIs.prototype, "getRuns");
            spy.mockImplementation(() => { throw restCanceledError; });
            const result = await service.getRuns({});
            expect(spy)
                .toBeCalledTimes(1);
            expect(result)
                .toBeUndefined();
        });
    });
    describe("getRunList", () => {
        it("should getRunList", async () => {
            const result = await service.getRunList();
            expect(result)
                .toMatchSnapshot();
        });
        it("should be undefined without experiment", async () => {
            const spy = jest.spyOn(RunHistoryAPIs.prototype, "getExperiments");
            spy.mockImplementation(() => { throw restCanceledError; });
            const result = await service.getRunList();
            expect(result)
                .toBeUndefined();
        });
        it("should be undefined if canceled", async () => {
            const spy = jest.spyOn(RunHistoryAPIs.prototype, "getRuns");
            spy.mockImplementation(() => { throw restCanceledError; });
            const result = await service.getRunList();
            expect(result)
                .toBeUndefined();
        });
    });
    describe("mergeMetrics", () => {

        describe("scalar value", () => {
            it("should not get metric without name", async () => {
                const result = service.mergeMetrics([
                    {
                        name: undefined,
                        dataLocation: "inlineMetric"
                    }
                ], [], []);
                expect(result)
                    .toEqual({});
            });
            it("should get undefined for metric without value", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "noValueMetric",
                        dataLocation: "inlineMetric"
                    },
                ], [], []);
                expect(result)
                    .toEqual({ noValueMetric: undefined });
            });
            it("should get for metric without data location", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "noLocationMetric",
                        dataLocation: undefined
                    },
                ], [], []);
                expect(result)
                    .toEqual({ noLocationMetric: undefined });
            });
            it("should get scalar metric", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "scalarMetric",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 1,
                            properties: [{
                                name: "scalar",
                                propertyId: "scalar",
                                type: "scalar"
                            }]
                        },
                        cells: [{ scalar: "scalarValue" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ scalarMetric: "scalarValue" });
            });
            it("should get undefined for scalar metric without property name", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "scalarMetricNoName",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 1,
                            properties: [{
                                propertyId: "scalarMetricNoName",
                                type: "scalar"
                            }]
                        },
                        cells: [{ "": "scalarValue" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ scalarMetricNoName: undefined });
            });
        });

        describe("array value", () => {
            it("should get array metric", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "arrayMetric",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 1,
                            properties: [{
                                name: "array",
                                propertyId: "array",
                                type: "array"
                            }]
                        },
                        cells: [{ array: "arrayValue1" }, { array: "arrayValue2" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ arrayMetric: ["arrayValue1", "arrayValue2"] });
            });
            it("should get undefined for array metric without schema", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "arrayMetricNoSchema",
                        dataLocation: "inlineMetric",
                        cells: [{ array: "arrayValue1" }, { array: "arrayValue2" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ arrayMetricNoSchema: undefined });
            });
            it("should get undefined for array metric without schema properties", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "arrayMetricNoSchemaProperties",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 0
                        },
                        cells: [{ array: "arrayValue1" }, { array: "arrayValue2" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ arrayMetricNoSchemaProperties: undefined });
            });
            it("should get undefined for array metric without property 0", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "arrayMetricNoSchemaProperties0",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 0,
                            properties: []
                        },
                        cells: [{ array: "arrayValue1" }, { array: "arrayValue2" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ arrayMetricNoSchemaProperties0: undefined });
            });
            it("should get undefined for array metric without schema", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "arrayMetricNoSchemaProperties0Name",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 1,
                            properties: [{
                                propertyId: "array",
                                type: "array"
                            }]
                        },
                        cells: [{ array: "arrayValue1" }, { array: "arrayValue2" }]
                    },
                ], [], []);
                expect(result)
                    .toEqual({ arrayMetricNoSchemaProperties0Name: undefined });
            });
        });
        describe("table value", () => {
            it("should get table value", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "tableMetric",
                        dataLocation: "inlineMetric",
                        schema: {
                            numProperties: 1,
                            properties: [
                                {
                                    name: "prop1",
                                    propertyId: "prop1",
                                    type: "table"
                                },
                                {
                                    name: "prop2",
                                    propertyId: "prop2",
                                    type: "table"
                                },
                                {
                                    propertyId: "noNameProp",
                                    type: "table"
                                }
                            ]
                        },
                        cells: [
                            { prop1: "scalarValue11" },
                            { prop1: "scalarValue12" },
                            { prop1: "scalarValue13" },
                            { prop1: "scalarValue14" },
                            { prop2: "scalarValue21" },
                            { prop2: "scalarValue22" },
                            { prop2: "scalarValue23" },
                            { prop2: "scalarValue24" }
                        ]
                    },
                ], [], []);
                expect(result)
                    .toEqual({
                        tableMetric: {
                            prop1: [
                                "scalarValue11",
                                "scalarValue12",
                                "scalarValue13",
                                "scalarValue14",
                            ],
                            prop2: [
                                "scalarValue21",
                                "scalarValue22",
                                "scalarValue23",
                                "scalarValue24",
                            ],
                        }
                    });
            });
        });

        describe("artifact value", () => {
            it("should get empty object for invalid json value", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "invalidArtifactMetric",
                        dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/metric"
                    }
                ], ["invalidArtifactMetric"], ["invalid json"]);
                expect(result)
                    .toEqual({ invalidArtifactMetric: {} });
            });
            it("should get valid artifact metric", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "validArtifactMetric",
                        dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/metric"
                    }
                ], ["validArtifactMetric"], [JSON.stringify({ value: 123 })]);
                expect(result)
                    .toEqual({ validArtifactMetric: { value: 123 } });
            });
            it("should get undefined if artifact does not exist", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "nonExistArtifactMetric",
                        dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/metric"
                    }
                ], ["nonExistArtifactMetric"], []);
                expect(result)
                    .toEqual({ nonExistArtifactMetric: undefined });
            });
            it("should get undefined if artifact not found", async () => {
                const result = service.mergeMetrics([
                    {
                        name: "notFoundArtifactMetric",
                        dataLocation: "aml://artifactId/ExperimentRun/AutoML_00000000-0000-0000-0000-000000000000_00/outputs/metric"
                    }
                ], [], []);
                expect(result)
                    .toEqual({ nonExistArtifactMetric: undefined });
            });
        });
    });
});
