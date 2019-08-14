import { shallow, ShallowWrapper } from "enzyme";
import { Link } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import * as saveAsModule from "../../common/utils/saveAs";
import { ModelManagementService } from "../../services/ModelManagementService";
import { DeployFailedContent, IDeployFailedContentProps, IDeployFailedContentState } from "./DeployFailedContent";

jest.mock("../../services/ModelManagementService");

let mockGetDeployLogs: jest.SpyInstance<ReturnType<ModelManagementService["getDeployLogs"]>>;

describe("Deploy Failed Content", () => {
    beforeEach(() => {
        mockGetDeployLogs = jest.spyOn(ModelManagementService.prototype, "getDeployLogs");
    });

    describe("if no log", () => {
        let deployLogs: Promise<string | undefined>;
        let tree: ShallowWrapper<IDeployFailedContentProps, IDeployFailedContentState>;

        beforeEach(async () => {
            deployLogs = Promise.resolve(undefined);
            mockGetDeployLogs.mockReturnValue(deployLogs);

            tree = shallow(<DeployFailedContent
                deployName="AAA"
                startTime="test-start-time"
            />);

            await deployLogs;
        });

        it("should render", async () => {
            expect(tree)
                .toMatchSnapshot();
        });

        it("should not trigger download", async () => {
            const link = tree.find(Link)
                .props();
            const saveAsSpy = jest.spyOn(saveAsModule, "saveAs");
            if (link.onClick) {
                link.onClick(reactMouseEvent);
            }
            expect(saveAsSpy)
                .not
                .toBeCalled();
        });
    });

    describe("if has logs", () => {
        let deployLogs: Promise<string | undefined>;
        let tree: ShallowWrapper<IDeployFailedContentProps, IDeployFailedContentState>;

        beforeEach(async () => {
            deployLogs = Promise.resolve("testLog");
            mockGetDeployLogs.mockReturnValue(deployLogs);

            tree = shallow(<DeployFailedContent
                deployName="AAA"
                startTime="test-start-time"
            />);

            await deployLogs;
        });

        it("should render", async () => {
            expect(tree)
                .toMatchSnapshot();
        });

        it("should trigger download", async () => {
            const link = tree.find(Link)
                .props();
            const saveAsSpy = jest.spyOn(saveAsModule, "saveAs");
            if (link.onClick) {
                link.onClick(reactMouseEvent);
            }
            expect(saveAsSpy)
                .toMatchSnapshot();
        });

    });
});
