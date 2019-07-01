import { Pagination } from "@uifabric/experiments";
import { isEqual } from "lodash";
import moment from "moment";
import {
    CheckboxVisibility,
    ColumnActionsMode,
    ConstrainMode,
    DetailsListLayoutMode,
    IColumn,
    Selection,
    SelectionMode,
    ShimmeredDetailsList,
    TooltipHost
} from "office-ui-fabric-react";
import * as React from "react";
import { compare } from "../../common/compare/index";
import "./DataTable.scss";
import { DataTableCommandBar, IDataTableCommandItem } from "./DataTableCommandBar";
import { DataTableToggle, IDataToggleProps } from "./DataTableToggle";

export type DataTableColumn<TData> = {
    header?: string;
    field: keyof TData;
    valueField?: keyof TData;
    minWidth?: number;
    maxWidth?: number;
    /**
     * Optional iconName to use for the column header.
     */
    headerIconName?: string;
    nanAsMax?: boolean;
} & ({
    render?: never;
} | {
    render(content: React.ReactNode, data: TData): React.ReactNode;
});

/** DataTable component that wraps office-ui-fabric detailsList */
export interface IDataTableProps<TData> {
    /** data */
    items: TData[];
    /** column definitions */
    columns: Array<DataTableColumn<TData>>;
    sortColumnFieldName?: keyof TData;
    sortDescending?: boolean;
    enableShimmer?: boolean;
    shimmerLines?: number;
    /** Number of items to show per page. Can be set to 0 to disable pagination. Default is 10 */
    itemsPerPage?: number;
    /** Filter is on by default can be turned off by setting this flag true */
    hideFilter?: true;
    noSorting?: true;
    commandItems?: IDataTableCommandItem[];
    toggleProps?: IDataToggleProps;
    selectCallback?(data?: TData): void;
}

export interface IDataTableState<TData> {
    items: TData[];
    columns: IColumn[];
    currentPage: number;
    sortColumn: IColumn | undefined;
    sortDescending: boolean;
    filterText: string | undefined;
}

function getColumnOutput<TData>(item: TData, columnDef: DataTableColumn<TData>): string | undefined {
    const value: TData[keyof TData] = item[columnDef.valueField || columnDef.field];
    switch (value) {
        case undefined:
        case null:
            return undefined;
        default:
            switch (typeof (value)) {
                case "number":
                    return String(value);
                case "boolean":
                    return value ? "Yes" : "No";
                case "object":
                    if (value instanceof Date) {
                        return moment(value)
                            .format("M/D/YYYY, h:mm:ss A");
                    }
                    return String(value);
                default:
                    return String(value);
            }
    }
}

function getRows<TData>(data: TData[], itemsPerPage: number, currentPage: number): TData[] {
    if (data.length < itemsPerPage) {
        return data;
    }
    const upperBound = (currentPage + 1) * itemsPerPage;
    const paginatedRows = data.slice(upperBound - itemsPerPage, upperBound);
    return paginatedRows;
}

function getSortColumn<TData>(columns: IColumn[], fieldName: keyof TData | undefined): IColumn | undefined {
    if (!fieldName) {
        return undefined;
    }
    return columns.find((c) => c.fieldName === fieldName);
}

function sortItems<TData>(items: TData[], sortColumn: IColumn, sortDescending: boolean): TData[] {
    const sign = sortDescending ? -1 : 1;
    const columnDef: DataTableColumn<TData> = sortColumn.data;
    const sortBy: keyof TData = columnDef.valueField || columnDef.field;
    return items.sort((a: TData, b: TData) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        return compare(aValue, bValue, { ignoreCase: true, nanAsMax: columnDef.nanAsMax }) * sign;
    }
    );
}

function matchColumnAny<TData>(item: TData, filterText: string, columns: IColumn[]): boolean {
    return columns.some((column) => {
        const val = getColumnOutput(item, column.data);
        return val ? (val.toLowerCase()
            .indexOf(filterText.toLowerCase()) > -1) : false;
    });
}

function filterItems<TData>(items: TData[], filterText: string | undefined, columns: IColumn[]): TData[] {
    return filterText ?
        items.filter((item) => {
            return matchColumnAny(item, filterText, columns);
        }) :
        items;
}

export class DataTable<TData> extends React.PureComponent<IDataTableProps<TData>, IDataTableState<TData>> {
    private readonly selection = new Selection({
        onSelectionChanged: () => {
            const selected = this.selection.getSelection()[0] as TData;
            const selectedIndex = this.selection.getSelectedIndices()[0];
            this.onSelect(selected, selectedIndex);
        }
    });
    constructor(props: IDataTableProps<TData>) {
        super(props);
        this.state = this.getInitState();
    }

    public componentDidMount(): void {
        this.sortAndFilter();
    }

    public componentDidUpdate(prevProps: IDataTableProps<TData>, prevState: IDataTableState<TData>): void {
        if (this.componentNeedsReset(prevProps)) {
            this.setState(this.getInitState());
        }
        else if (this.componentNeedsUpdate(prevState, prevProps)) {
            this.sortAndFilter();
        }
    }

    public render(): React.ReactNode {
        const { columns, items } = this.state;
        let numberOfPages = 1;
        let paginatedRows: TData[] = [];
        const itemsPerPage = this.props.itemsPerPage === undefined ? 10 : this.props.itemsPerPage;
        if (itemsPerPage !== 0) {
            numberOfPages = Math.floor(items.length / itemsPerPage + (items.length % itemsPerPage ? 1 : 0));
            paginatedRows = getRows(items, itemsPerPage, this.state.currentPage);
        } else {
            paginatedRows = this.state.items;
        }

        return (
            <div className={`dataTable ${this.props.selectCallback ? "has-callback" : ""}`}>
                <DataTableCommandBar
                    commandItems={this.props.commandItems}
                    onFilterBoxTextChanged={this.onFilterTextChange}
                />
                <ShimmeredDetailsList
                    items={this.props.toggleProps ? [{}, ...paginatedRows] : paginatedRows}
                    columns={columns}
                    enableShimmer={this.props.enableShimmer}
                    shimmerLines={this.props.shimmerLines || itemsPerPage}
                    setKey="set"
                    layoutMode={DetailsListLayoutMode.justified}
                    isHeaderVisible={true}
                    selectionPreservedOnEmptyClick={true}
                    enterModalSelectionOnTouch={false}
                    selectionMode={SelectionMode.single}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    selection={this.selection}
                    constrainMode={ConstrainMode.horizontalConstrained}
                    onShouldVirtualize={this.onShouldVirtualize}
                    onItemInvoked={this.onSelect}
                    onRenderItemColumn={this.onRenderItemColumn}
                />

                {
                    numberOfPages > 1 &&
                    <Pagination
                        selectedPageIndex={this.state.currentPage}
                        pageCount={numberOfPages}
                        itemsPerPage={this.props.itemsPerPage}
                        totalItemCount={this.props.items.length}
                        format="buttons"
                        previousPageAriaLabel="previous page"
                        nextPageAriaLabel="next page"
                        firstPageAriaLabel="first page"
                        lastPageAriaLabel="last page"
                        pageAriaLabel="page"
                        selectedAriaLabel="selected"
                        onPageChange={this.onPageChange}
                    />

                }
            </div>
        );
    }

    private readonly onSelect = (data?: TData, index?: number): void => {
        if (this.props.toggleProps && index === 0) {
            return;
        }
        if (index === undefined) {
            return;
        }
        if (this.props.selectCallback) {
            this.props.selectCallback(data);
        }
    }

    private componentNeedsUpdate(prevState: IDataTableState<TData>, prevProps: IDataTableProps<TData>): boolean {
        return prevState.filterText !== this.state.filterText
            || prevState.sortColumn !== this.state.sortColumn
            || prevState.sortDescending !== this.state.sortDescending
            || prevProps.items.length !== this.props.items.length
            || !isEqual(prevProps.items, this.props.items);
    }

    private componentNeedsReset(prevProps: IDataTableProps<TData>): boolean {
        return prevProps.columns.length !== this.props.columns.length
            || !isEqual(prevProps.columns, this.props.columns)
            || (!!prevProps.selectCallback && !this.props.selectCallback)
            || (!prevProps.selectCallback && !!this.props.selectCallback)
            || (prevProps.sortColumnFieldName !== this.props.sortColumnFieldName)
            || (prevProps.sortDescending !== this.props.sortDescending)
            || (prevProps.noSorting !== this.props.noSorting);
    }

    private readonly getInitState = () => {
        const columns = this.convertColumns();
        const sortColumn = getSortColumn(columns, this.props.sortColumnFieldName);
        const items = [...this.props.items];
        return {
            items,
            columns,
            currentPage: 0,
            sortColumn,
            sortDescending: this.props.sortDescending || false,
            filterText: undefined
        };
    }

    private readonly sortAndFilter = (): void => {
        this.setState((prev) => {
            let items = [...this.props.items];
            if (prev.sortColumn) {
                items = sortItems(items, prev.sortColumn, prev.sortDescending);
            }
            items = filterItems(items, prev.filterText, prev.columns);
            const newColumns: IColumn[] = prev.columns.map((col) => {
                return {
                    ...col,
                    isSorted: prev.sortColumn && prev.sortColumn.fieldName === col.fieldName,
                    isSortedDescending: prev.sortColumn && prev.sortColumn.fieldName === col.fieldName ? prev.sortDescending : true
                };
            });
            return { columns: newColumns, items };
        }
        );
    }

    private readonly onShouldVirtualize = () => true;

    private readonly onPageChange = (index: number): void => {
        this.setState({ currentPage: index });
    }

    private readonly onFilterTextChange = (text?: string): void => {
        this.setState({
            filterText: text
        });
    }

    private readonly onColumnClick = (_ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        this.setState({
            sortColumn: column,
            sortDescending: !column.isSortedDescending
        });
    }

    private readonly onRenderItemColumn = (item?: TData, index?: number, column?: IColumn) => {
        if (!column) {
            return undefined;
        }
        if (!item) {
            return undefined;
        }
        if (this.props.toggleProps && index === 0) {
            return <DataTableToggle toggleProps={this.props.toggleProps} columnName={column.fieldName} />;
        }

        const columnDef: DataTableColumn<TData> = column.data;
        const content = getColumnOutput(item, columnDef);
        if (columnDef.render) {
            return columnDef.render(content, item);
        }
        return (
            <TooltipHost content={content} calloutProps={{ gapSpace: 0 }}>
                {content}
            </TooltipHost>);
    }

    private readonly convertColumns = () => {
        return this.props.columns.map((k, i): IColumn => {
            return {
                key: `column${i}`,
                name: k.header === undefined ? String(k.field) : k.header,
                fieldName: String(k.field),
                minWidth: k.minWidth || 200,
                maxWidth: k.maxWidth,
                onColumnClick: this.props.noSorting ? undefined : this.onColumnClick,
                data: k,
                isSorted: false,
                isSortedDescending: true,
                isResizable: true,
                iconName: k.headerIconName,
                columnActionsMode: this.props.noSorting ? ColumnActionsMode.disabled : ColumnActionsMode.clickable
            };
        });
    }
}
