import { shallow, ShallowWrapper } from "enzyme";
import { CompoundButton } from "office-ui-fabric-react";
import * as React from "react";
import { PageNames } from "../../common/PageNames";
import { IModelDeployProps, IModelDeployState, ModelDeploy } from "./ModelDeploy";
import { ModelDeployPanel } from "./ModelDeployPanel";

describe("Model Deploy", () => {
    const onModelRegister = jest.fn();
    it("should render with ParentRun Page", () => {
        const tree = shallow(
            <ModelDeploy
                pageName={PageNames.ParentRun}
                experimentName="test-experiment-name"
                run={undefined}
                parentRun={undefined}
                modelUri={"https://demo.azure.com/model_123"}
                modelId={undefined}
                modelName="test-model-name"
                onModelRegister={onModelRegister} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with ChildRun Page", () => {
        const tree = shallow(
            <ModelDeploy
                pageName={PageNames.ChildRun}
                experimentName="test-experiment-name"
                run={undefined}
                parentRun={undefined}
                modelUri={"https://demo.azure.com/model_123"}
                modelId={undefined}
                modelName="test-model-name"
                onModelRegister={onModelRegister} />);
        expect(tree)
            .toMatchSnapshot();
    });
    describe("Test Function", () => {
        let tree: ShallowWrapper<IModelDeployProps, IModelDeployState>;
        beforeEach(() => {
            tree = shallow(
                <ModelDeploy
                    pageName={PageNames.ParentRun}
                    experimentName="test-experiment-name"
                    run={undefined}
                    parentRun={undefined}
                    modelUri={"https://demo.azure.com/model_123"}
                    modelId={undefined}
                    modelName="test-model-name"
                    onModelRegister={onModelRegister} />);
        });
        it("should render panel when clicked", () => {
            tree.find(CompoundButton)
                .simulate("click");
            expect(tree.state("showDeployPanel"))
                .toBe(true);
        });
        it("should close panel when callback", () => {
            tree.setState({ showDeployPanel: true });
            tree.find(ModelDeployPanel)
                .prop("onCancel")();
            expect(tree.state("showDeployPanel"))
                .toBe(false);
        });
    });

});
