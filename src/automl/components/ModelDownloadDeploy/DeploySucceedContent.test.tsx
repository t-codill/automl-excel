import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { DeploySucceedContent, IDeploySucceedContentProps } from "./DeploySucceedContent";

describe("Deploy Succeed Content", () => {
    let tree: ShallowWrapper<IDeploySucceedContentProps>;

    it("should render when scoring url is undefined", async () => {
        tree = shallow(<DeploySucceedContent
            deployName="AAA"
            startTime="test-start-time"
            scoringUri={undefined}
        />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with valid property", async () => {
        tree = shallow(<DeploySucceedContent
            deployName="AAA"
            startTime="test-start-time"
            scoringUri="testScoringUrl"
        />);
        expect(tree)
            .toMatchSnapshot();
    });
});
