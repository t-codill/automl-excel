import { shallow } from "enzyme";
import * as React from "react";
import { ModelDeploy } from "../components/ModelDownloadDeploy/ModelDeploy";
import { parentSuccessRun } from "../parentRun/__data__/parentSuccessRun";
import { RunHistoryService } from "../services/RunHistoryService";
import { ChildRunModel } from "./ChildRunModel";

describe("ChildRunModel", () => {
    let getRunSpy: jest.SpyInstance<ReturnType<RunHistoryService["getRun"]>>;
    beforeEach(() => {
        getRunSpy = jest.spyOn(RunHistoryService.prototype, "getRun");
    });
    it("should render with undefined", async () => {
        const props = {
            modelUri: undefined,
            experimentName: undefined,
            run: undefined,
            onModelRegister: jest.fn()
        };
        const tree = shallow(<ChildRunModel {...props}
        />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with valid props", async () => {
        const props = {
            modelUri: "Test Uri",
            experimentName: "Test Experiment",
            run: parentSuccessRun.childRuns && parentSuccessRun.childRuns[0],
            onModelRegister: jest.fn()
        };
        const tree = shallow(<ChildRunModel {...props}
        />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render with valid model id", async () => {
        const props = {
            modelUri: "Test Uri",
            experimentName: "Test Experiment",
            run: { ...(parentSuccessRun.childRuns && parentSuccessRun.childRuns[0]), tags: { model_id: "test_model_id" } },
            onModelRegister: jest.fn()
        };
        const tree = shallow(<ChildRunModel {...props}
        />);
        expect(tree.find(ModelDeploy)
            .prop("modelId"))
            .toBe("test_model_id");
    });
    it("should not set parent run if run is undefined ", async (done) => {
        const props = {
            modelUri: "Test Uri",
            experimentName: "Test Experiment",
            run: { ...(parentSuccessRun.childRuns && parentSuccessRun.childRuns[0]), tags: { model_id: "test_model_id" } },
            onModelRegister: jest.fn()
        };
        getRunSpy.mockReturnValue(Promise.resolve(undefined));
        const tree = shallow<ChildRunModel>(<ChildRunModel {...props}
        />);
        setImmediate(() => {
            expect(tree.state("parentRun"))
                .toBeUndefined();
            done();
        });
    });
    it("should not set parent run if run id is undefined ", async (done) => {
        const props = {
            modelUri: "Test Uri",
            experimentName: "Test Experiment",
            run: { ...(parentSuccessRun.childRuns && parentSuccessRun.childRuns[0]), tags: { model_id: "test_model_id" } },
            onModelRegister: jest.fn()
        };
        getRunSpy.mockReturnValue(Promise.resolve({ runId: undefined }));
        const tree = shallow<ChildRunModel>(<ChildRunModel {...props}
        />);
        setImmediate(() => {
            expect(tree.state("parentRun"))
                .toBeUndefined();
            done();
        });
    });
});
