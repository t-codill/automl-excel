import { shallow } from "enzyme";
import { Link } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../__data__/reactMouseEvent";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import { ArtifactService } from "../services/ArtifactService";
import { ChildRunModelDownloadLink } from "./ChildRunModelDownloadLink";

jest.mock("../services/ArtifactService");
let asGetModelUrl: jest.SpyInstance<ReturnType<ArtifactService["getModelUrl"]>>;

describe("Child Run Model Download Link", () => {
    const completedRunData = {
        runId: "001",
        parentRunId: "000",
        status: "Completed"
    };
    const failedRunData = {
        runId: "001",
        parentRunId: "000",
        status: "Failed"
    };
    beforeEach(() => {
        asGetModelUrl = jest.spyOn(ArtifactService.prototype, "getModelUrl");
    });
    describe("completed run", () => {
        const props = {
            run: completedRunData,
            downloading: false
        };

        it("should render link when downloading is false", () => {

            const tree = shallow(<ChildRunModelDownloadLink {...props} />);
            expect(tree)
                .toMatchSnapshot();
        });
        it("should download when model uri is defined", async () => {
            const logSpy = getLogCustomEventSpy();
            const mockGetUrl = Promise.resolve("mockUri");
            asGetModelUrl.mockReturnValueOnce(mockGetUrl);
            const c = shallow(<ChildRunModelDownloadLink {...props} />);
            const link = c.find(Link)
                .props();
            if (link && link.onClick) {
                link.onClick(reactMouseEvent);
            }
            await Promise.resolve();
            const downloading: boolean = c.state("downloading");
            expect(downloading)
                .toBe(false);
            expect(logSpy)
                .toBeCalledWith("_ModelDownloadFromTable_UserAction",
                    testContext,
                    { childRunId: "001", component: "ModelDownloadFromTable", pageName: "" });
        });
        it("should not download when model uri is undefined", async (done) => {
            const mockGetUrl = Promise.resolve(undefined);
            asGetModelUrl.mockReturnValueOnce(mockGetUrl);
            const tree = shallow(<ChildRunModelDownloadLink {...props} />);
            await mockGetUrl;
            const link = tree.find(Link)
                .props();
            if (link && link.onClick) {
                link.onClick(reactMouseEvent);
                setImmediate(() => {
                    const downloading: boolean = tree.state("downloading");
                    expect(downloading)
                        .toBe(true);
                    done();
                });
            }
        });
        it("should not download when model uri is null", async (done) => {
            const mockGetUrl = Promise.resolve(null);
            asGetModelUrl.mockReturnValueOnce(mockGetUrl);
            const tree = shallow(<ChildRunModelDownloadLink {...props} />);
            await mockGetUrl;
            const link = tree.find(Link)
                .props();
            if (link && link.onClick) {
                link.onClick(reactMouseEvent);
                setImmediate(() => {
                    const downloading: boolean = tree.state("downloading");
                    expect(downloading)
                        .toBe(false);
                    done();
                });
            }
        });
        it("should render spinner when downloading is true", () => {
            props.downloading = true;
            const tree = shallow(<ChildRunModelDownloadLink {...props} />);
            expect(tree)
                .toMatchSnapshot();
        });
    });
    it("should not render anything when run failed", () => {
        const props = {
            run: failedRunData,
            downloading: true
        };
        const tree = shallow(<ChildRunModelDownloadLink {...props} />);
        expect(tree)
            .toMatchSnapshot();
    });
});
