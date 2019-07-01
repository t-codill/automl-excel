import * as React from "react";
export interface IGridElementProps {
    title?: string;
    element: React.ReactNode;
    key: string;
    x: number;
    y: number;
    width: number;
    height: number;
    className?: string | undefined;
}
