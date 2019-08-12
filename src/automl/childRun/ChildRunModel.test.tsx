import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { waitPromise } from "../common/utils/waitPromise";
import { ModelSection } from "../components/ModelDownloadDeploy/ModelSection";
import { parentSuccessRun } from "../parentRun/__data__/parentSuccessRun";
import { RunHistoryService } from "../services/RunHistoryService";
import { ChildRunModel, IChildRunModelProps, IChildRunModelState } from "./ChildRunModel";

async function renderChildRunModel(props: IChildRunModelProps): Promise<ShallowWrapper<IChildRunModelProps, IChildRunModelState, ChildRunModel>> {
    const tree = shallow<ChildRunModel>(<ChildRunModel {...props} />);
    await waitPromise(3);
    return tree;
}
describe("ChildRunModel", () => {
    let getRunSpy: jest.SpyInstance<ReturnType<RunHistoryService["getRun"]>>;
    const onModelDeploy = jest.fn();
    beforeEach(() => {
        getRunSpy = jest.spyOn(RunHistoryService.prototype, "getRun");
    });
    it("should render spinner with undefined", async () => {
        const props = {
            modelUri: undefined,
            scoringUri: undefined,
            condaUri: undefined,
            experimentName: undefined,
            run: undefined,
            onModelDeploy
        };
        const tree = await renderChildRunModel(props);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
    it("should render with valid props", async () => {
        const props = {
            modelUri: "Test Uri",
            scoringUri: "Test Scoring",
            condaUri: "Test Conda",
            experimentName: "Test Experiment",
            run: parentSuccessRun.childRuns && parentSuccessRun.childRuns[0],
            onModelDeploy
        };
        const tree = await renderChildRunModel(props);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should not set parent run if run is undefined ", async () => {
        const props = {
            modelUri: "Test Uri",
            scoringUri: "Test Scoring",
            condaUri: "Test Conda",
            experimentName: "Test Experiment",
            run: { ...(parentSuccessRun.childRuns && parentSuccessRun.childRuns[0]), tags: { model_id: "test_model_id" } },
            onModelDeploy
        };
        getRunSpy.mockReturnValue(Promise.resolve(undefined));
        const tree = await renderChildRunModel(props);
        expect(tree.state("parentRun"))
            .toBeUndefined();
    });
    it("should not set parent run if run id is undefined ", async () => {
        const props = {
            modelUri: "Test Uri",
            scoringUri: "Test Scoring",
            condaUri: "Test Conda",
            experimentName: "Test Experiment",
            run: { ...(parentSuccessRun.childRuns && parentSuccessRun.childRuns[0]), tags: { model_id: "test_model_id" } },
            onModelDeploy
        };
        getRunSpy.mockReturnValue(Promise.resolve({ runId: undefined }));
        const tree = await renderChildRunModel(props);
        expect(tree.state("parentRun"))
            .toBeUndefined();
    });

    it("should onModelDeploy", async () => {
        const props = {
            modelUri: "Test Uri",
            scoringUri: "Test Scoring",
            condaUri: "Test Conda",
            experimentName: "Test Experiment",
            run: parentSuccessRun.childRuns && parentSuccessRun.childRuns[0],
            onModelDeploy
        };
        const tree = await renderChildRunModel(props);
        expect(tree.find(ModelSection)
            .prop("onModelDeploy"))
            .toBe(onModelDeploy);
    });
});
