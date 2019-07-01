import { computeUtils } from "./computeUtils";

describe("computeUtils", () => {
    describe("isComputeProfilingEnabled", () => {
        it("should return true when compute is aml compte", () => {
            expect(computeUtils.isComputeProfilingEnabled({
                properties: {
                    computeType: "AmlCompute",
                    properties: {
                        scaleSettings: {
                            minNodeCount: 2,
                            maxNodeCount: 6
                        }
                    }
                }
            }))
                .toBe(true);
        });

        it("should return false when compute is not 'hot'", () => {
            expect(computeUtils.isComputeProfilingEnabled({
                properties: {
                    computeType: "AmlCompute",
                    properties: {
                        scaleSettings: {
                            minNodeCount: 0,
                            maxNodeCount: 6
                        }
                    }
                }
            }))
                .toBe(false);
        });
        it("should return false when compute is not virtual machine or aml compute", () => {
            expect(computeUtils.isComputeProfilingEnabled({
                properties: {
                    computeType: "AKS"
                }
            }))
                .toBe(false);
        });
        it("should return true when compute is virtual machine", () => {
            expect(computeUtils.isComputeProfilingEnabled({
                properties: {
                    computeType: "VirtualMachine"
                }
            }))
                .toBe(true);
        });
        it("should return false when compute doesn't have properties", () => {
            expect(computeUtils.isComputeProfilingEnabled({}))
                .toBe(false);
        });

    });

    describe("isComputeUsable", () => {
        it("should return false when compute is undefined", () => {
            expect(computeUtils.isComputeUsable(undefined))
                .toBe(false);
        });
        it("should return false when compute is empty", () => {
            expect(computeUtils.isComputeUsable({}))
                .toBe(false);
        });
        it("should return true when compute is virtual machine", () => {
            expect(computeUtils.isComputeUsable({
                properties: {
                    computeType: "VirtualMachine"
                }
            }))
                .toBe(true);
        });
        it("should return false when compute is AKS", () => {
            expect(computeUtils.isComputeUsable({
                properties: {
                    computeType: "AKS"
                }
            }))
                .toBe(false);
        });
        describe("AMLCompute", () => {

            it("should return false when missing properties", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute"
                    }
                }))
                    .toBe(false);
            });
            it("should return false when missing scaleSettings", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute",
                        properties: {}
                    }
                }))
                    .toBe(false);
            });
            it("should return true when missing nodeStateCounts", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute",
                        properties: {
                            scaleSettings: {
                                minNodeCount: 0,
                                maxNodeCount: 6
                            }
                        }
                    }
                }))
                    .toBe(true);
            });
            it("should return true when unusableNodeCount is missing", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute",
                        properties: {
                            scaleSettings: {
                                minNodeCount: 0,
                                maxNodeCount: 6
                            },
                            nodeStateCounts: {}
                        }
                    }
                }))
                    .toBe(true);
            });
            it("should return true when unusableNodeCount is less than max node", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute",
                        properties: {
                            scaleSettings: {
                                minNodeCount: 0,
                                maxNodeCount: 6
                            },
                            nodeStateCounts: {
                                unusableNodeCount: 3
                            }
                        }
                    }
                }))
                    .toBe(true);
            });
            it("should return false when unusableNodeCount is equal with max node", () => {
                expect(computeUtils.isComputeUsable({
                    properties: {
                        computeType: "AmlCompute",
                        properties: {
                            scaleSettings: {
                                minNodeCount: 0,
                                maxNodeCount: 6
                            },
                            nodeStateCounts: {
                                unusableNodeCount: 6
                            }
                        }
                    }
                }))
                    .toBe(false);
            });
        });
    });
});
