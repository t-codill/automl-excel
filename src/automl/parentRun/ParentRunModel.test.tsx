import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { ModelSection } from "../components/ModelDownloadDeploy/ModelSection";
import { parentSuccessRun, parentSuccessRunAMLSettings } from "./__data__/parentSuccessRun";
import { IParentRunGridProps } from "./ParentRunGrid";
import { IParentRunModelState, ParentRunModel } from "./ParentRunModel";

jest.mock("../services/ArtifactService");

describe("Parent Run Model", () => {
    const onModelDeploy = jest.fn();
    let tree: ShallowWrapper<IParentRunGridProps, IParentRunModelState, ParentRunModel>;
    beforeAll(async () => {
        tree = shallow(
            <ParentRunModel
                experimentName="foo"
                run={undefined}
                childRuns={undefined}
                childRunMetrics={undefined}
                onModelDeploy={onModelDeploy} />
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
        expect(tree.state("bestRun"))
            .toBeUndefined();
    });

    it("should pick max value", async () => {
        const childRuns = [
            {
                status: "Completed",
                properties: {
                    score: "1"
                }
            },
            {
                status: "Completed",
                properties: {
                    score: "2"
                }
            }
        ];
        tree.setProps({ childRuns });
        expect(tree.state("bestRun"))
            .toEqual({
                parentRunId: undefined,
                properties: { score: "2" },
                runId: undefined,
                score: 2,
                status: "Completed"
            });
    });

    it("should pick min value", async () => {
        const childRuns = [
            {
                status: "Completed",
                properties: {
                    score: "1"
                }
            },
            {
                status: "Completed",
                properties: {
                    score: "2"
                }
            },
            {
                status: "Completed",
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
        expect(tree.state("bestRun"))
            .toEqual({
                parentRunId: undefined,
                properties: { score: "1" },
                runId: undefined,
                score: 1,
                status: "Completed"
            });
    });

    it("should trigger call back", async () => {
        const onModelDeployProp = tree.find(ModelSection)
            .prop("onModelDeploy");
        if (onModelDeployProp) {
            onModelDeployProp();
        }
        expect(onModelDeploy)
            .toBeCalledTimes(1);
    });
});
