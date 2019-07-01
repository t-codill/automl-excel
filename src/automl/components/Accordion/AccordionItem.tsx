import { Icon } from "office-ui-fabric-react";
import * as React from "react";
import { IAccordionItem } from "./Accordion";

export interface IAccordionItemProps extends IAccordionItem {
    index: number;
    toggleCollapsed(index: number): void;
}

export class AccordionItem extends React.Component<IAccordionItemProps>{
    public render(): React.ReactNode {
        return <div className={`accordion ${this.props.collapsed ? "collapsed" : ""} ${this.props.disabled ? "disabled" : ""}`}>
            <div className="header" role="presentation" onClick={this.toggleCollapsed}>
                {
                    this.props.collapsed
                        ? <Icon iconName="ChevronRightMed" />
                        : <Icon iconName="ChevronDownMed" />
                }
                <span className="title">
                    {this.props.title}
                </span>
            </div>
            <div className="content">
                {this.props.element}
            </div>
        </div>;
    }

    private readonly toggleCollapsed = () => {
        if (this.props.disabled) {
            return;
        }
        this.props.toggleCollapsed(this.props.index);
    }

}
