import * as React from "react";
import { AccordionItem } from "./AccordionItem";

import "./Accordion.scss";

export interface IAccordionItem {
    title?: React.ReactNode;
    collapsed?: boolean;
    disabled?: boolean;
    element: React.ReactNode;
}

export interface IAccordionProps {
    exclusive: boolean;
    items: IAccordionItem[];
}

interface IAccordionState {
    collapsed: boolean[];
}

function getCollapsed(exclusive: boolean, items: IAccordionItem[]): boolean[] {
    let activeCount = 0;
    const res = items.map((i) => {
        return (i.collapsed || !(!exclusive || (activeCount++ === 0)) || false);
    });
    return res;
}

export class Accordion extends React.Component<IAccordionProps, IAccordionState>{
    constructor(props: IAccordionProps) {
        super(props);
        this.state = { collapsed: getCollapsed(this.props.exclusive, this.props.items) };
    }
    public updateCollapsed = () => {
        this.setState({ collapsed: getCollapsed(this.props.exclusive, this.props.items) });
    }
    public componentDidUpdate(prevProps: IAccordionProps): void {
        if (prevProps.exclusive !== this.props.exclusive
            || prevProps.items.length !== this.props.items.length
            || prevProps.items.some(
                (v, i) =>
                    v.collapsed !== this.props.items[i].collapsed
                    || v.disabled !== this.props.items[i].disabled
            )
        ) {
            this.updateCollapsed();
        }
    }
    public render(): React.ReactNode {
        return <>
            {
                this.props.items.map((c, i) =>
                    <AccordionItem
                        key={i.toString()}
                        {...c}
                        index={i}
                        collapsed={this.state.collapsed[i]}
                        toggleCollapsed={this.toggleCollapsed}
                    />
                )
            }
        </>;
    }

    private readonly toggleCollapsed = (index: number) => {
        if (this.props.exclusive) {
            this.setState((prev) => {
                const collapsed = Array<boolean>(prev.collapsed.length)
                    .fill(true);
                collapsed[index] = !prev.collapsed[index];
                return { collapsed };
            });
        }
        else {
            this.setState((prev) => {
                prev.collapsed[index] = !prev.collapsed[index];
                return { collapsed: prev.collapsed };
            });
        }
    }

}
