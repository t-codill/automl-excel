import { Icon, Label, TooltipHost } from "office-ui-fabric-react";
import * as React from "react";

import "./LabelWithTooltip.scss";

interface ILabelWithTooltipProps {
    required: boolean;
    htmlFor: string;
    labelText: string;
    tooltipText: string;
}

export class LabelWithTooltip extends React.Component<ILabelWithTooltipProps> {
    public readonly render = (): React.ReactNode => {
        return <span className="label-with-tooltip-outer">
            <Label required={this.props.required} htmlFor={this.props.htmlFor}>{this.props.labelText}</Label>
            <TooltipHost content={this.props.tooltipText} closeDelay={500}>
                <Icon className="label-wrapper-icon" iconName="Info" ariaLabel="Info" />
            </TooltipHost>
        </span>;
    }
}
