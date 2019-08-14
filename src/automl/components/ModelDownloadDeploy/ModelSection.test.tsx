import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { restCanceledError } from "../../../__data__/restCanceledError";
import { PageNames } from "../../common/PageNames";
import { waitPromise } from "../../common/utils/waitPromise";
import { ArtifactService } from "../../services/ArtifactService";
import { childRun } from "./__data__/childRun";
import { parentRun } from "./__data__/parentRun";
import { ModelDeploy } from "./ModelDeploy";
import { IModelSectionProps, IModelSectionState, ModelSection } from "./ModelSection";

jest.mock("../../services/ArtifactService");

async function renderModelSection(props: IModelSectionProps): Promise<ShallowWrapper<IModelSectionProps, IModelSectionState, ModelSection>> {
    const tree = shallow<ModelSection>(<ModelSection {...props} />);
    await waitPromise(15);
    return tree;
}
describe("ChildRunModel", () => {
    const mockCallBack = jest.fn();
    let getDeployUriSpy: jest.SpyInstance<ReturnType<ArtifactService["getDeployUri"]>>;
    beforeEach(() => {
        getDeployUriSpy = jest.spyOn(ArtifactService.prototype, "getDeployUri");
    });
    it("should render ", async () => {
        const props: IModelSectionProps = {
            experimentName: "experimentName",
            run: childRun,
            pageName: PageNames.ChildRun,
            parentRun,
            onModelDeploy: mockCallBack
        };
        const tree = await renderModelSection(props);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should populated deployed info ", async () => {
        const props: IModelSectionProps = {
            experimentName: "experimentName",
            run: { ...childRun, tags: { operation_id: "operation_id", deploy_name: "deploy_name", model_id: "model_id" } },
            pageName: PageNames.ChildRun,
            parentRun,
            onModelDeploy: mockCallBack
        };
        const tree = await renderModelSection(props);
        expect(tree.state())
            .toEqual(expect.objectContaining({
                condaUri: "condaUri",
                modelUri: "modelUri",
                scoringUri: "scoringUri",
                operationId: undefined
            }));
    });
    it("should get deploy uri", async () => {
        const props: IModelSectionProps = {
            experimentName: "experimentName",
            run: { ...childRun },
            pageName: PageNames.ChildRun,
            parentRun,
            onModelDeploy: mockCallBack
        };
        const tree = await renderModelSection(props);
        expect(tree.state())
            .toEqual(expect.objectContaining({
                modelUri: "modelUri",
                condaUri: "condaUri",
                scoringUri: "scoringUri"
            }));
    });
    it("should not set deploy uri", async () => {
        getDeployUriSpy.mockReturnValue(Promise.resolve(undefined));
        const props: IModelSectionProps = {
            experimentName: "experimentName",
            run: { ...childRun },
            pageName: PageNames.ChildRun,
            parentRun,
            onModelDeploy: mockCallBack
        };
        const tree = await renderModelSection(props);
        expect(tree.state())
            .toEqual(expect.objectContaining({
                modelUri: undefined,
                condaUri: undefined,
                scoringUri: undefined
            }));
        expect(getDeployUriSpy)
            .toBeCalledTimes(1);
    });
    it("should call deploy callback", async () => {
        getDeployUriSpy.mockImplementation(() => { throw restCanceledError; });
        const props: IModelSectionProps = {
            experimentName: "experimentName",
            run: { ...childRun },
            pageName: PageNames.ChildRun,
            parentRun,
            onModelDeploy: mockCallBack
        };
        const tree = await renderModelSection(props);
        tree.find(ModelDeploy)
            .prop("onModelDeploy")
            ("operation_id");

        expect(tree.state())
            .toEqual(expect.objectContaining({
                condaUri: undefined,
                operationId: "operation_id",
                modelUri: undefined,
                scoringUri: undefined,
            }));
        expect(mockCallBack)
            .toBeCalledTimes(1);
    });
});
