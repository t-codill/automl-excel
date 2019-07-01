import { shallow } from "enzyme";
import { CompoundButton } from "office-ui-fabric-react";
import * as React from "react";
import { getLogCustomEventSpy, testContext } from "../../common/context/__data__/testContext";
import { PageNames } from "../../common/PageNames";
import * as download from "../../common/utils/download";
import { ModelDownload } from "./ModelDownload";

describe("Model Download", () => {
    it("should render when no runName or uri", () => {
        const tree = shallow(<ModelDownload
            pageName={PageNames.ParentRun}
            experimentName="test-experiment-name"
            run={undefined}
            modelName={undefined}
            modelUri={undefined} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with runName and uri", () => {
        const tree = shallow(<ModelDownload
            pageName={PageNames.ParentRun}
            experimentName="test-experiment-name"
            run={undefined}
            modelName={"Test"}
            modelUri={"TestUrl"} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should download model", async () => {
        const tree = shallow(<ModelDownload
            pageName={PageNames.ChildRun}
            experimentName="test-experiment-name"
            run={{
                runId: "test-run-id"
            }}
            modelName={"Test"}
            modelUri={"TestUrl"} />);
        const downloadSpy = jest.spyOn(download, "download");
        const loggerUserAction = getLogCustomEventSpy();
        tree.find(CompoundButton)
            .simulate("click");
        await Promise.resolve();
        expect(downloadSpy)
            .toBeCalledWith("TestUrl", "model.pkl");
        expect(loggerUserAction)
            .toBeCalledWith(
                "_ModelDownloadFromButton_UserAction",
                testContext,
                {
                    component: "ModelDownloadFromButton",
                    experimentName: "test-experiment-name",
                    modelUri: "TestUrl",
                    pageName: "",
                    runId: "test-run-id"
                }
            );
    });
    it("should not download without url", (done) => {
        const tree = shallow(<ModelDownload
            pageName={PageNames.ChildRun}
            experimentName="test-experiment-name"
            run={undefined}
            modelName={"Test"}
            modelUri={undefined} />);
        const downloadSpy = jest.spyOn(download, "download");
        tree.find(CompoundButton)
            .simulate("click");
        setImmediate(() => {
            expect(downloadSpy)
                .toBeCalledTimes(0);
            done();
        });
    });
});
