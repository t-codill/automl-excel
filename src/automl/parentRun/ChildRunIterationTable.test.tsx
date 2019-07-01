import { shallow } from "enzyme";
import { ShimmeredDetailsList } from "office-ui-fabric-react";
import * as React from "react";
import { DataTable } from "../components/DataTable/DataTable";
import { parentFailureRun } from "./__data__/parentFailureRun";
import { parentSuccessRun } from "./__data__/parentSuccessRun";
import { ChildRunIterationTable } from "./ChildRunIterationTable";

describe("Child Run Iteration Table", () => {

    it("should render 'No Data' when no childRuns", () => {

        const tree = shallow(<ChildRunIterationTable {...parentFailureRun} />);
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render child run iteration table when successful parent run", () => {
        const tree = shallow(<ChildRunIterationTable {...parentSuccessRun} />);
        expect(tree)
            .toMatchSnapshot();

        // force render Name and Iteration and columns
        const datatable = tree.find(DataTable)
            .dive()
            .find(ShimmeredDetailsList)
            .props();
        if (datatable.columns) {
            datatable.columns[6].data.render();
            // render run link
            datatable.columns[1].data.render(undefined, datatable.items[0]);
            datatable.columns[1].data.render(undefined, datatable.items[1]);
        }

    });
    it("should render primary metric if defined", () => {
        const missingPrimaryMetric = parentFailureRun;
        missingPrimaryMetric.childRuns = parentSuccessRun.childRuns;
        const tree = shallow(<ChildRunIterationTable {...missingPrimaryMetric} />);
        expect(tree)
            .toMatchSnapshot();
    });
    it("should render loading image when props undefined", () => {
        const tree = shallow(<ChildRunIterationTable {...parentFailureRun} run={undefined} />);
        expect(tree)
            .toMatchInlineSnapshot("<pageLoadingSpinner />");
    });
});
