import { shallow } from "enzyme";
import JSZip from "jszip";
import { Link } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../__data__/reactMouseEvent";
import * as saveAs from "../common/utils/saveAs";
import { parentSuccessRun } from "../parentRun/__data__/parentSuccessRun";
import { ArtifactService } from "../services/ArtifactService";
import { RunLogs } from "./RunLogs";

jest.mock("../services/ArtifactService");
jest.mock("../common/utils/saveAs");
jest.mock("jszip");
let asGetAllArtifacts: jest.SpyInstance<ReturnType<ArtifactService["getAllArtifacts"]>>;
let asGetAllContents: jest.SpyInstance<ReturnType<ArtifactService["getAllContents"]>>;

describe("Run Logs", () => {
    const successRun = parentSuccessRun.run;
    const setupRunId = "AutoML_000_setup";
    beforeEach(() => {
        asGetAllContents = jest.spyOn(ArtifactService.prototype, "getAllContents");
        asGetAllArtifacts = jest.spyOn(ArtifactService.prototype, "getAllArtifacts");
    });

    it("should render with setup run id", (done) => {
        const setupTree = shallow(<RunLogs run={{ ...successRun, properties: { SetupRunId: setupRunId } }} />);
        setImmediate(() => {
            expect(setupTree)
                .toMatchSnapshot();
            done();
        });
    });

    it("should render without setup run id", (done) => {
        const tree = shallow(<RunLogs run={successRun} />);
        setImmediate(() => {
            expect(tree)
                .toMatchSnapshot();
            done();
        });
    });

    it("should not download if no contents", (done) => {
        asGetAllContents.mockReturnValue(Promise.resolve(undefined));
        const wrapper = shallow(<RunLogs run={successRun} />);
        setImmediate(() => {
            const link = wrapper.find(Link)
                .props();
            if (link && link.onClick) {
                link.onClick(reactMouseEvent);
            }
            const downloadingLogs: boolean = wrapper.state("downloadingLogs");
            expect(downloadingLogs)
                .toBe(true);
            done();
        });

    });

    it("should download when link clicked", (done) => {
        const tree = shallow(<RunLogs run={{ ...successRun, properties: { SetupRunId: setupRunId } }} />);
        setImmediate(() => {
            const link = tree.find(Link)
                .props();
            const saveAsSpy = jest.spyOn(saveAs, "saveAs");
            if (link.onClick) {
                link.onClick(reactMouseEvent);
            }
            setImmediate(() => {
                expect(saveAsSpy)
                    .toBeCalled();
                done();
            });
        });
    });

    it("should filter blank files in download", (done) => {
        asGetAllContents.mockReturnValue(Promise.resolve([undefined, ""]));
        const zipFileSpy = jest.spyOn(JSZip.prototype, "file");
        const zipGenerateSpy = jest.spyOn(JSZip.prototype, "generateAsync");
        const tree = shallow(<RunLogs run={{ ...successRun }} />);
        setImmediate(() => {
            const link = tree.find(Link)
                .props();
            if (link.onClick) {
                link.onClick(reactMouseEvent);
            }
            setImmediate(() => {
                expect(zipFileSpy)
                    .toBeCalledTimes(0);
                expect(zipGenerateSpy)
                    .toBeCalledWith({ type: "blob" });
                done();
            });
        });
    });

    it("should render page loading spinner if get all artifacts returns undefined", (done) => {
        asGetAllArtifacts.mockReturnValue(Promise.resolve(undefined));
        const wrapper = shallow(<RunLogs run={successRun} />);
        setImmediate(() => {
            expect(wrapper)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
            done();
        });
    });

    it("should render loading image when run id undefined", (done) => {
        const wrapper = shallow(<RunLogs run={{ ...successRun, runId: undefined }} />);
        setImmediate(() => {
            expect(wrapper)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
            done();
        });
    });

    it("should render loading image when no run", (done) => {
        const wrapper = shallow(<RunLogs run={undefined} />);
        setImmediate(() => {
            expect(wrapper)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
            done();
        });
    });

    it("should render with setup run id but setup canceled", (done) => {
        const setupTree = shallow(<RunLogs run={{ ...successRun, properties: { SetupRunId: setupRunId } }} />);
        asGetAllArtifacts.mockImplementation(async (runId: string) => {
            if (runId === setupRunId) {
                return undefined;
            }
            return [
                {
                    artifactId: "artifactId1",
                    path: "path1"
                },
                {
                    artifactId: "artifactId2",
                    path: "path2"
                }
            ];
        });
        setImmediate(() => {
            expect(setupTree)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
            done();
        });
    });

    it("should get logs when log path, container or origin is null", (done) => {
        asGetAllArtifacts.mockReturnValue(Promise.resolve([
            {
                artifactId: "artifactId1"
            }
        ]));
        const wrapper = shallow<RunLogs>(<RunLogs run={successRun} />);
        setImmediate(() => {
            expect(wrapper.state().logs)
                .toEqual([{
                    container: "",
                    logName: "",
                    origin: "",
                    path: "",
                    prefix: "",
                }]);
            done();
        });
    });
});
