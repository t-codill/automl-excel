import { ArtifactAPIModels } from "@vienna/artifact";
import { shallow } from "enzyme";
import JSZip from "jszip";
import { Dropdown, ICommandBarItemProps } from "office-ui-fabric-react";
import * as React from "react";
import { reactFormEvent } from "../__data__/reactFormEvent";
import { getLogCustomEventSpy, testContext } from "../common/context/__data__/testContext";
import * as saveAsModule from "../common/utils/saveAs";
import { BaseComponent } from "../components/Base/BaseComponent";
import { PageRedirectRender } from "../components/Redirect/PageRedirectRender";
import { ArtifactService } from "../services/ArtifactService";
import { LogDetails } from "./LogDetails";

jest.mock("../services/ArtifactService");

let asSaveAs: jest.SpyInstance<void, [Blob, string]>;
let asGetAllContents: jest.SpyInstance<ReturnType<ArtifactService["getAllContents"]>>;
let asGetAllArtifactsForRuns: jest.SpyInstance<ReturnType<ArtifactService["getAllArtifactsForRuns"]>>;
let asJSZipFile: jest.SpyInstance<ReturnType<JSZip["file"]>>;

const renderLogDetailsWithMockArtifacts = async (artifacts: ArtifactAPIModels.ArtifactDto[][] | undefined) => {
    const mockArtifacts = Promise.resolve(artifacts);
    asGetAllArtifactsForRuns.mockReturnValue(mockArtifacts);
    let buttons: ICommandBarItemProps[] = [];
    jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
        .mockImplementation((b) => { buttons = b; });
    const wrapper = shallow<LogDetails>(<LogDetails runId="run_id" experimentName="experiment_name" runType="parent" />);
    await mockArtifacts;
    const downloadAll = buttons.find((b) => b.key === "download");
    return { wrapper, downloadAll };
};

describe("LogDetails", () => {
    const logs = [
        {
            artifactId: "empty.log",
            path: undefined
        },
        {
            artifactId: "log.log",
            path: "log.log"
        },
        {
            artifactId: "60_control_log.txt",
            path: "azureml-logs/60_control_log.txt"
        },
        {
            artifactId: "80_driver_log.txt",
            path: "azureml-logs/80_driver_log.txt"
        }
    ];

    beforeEach(() => {
        asJSZipFile = jest.spyOn(JSZip.prototype, "file");
        asSaveAs = jest.spyOn(saveAsModule, "saveAs");
        asGetAllContents = jest.spyOn(ArtifactService.prototype, "getAllContents");
        asGetAllArtifactsForRuns = jest.spyOn(ArtifactService.prototype, "getAllArtifactsForRuns");
    });

    describe("go back", () => {
        it("to parent", () => {
            const wrapper = shallow(<LogDetails runId="run_id" experimentName="experiment_name" runType="parent" />);
            wrapper.setState({ goBack: true });
            expect(wrapper.find(PageRedirectRender)
                .props())
                .toEqual({
                    expendedRoutePath: "experiments/experiment_name/parentrun/run_id",
                    noPush: false,
                });
        });

        it("to child", () => {
            const wrapper = shallow(<LogDetails runId="run_id" experimentName="experiment_name" runType="child" />);
            wrapper.setState({ goBack: true });
            expect(wrapper.find(PageRedirectRender)
                .props())
                .toEqual({
                    expendedRoutePath: "experiments/experiment_name/childrun/run_id",
                    noPush: false,
                });
        });
    });

    describe("render", () => {

        it("should render page loading spinner by default", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts(undefined);
            expect(wrapper)
                .toMatchInlineSnapshot("<pageLoadingSpinner />");
        });

        it("should render empty message if get all artifacts returns empty", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([[], []]);
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should render with only run logs", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([logs, []]);
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should render with only setup run logs", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([[], logs]);
            expect(wrapper)
                .toMatchSnapshot();
        });

        it("should render with both run and setup run logs", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([logs, logs]);
            expect(wrapper)
                .toMatchSnapshot();
        });
    });

    describe("change file", () => {
        it("should ignore if no selected", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([logs, []]);
            const ddWrapper = wrapper.find(Dropdown);
            const ddProps = ddWrapper.props();
            if (ddProps && ddProps.onChange) {
                ddProps.onChange(reactFormEvent, undefined);
            }
            expect(wrapper.state("selectedOption"))
                .toBeDefined();
        });

        it("should change selected option", async () => {
            const { wrapper } = await renderLogDetailsWithMockArtifacts([logs, []]);
            const onChange = wrapper
                .find(Dropdown)
                .props()
                .onChange;

            const option = {
                key: "azureml-logs/80_driver_log.txt",
                text: "-> 80_driver_log.txt",
                data: logs[0]
            };
            if (onChange) {
                onChange(reactFormEvent, option);
            }
            expect(wrapper.state("selectedOption"))
                .toEqual(option);
        });
    });

    describe("download", () => {
        it("should disable download button", async () => {
            const { downloadAll } = await renderLogDetailsWithMockArtifacts([[], []]);
            let disabled: boolean | undefined;
            if (downloadAll) {
                disabled = downloadAll.disabled;
            }
            expect(disabled)
                .toBe(true);
        });
        it("should not disable download button if not found", async () => {
            const mockArtifacts = Promise.resolve([logs, []]);
            asGetAllArtifactsForRuns.mockReturnValue(mockArtifacts);
            let downloadAll: ICommandBarItemProps | undefined;
            jest.spyOn(BaseComponent.prototype.context, "setNavigationBarButtons")
                .mockImplementation((buttons) => {
                    downloadAll = buttons.find((b) => b.key === "download");
                    if (downloadAll) {
                        downloadAll.key = "downloadBak";
                    }
                });
            shallow<LogDetails>(<LogDetails runId="run_id" experimentName="experiment_name" runType="parent" />);
            await mockArtifacts;
            let disabled: boolean | undefined;
            if (downloadAll) {
                disabled = downloadAll.disabled;
            }
            expect(disabled)
                .toBeUndefined();
        });
        it("should download all", async () => {
            const { downloadAll } = await renderLogDetailsWithMockArtifacts([logs, logs]);
            const logSpy = getLogCustomEventSpy();
            if (downloadAll && downloadAll.onClick) {
                downloadAll.onClick();
            }
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "LogDetails_Download All_UserAction",
                    testContext,
                    { component: "Download All", pageName: "LogDetails", runId: "run_id" }
                );
            expect(asSaveAs)
                .toBeCalledWith(expect.anything(), "log.zip");
        });
        it("should not download if return content is undefined", async () => {
            asGetAllContents.mockReturnValue(Promise.resolve(undefined));
            const { downloadAll } = await renderLogDetailsWithMockArtifacts([logs, logs]);
            if (downloadAll && downloadAll.onClick) {
                downloadAll.onClick();
            }
            await Promise.resolve();
            await Promise.resolve();
            expect(asSaveAs)
                .toHaveBeenCalledTimes(0);
        });
        it("should not add empty files", async () => {
            asGetAllContents.mockReturnValue(Promise.resolve([undefined, undefined]));
            const { downloadAll } = await renderLogDetailsWithMockArtifacts([logs, logs]);
            const logSpy = getLogCustomEventSpy();
            if (downloadAll && downloadAll.onClick) {
                downloadAll.onClick();
            }
            await Promise.resolve();
            await Promise.resolve();
            expect(logSpy)
                .toBeCalledWith(
                    "LogDetails_Download All_UserAction",
                    testContext,
                    { component: "Download All", pageName: "LogDetails", runId: "run_id" }
                );
            expect(asJSZipFile)
                .toHaveBeenCalledTimes(0);
            expect(asSaveAs)
                .toBeCalledWith(expect.anything(), "log.zip");
        });
    });
});
