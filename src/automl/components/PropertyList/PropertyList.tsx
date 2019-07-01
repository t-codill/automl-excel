
import { isEmpty, map } from "lodash";
import { CheckboxVisibility, DetailsList, IColumn, MessageBar } from "office-ui-fabric-react";
import * as React from "react";
import { BasicTypes } from "../../common/BasicTypes";
import { IDictionary } from "../../common/IDictionary";

import "./PropertyList.scss";

export class PropertyList extends React.Component<{
    listElements: IDictionary<BasicTypes | React.ReactNode>;
}> {
    private readonly columns: IColumn[] = [
        {
            key: "key",
            name: "key",
            fieldName: "key",
            minWidth: 20,
            maxWidth: 200,
            isResizable: false,
            className: "propertyListProp"
        },
        {
            key: "value",
            name: "value",
            fieldName: "value",
            minWidth: 100,
            isResizable: false,
            className: "propertyListValue"
        }
    ];
    public readonly render = (): React.ReactNode => {
        if (isEmpty(this.props.listElements)) {
            return <MessageBar>No data</MessageBar>;
        }

        return (
            <DetailsList
                className="propertyList"
                columns={this.columns}
                items={this.formatRows()}
                checkboxVisibility={CheckboxVisibility.hidden}
                isHeaderVisible={false} />
        );
    }
    private readonly formatRows = () => {
        return map(this.props.listElements, (value, key) => {
            if (Array.isArray(value)) {
                return { key, value: value.join(", ") };
            }
            return { key, value };
        })
            .filter((item) => item.value);
    }
}
