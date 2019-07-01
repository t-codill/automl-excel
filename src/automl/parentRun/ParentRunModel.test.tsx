import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ModelDeploy } from "../components/ModelDownloadDeploy/ModelDeploy";
import { ArtifactService } from "../services/ArtifactService";
import { parentSuccessRun, parentSuccessRunAMLSettings } from "./__data__/parentSuccessRun";
import { IParentRunGridProps } from "./ParentRunGrid";
import { IParentRunModelState, ParentRunModel } from "./ParentRunModel";

jest.mock("../services/ArtifactService");

describe("Parent Run Model", () => {
    const onModelRegister = jest.fn();
    let tree: ShallowWrapper<IParentRunGridProps, IParentRunModelState>;
    beforeAll(async () => {
        tree = shallow(
            <ParentRunModel
                experimentName="foo"
                run={undefined}
                childRuns={undefined}
                childRunMetrics={undefined}
                onModelRegister={onModelRegister} />
        );
        await Promise.resolve();
    });

    it("should render pageLoadingSpinner with undefined", async () => {
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });

    it("should render with success run", async () => {
        tree.setProps({
            run: parentSuccessRun.run,
            childRuns: parentSuccessRun.childRuns,
            childRunMetrics: parentSuccessRun.childRunMetrics
        });
        await Promise.resolve();
        expect(tree)
            .toMatchSnapshot();
    });

    it("should refresh when child run changes", async () => {
        tree.setProps({ childRuns: [] });
        await Promise.resolve();
        expect(tree.state("uri"))
            .toBeUndefined();
    });

    it("should existing model id if it is registered already", async () => {
        const childRuns = [
            {
                runNumber: 1,
                properties: {
                    score: "1"
                },
                tags: {
                    model_id: "model_id_registered"
                }
            }
        ];
        tree.setProps({ childRuns });
        await Promise.resolve();
        expect(tree.find(ModelDeploy)
            .prop("modelId"))
            .toBe("model_id_registered");
    });

    it("should pick max value", async () => {
        const childRuns = [
            {
                properties: {
                    score: "1"
                }
            },
            {
                properties: {
                    score: "2"
                }
            }
        ];
        tree.setProps({ childRuns });
        await Promise.resolve();
        expect(tree.state("bestRun"))
            .toEqual({
                parentRunId: undefined,
                properties: { score: "2" },
                runId: undefined,
                score: 2,
                status: undefined
            });
    });

    it("should pick min value", async () => {
        const childRuns = [
            {
                properties: {
                    score: "1"
                }
            },
            {
                properties: {
                    score: "2"
                }
            },
            {
                properties: {
                    score: "3"
                }
            }
        ];
        tree.setProps({
            childRuns,
            run: {
                ...parentSuccessRun.run,
                properties: {
                    ...parentSuccessRun.run.properties,
                    AMLSettingsJsonString: JSON.stringify({
                        ...parentSuccessRunAMLSettings,
                        primary_metric: "normalized_root_mean_squared_error",
                        metric_operation: "minimize"
                    })
                }
            }
        });
        await Promise.resolve();
        expect(tree.state("bestRun"))
            .toEqual({
                parentRunId: undefined,
                properties: { score: "1" },
                runId: undefined,
                score: 1,
                status: undefined
            });
    });

    it("should skip model without uri", async () => {
        const childRuns = [
            {
                properties: {
                    score: "1"
                }
            },
            {
                properties: {
                    score: "2"
                }
            },
            {
                properties: {
                    score: "3"
                }
            },
            {
                properties: {
                    score: "4"
                }
            }
        ];
        const getModelUrlSpy = jest.spyOn(ArtifactService.prototype, "getModelUrl");
        getModelUrlSpy.mockReturnValueOnce(Promise.resolve(null));
        tree.setProps({
            childRuns,
        });
        await Promise.resolve();
        await Promise.resolve();
        expect(tree.state("bestRun"))
            .toEqual({
                parentRunId: undefined,
                properties: { score: "2" },
                runId: undefined,
                score: 2,
                status: undefined
            });
    });
});
