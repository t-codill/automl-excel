import { Toggle } from "office-ui-fabric-react";
import * as React from "react";

export interface IDataToggleProps {
    /** Column toggle text to display when it's at the ON position */
    onText?: string;
    /** Column toggle text to display when it's at the OFF position */
    offText?: string;
    /** Column toggle label */
    label?: string;
    defaultState?: boolean;
    onColumnSelectorChanged(columnName?: string, checked?: boolean): void;
}
export interface IDataTableToggleProps {
    toggleProps: IDataToggleProps;
    columnName: string | undefined;
}
export class DataTableToggle extends React.PureComponent<IDataTableToggleProps>{
    public render(): React.ReactNode {
        return <span>
            <Toggle
                defaultChecked={this.props.toggleProps.defaultState}
                label={this.props.toggleProps.label}
                onText={this.props.toggleProps.onText}
                offText={this.props.toggleProps.offText}
                onChange={this.onToggleChanged}
            />
        </span>;
    }

    private readonly onToggleChanged = (_event: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        this.props.toggleProps.onColumnSelectorChanged(this.props.columnName, checked);
    }
}
