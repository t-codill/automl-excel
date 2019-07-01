import { IGridElementProps } from "./IGridElementProps";

export interface IGridProps {
    cols?: {
        lg: number;
        md: number;
        sm: number;
        xs: number;
        xxs: number;
    } | undefined;
    rowHeight?: number | undefined;
    margin?: [number, number] | undefined;
    gridElementPropsList: IGridElementProps[];
}
