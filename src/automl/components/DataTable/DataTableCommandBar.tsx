import { DefaultButton, IOverflowSetItemProps, OverflowSet, SearchBox } from "office-ui-fabric-react";
import * as React from "react";

export interface IDataTableCommandItem {
    key: string;
    name: string;
    icon?: string;
    onClick(): void;
}

export interface IDataTableCommandBarProps {
    hideFilterBox?: boolean;
    commandItems?: IDataTableCommandItem[];
    overflowItems?: IDataTableCommandItem[];
    onFilterBoxTextChanged?(text: string | undefined): void;
}

export class DataTableCommandBar extends React.Component<IDataTableCommandBarProps>{
    public render(): React.ReactNode {
        let items: IOverflowSetItemProps[] = [];
        let overflowItems: IOverflowSetItemProps[] = [];

        if (!this.props.hideFilterBox) {
            items.push({
                key: "search",
                class: "test",
                onRender: this.renderSearchBox
            });
        }

        if (this.props.commandItems) {
            items = [...items, ...this.props.commandItems];
        }

        if (this.props.overflowItems) {
            overflowItems = [...overflowItems, ...this.props.overflowItems];
        }

        let className = "commands";
        if (!this.props.hideFilterBox) {
            className += " has-filter";
        }

        return <OverflowSet
            className={className}
            items={items}
            overflowItems={overflowItems}
            onRenderItem={this.onRenderItem}
            onRenderOverflowButton={this.onRenderOverflowButton}
        />;
    }

    public readonly onRenderItem = (item: IOverflowSetItemProps) => {
        if (item.onRender) {
            return item.onRender(item);
        }
        return <DefaultButton iconProps={{ iconName: item.icon }} menuProps={item.subMenuProps} text={item.name} onClick={item.onClick} />;
    }

    public readonly onRenderOverflowButton = () => {
        return (
            <DefaultButton menuIconProps={{ iconName: "More" }} />
        );
    }

    private readonly renderSearchBox = () => {
        return <SearchBox placeholder="Search to filter items..."
            className="searchBox"
            onChange={this.props.onFilterBoxTextChanged}
            iconProps={{ iconName: "Filter" }}
            underlined={true}
            autoComplete="off" />;
    }
}
