import { Checkbox } from "office-ui-fabric-react";
import * as React from "react";

export interface ICheckListItemProps<T> {
    item: T;
    onChange?(item: T, checked?: boolean): void;
}

export class CheckListItem<T> extends React.Component<ICheckListItemProps<T>>{
    public render(): React.ReactNode {
        return <>
            <div className="ms-Grid checkListItem" dir="ltr">
                <div className="ms-Grid-col">
                    {/*key must be set to a unique value that changes when the item changes to force a re-render of child component. */}
                    <Checkbox className="listItemCheckbox" key={JSON.stringify(this.props.item)}
                        onChange={this.onCheckBoxChange}
                    />
                </div>
                <div className="ms-Grid-col">
                    {this.props.item}
                </div>
            </div>
        </>;
    }

    private readonly onCheckBoxChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        if (this.props.onChange) {
            this.props.onChange(this.props.item, checked);
        }
    }
}
