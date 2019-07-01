import { map } from "lodash";
import * as React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import "./GridWrapper.scss";
import { IGridProps } from "./IGridProps";

// tslint:disable-next-line:variable-name
const ReactGridLayoutProvider = WidthProvider(Responsive);

export class GridWrapper extends React.Component<IGridProps> {

    public readonly render = (): React.ReactNode => {
        const columns = {
            lg: 12,
            md: 10,
            sm: 6,
            xs: 4,
            xxs: 2
        };
        const eProps = this.props;
        return (
            <ReactGridLayoutProvider
                cols={eProps.cols || columns}
                rowHeight={eProps.rowHeight}
                margin={eProps.margin}
                measureBeforeMount={true}>
                {this.renderComponents()}
            </ReactGridLayoutProvider>
        );
    }

    private readonly renderComponents = (): JSX.Element[] => {
        return map(this.props.gridElementPropsList, (data) => {
            return (<div className="grid-item" key={data.key} data-grid={{
                i: data.key,
                x: data.x,
                y: data.y,
                w: data.width,
                h: data.height,
                static: true
            }}> {(data.title) ? <div className="grid-item-header"> {data.title} </div> : undefined}
                <div className={data.className || "grid-item-content"}> {data.element} </div>
            </div >);
        });
    }
}
