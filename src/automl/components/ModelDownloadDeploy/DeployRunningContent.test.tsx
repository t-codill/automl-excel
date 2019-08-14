import { shallow } from "enzyme";
import * as React from "react";
import { childRun } from "./__data__/childRun";
import { DeployRunningContent } from "./DeployRunningContent";

describe("Deploy Succeed Content", () => {
    it("should render with valid property", () => {
        const tree = shallow(<DeployRunningContent
            deployName="AAA"
            run={childRun}
            startTime="test-start-time"
        />);
        expect(tree)
            .toMatchSnapshot();
    });
});
