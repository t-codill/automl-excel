import { Callout, DirectionalHint, IconButton, Label } from "office-ui-fabric-react";
import * as React from "react";

import "./LabelWithCallout.scss";

interface ICalloutBasicExampleState {
    isCalloutVisible?: boolean;
}

interface ILabelWithCalloutProps {
    required: boolean;
    htmlFor?: string;
    labelText: string;
}

export class LabelWithCallout extends React.Component<ILabelWithCalloutProps, ICalloutBasicExampleState> {
    private readonly iconButtonElement = React.createRef<HTMLDivElement>();

    public constructor(props: ILabelWithCalloutProps) {
        super(props);

        this.state = {
            isCalloutVisible: false
        };
    }

    public readonly render = (): React.ReactNode => {
        const { isCalloutVisible } = this.state;
        return <>
            <span className="label-with-callout-outer">
                <Label required={this.props.required} htmlFor={this.props.htmlFor}>{this.props.labelText}</Label>
                <div className="ms-CustomRenderExample-labelIconArea" ref={this.iconButtonElement}>
                    <IconButton iconProps={{ iconName: "Info" }} title="Click for Info" ariaLabel="Info" onClick={this.onTooltipIconClicked} />
                </div>
                {isCalloutVisible && (
                    <Callout
                        className="label-with-callout"
                        target={this.iconButtonElement.current}
                        setInitialFocus={true}
                        onDismiss={this.onCalloutDismiss}
                        directionalHint={DirectionalHint.topRightEdge}
                    >
                        <div className="label-with-callout-inner">
                            {this.props.children}
                        </div>
                    </Callout>
                )}
            </span>
        </>;
    }

    private readonly onTooltipIconClicked = (): void => {
        this.setState({
            isCalloutVisible: !this.state.isCalloutVisible
        });
    }

    private readonly onCalloutDismiss = (): void => {
        this.setState({
            isCalloutVisible: false
        });
    }
}
