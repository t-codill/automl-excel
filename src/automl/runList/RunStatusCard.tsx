import { FocusZone } from "office-ui-fabric-react";
import * as React from "react";

import "./RunStatusCard.scss";

export interface IRunStatusCardProps {
    runStatusLabel: string;
    runStatusCount: number;
    isActive: boolean;
    className: string;
    handleStatusFilterChange(
        statusFilter: string | undefined
    ): void;
}
export class RunStatusCard extends React.Component<IRunStatusCardProps>{
    public readonly render = (): React.ReactNode => {
        let filterText = "Filter";
        let className = "run-status-card";
        if (this.props.isActive) {
            className += " active-card";
            filterText = "Remove Filter";
        }
        return (
            <FocusZone key={this.props.runStatusLabel}
                className={this.props.className}
                onClick={this.statusChange}>
                <div className={className}>
                    <div>{this.props && this.props.runStatusLabel}</div>
                    <div>{this.props && this.props.runStatusCount}</div>
                    <div className="filter-tag">{filterText}</div>
                </div>
            </FocusZone >
        );
    }
    public statusChange = (_event: React.MouseEvent<HTMLElement>): void => {
        if (this.props.isActive) {
            this.props.handleStatusFilterChange(undefined);
        }
        else {
            this.props.handleStatusFilterChange(this.props.runStatusLabel);
        }
    }
}
