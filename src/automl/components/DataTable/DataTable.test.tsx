import { Pagination } from "@uifabric/experiments";
import { shallow, ShallowWrapper } from "enzyme";
import { ColumnActionsMode, IColumn, ISelection, IShimmeredDetailsListProps, ShimmeredDetailsList } from "office-ui-fabric-react";
import * as React from "react";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { NotImplementedError } from "../../common/NotImplementedError";
import { DataTable, IDataTableProps, IDataTableState } from "./DataTable";
import { DataTableCommandBar } from "./DataTableCommandBar";
import { DataTableToggle } from "./DataTableToggle";

describe("DataTable", () => {
    interface ITestData {
        boolean: boolean;
        string: string;
        undefined: undefined;
        null: null;
        number: number;
        object: object;
        date: Date;
    }
    let wrapper: ShallowWrapper<IDataTableProps<ITestData>, IDataTableState<ITestData>>;
    const testData: ITestData[] = [
        {
            boolean: true,
            string: "value1",
            undefined,
            null: null,
            number: 12312,
            object: { a: 1, b: "b", c: null },
            date: new Date("2019-02-11T05:45:00.000Z")
        },
        {
            boolean: false,
            string: "value2",
            undefined,
            null: null,
            number: NaN,
            object: { a: 2, b: "b2", c: null },
            date: new Date("2019-02-17T15:45:00.000Z")
        },
        {
            boolean: false,
            string: "value3",
            undefined,
            null: null,
            number: 431431,
            object: { a: 3, b: "b3", c: null },
            date: new Date("2019-02-16T15:45:00.000Z")
        }
    ];
    let detailListProp: IShimmeredDetailsListProps;
    const render = () => <div>this is custom render</div>;
    let columns: IColumn[];
    let onRenderItemColumn: (...[]) => React.ReactNode = () => { throw new NotImplementedError(); };
    beforeEach(() => {
        wrapper = shallow(<DataTable
            items={testData}
            columns={
                [
                    {
                        field: "boolean",
                        header: "test boolean header",
                        headerIconName: "arrow",
                        minWidth: 12,
                        maxWidth: 123,
                    },
                    { field: "string" },
                    { field: "undefined" },
                    { field: "null" },
                    { field: "number" },
                    { field: "object" },
                    { field: "date" },
                    { field: "object", render, header: "custom renderer" }
                ]}
        />);
        detailListProp = wrapper
            .find(ShimmeredDetailsList)
            .props();
        columns = wrapper
            .state("columns");
        if (detailListProp.onRenderItemColumn) {
            onRenderItemColumn = detailListProp.onRenderItemColumn;
        }
    });
    it("should render", () => {
        expect(wrapper)
            .toMatchSnapshot();
    });
    it("should Virtualize ", () => {
        let shouldVirtualize: boolean | undefined;
        if (detailListProp.onShouldVirtualize) {
            shouldVirtualize = detailListProp.onShouldVirtualize({});
        }
        expect(shouldVirtualize)
            .toBe(true);
    });

    describe("columns", () => {
        it("should render", () => {
            expect(
                <>
                    {
                        testData.map((d, di) =>
                            columns
                                .map((c, ci) => <div key={`${di}_${ci}`}>
                                    {detailListProp.onRenderItemColumn ? detailListProp.onRenderItemColumn(d, di, c) : undefined}
                                </div>
                                ))
                    }
                </>
            )
                .toMatchSnapshot();
        });

        it("missing data should render undefined", () => {
            expect(detailListProp.onRenderItemColumn ? detailListProp.onRenderItemColumn(undefined, 1, columns[0]) : <div />)
                .toBeUndefined();
        });

        it("missing column should render undefined", () => {
            expect(detailListProp.onRenderItemColumn ? detailListProp.onRenderItemColumn(testData, undefined, undefined) : <div />)
                .toBeUndefined();
        });
    });

    describe("Toggle", () => {
        const onColumnSelectorChanged = jest.fn();
        beforeEach(() => {
            wrapper.setProps({
                toggleProps: {
                    defaultState: true,
                    label: "toggle",
                    offText: "offText",
                    onText: "onText",
                    onColumnSelectorChanged
                }
            });
        });
        it("should render", () => {
            expect(onRenderItemColumn({}, 0, columns[0]))
                .toMatchSnapshot();
        });
        it("should toggle", () => {
            const toggleProps = shallow(<div>
                {onRenderItemColumn({}, 0, columns[0])}
            </div>)
                .find(DataTableToggle)
                .prop("toggleProps");
            if (toggleProps.onColumnSelectorChanged) {
                toggleProps.onColumnSelectorChanged(columns[0].fieldName, true);
            }
            expect(onColumnSelectorChanged)
                .toBeCalledWith(columns[0].fieldName, true);
        });
    });

    describe("Selection", () => {
        const selectCallback = jest.fn();
        let selection: ISelection | undefined;
        let onItemInvoked: (item: ITestData, index?: number) => void = () => { throw new NotImplementedError(); };
        beforeEach(() => {
            wrapper.setProps({
                selectCallback
            });
            detailListProp = wrapper.find(ShimmeredDetailsList)
                .props();
            if (detailListProp.selection) {
                selection = detailListProp.selection;
            }
            if (detailListProp.onItemInvoked) {
                onItemInvoked = detailListProp.onItemInvoked;
            }
        });

        it("should render proper class", () => {
            expect(wrapper.find("div.has-callback").length)
                .toBe(1);
        });

        it("should select", () => {
            if (selection) {
                selection.setItems(testData.map((d, i) => ({ ...d, key: i })), true);
                selection.selectToIndex(1);
            }
            expect(selectCallback)
                .toBeCalledWith(expect.objectContaining(testData[0]));
        });

        it("first toggle row should not selected", () => {
            wrapper.setProps({
                toggleProps: {
                    defaultState: true,
                    label: "toggle",
                    offText: "offText",
                    onText: "onText",
                    onColumnSelectorChanged: jest.fn()
                }
            });
            if (selection) {
                selection.setItems(testData.map((d, i) => ({ ...d, key: i })), true);
                selection.selectToIndex(0);
            }
            expect(selectCallback)
                .not
                .toBeCalled();
        });

        it("missing index should not selected", () => {
            onItemInvoked(testData[0], undefined);
            expect(selectCallback)
                .not
                .toBeCalled();
        });

        it("missing selectCallback should not selected", () => {
            wrapper.setProps({
                selectCallback: undefined
            });
            onItemInvoked(testData[0], 0);
            expect(selectCallback)
                .not
                .toBeCalled();
        });
    });

    describe("Pagination", () => {
        it("should not render if there are less than 10 items per page", () => {
            expect(wrapper.find(Pagination).length)
                .toBe(0);
        });
        it("should render for item count greater than page count", () => {
            wrapper.setProps({
                itemsPerPage: 1
            });
            expect(wrapper.find(Pagination))
                .toMatchSnapshot();
        });
        it("should not render if page size set to 0", () => {
            wrapper.setProps({
                itemsPerPage: 0
            });
            expect(wrapper.find(Pagination).length)
                .toBe(0);
        });

        it("should change page", () => {
            wrapper.setProps({
                itemsPerPage: 1
            });
            const onPageChange = wrapper
                .find(Pagination)
                .prop("onPageChange");
            if (onPageChange) {
                onPageChange(1);
            }
            expect(wrapper
                .find(ShimmeredDetailsList)
                .prop("items"))
                .toEqual([testData[1]]);
        });
    });

    describe("Filter", () => {
        let onFilterBoxTextChanged: (text: string) => void = () => { throw new NotImplementedError(); };
        beforeEach(() => {
            const commandBarProps = wrapper
                .find(DataTableCommandBar)
                .props();
            if (commandBarProps.onFilterBoxTextChanged) {
                onFilterBoxTextChanged = commandBarProps.onFilterBoxTextChanged;
            }
        });
        it("should filter correct results", () => {
            onFilterBoxTextChanged("value3");
            expect(wrapper.state("items"))
                .toEqual([testData[2]]);
        });
    });

    describe("Sorting", () => {
        it("should Populate default sort", () => {
            wrapper.setProps({
                sortColumnFieldName: "boolean"
            });
            expect(wrapper.state())
                .toEqual(expect.objectContaining(
                    {
                        sortDescending: false,
                        sortColumn: expect.objectContaining({
                            fieldName: "boolean"
                        })
                    }
                ));
        });

        it("should sort ascending", () => {
            // sort by date
            if (columns[6].onColumnClick) {
                columns[6].onColumnClick(reactMouseEvent, columns[6]);
            }
            expect(wrapper.state("items"))
                .toEqual([testData[0], testData[2], testData[1]]);
        });

        it("should sort descending", () => {
            // sort by date descending
            if (columns[6].onColumnClick) {
                columns[6].onColumnClick(reactMouseEvent, columns[6]);
            }
            columns = wrapper.state("columns");
            if (columns[6].onColumnClick) {
                columns[6].onColumnClick(reactMouseEvent, columns[6]);
            }
            expect(wrapper.state("items"))
                .toEqual([testData[1], testData[2], testData[0]]);
        });

        it("no sort", () => {
            wrapper.setProps({
                noSorting: true
            });
            columns = wrapper.state("columns");
            expect(columns[6])
                .toEqual(expect.objectContaining({
                    onColumnClick: undefined,
                    columnActionsMode: ColumnActionsMode.disabled
                }));
        });
    });
});
