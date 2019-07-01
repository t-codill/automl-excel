
import * as React from "react";

import "./GridItem.scss";

export class GridItem extends React.Component<{ title?: string }> {
    public readonly render = (): React.ReactNode => {
        return (
            <div className="grid-item">
                {this.props.title && <div className="grid-item-header">{this.props.title}</div>}
                <div className="grid-item-content">{this.props.children}</div>
            </div>
        );
    }
}
