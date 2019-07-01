import { shallow, ShallowWrapper } from "enzyme";
import { PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { PageRedirectRender } from "../components/Redirect/PageRedirectRender";
import { Welcome } from "./Welcome";

describe("Welcome", () => {
    let tree: ShallowWrapper;
    beforeAll(() => {
        tree = shallow(
            <Welcome />
        );
    });

    it("should render correctly", () => {
        expect(tree)
            .toMatchSnapshot();
    });

    it("should redirect to start run page after 'Create Experiment' clicked", () => {
        const logSpy = getLogCustomEventSpy();
        tree.find(PrimaryButton)
            .simulate("click");
        expect(tree.find(PageRedirectRender)
            .props())
            .toEqual({
                expendedRoutePath: "startRun",
                noPush: false,
            });
        expect(logSpy)
            .toBeCalledWith("Welcome_CreateExperiment_UserAction",
                testContext,
                { component: "CreateExperiment", pageName: "Welcome" });
    });
});
