import { isEqual } from "lodash";
import { List } from "office-ui-fabric-react";
import * as React from "react";
import { ValidationError } from "../Form/ValidationError";
import { CheckListItem } from "./CheckListItem";

import "./CheckList.scss";

export interface ICheckListProps {
    id?: string;
    placeholder?: string;
    items: string[];
    maxWidth?: string;
    values?: string[];
    errorMessage?: string;
    onChange?(items: string[] | undefined): void;
}

interface ICheckListState {
    selectedItems: string[];
}

export class CheckList extends React.Component<ICheckListProps, ICheckListState> {
    public constructor(props: ICheckListProps) {
        super(props);
        this.state = {
            selectedItems: this.props.values || []
        };
    }

    public componentDidUpdate(prevProps: ICheckListProps, _prevState: ICheckListState): void {
        if (!isEqual(prevProps.items, this.props.items)) {
            this.setState({ selectedItems: [] });
            if (this.props.onChange) {
                this.props.onChange([]);
            }
        }
    }

    public render(): React.ReactNode {
        return <>
            <List
                id={this.props.id}
                items={this.props.items}
                onRenderCell={this.onRenderCell}
                className="checkList"
                defaultValue={this.state.selectedItems}
                placeholder={this.props.placeholder}
            />
            <ValidationError text={this.props.errorMessage} />
        </>;
    }

    private readonly onSelectionUpdate = (item: string, checked?: boolean) => {
        const selectedItems = this.state.selectedItems;
        const itemIndex = selectedItems.findIndex((other) => other === item);

        if (checked && itemIndex < 0) {
            selectedItems.push(item);
        } else if (!checked) {
            selectedItems.splice(itemIndex, 1);
        }

        this.setState({ selectedItems });

        if (this.props.onChange) {
            this.props.onChange(selectedItems);
        }
    }

    private readonly onRenderCell = (item?: string): React.ReactNode => {
        if (item === undefined) {
            return <></>;
        }
        return <CheckListItem item={item} onChange={this.onSelectionUpdate} />;
    }
}
