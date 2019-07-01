import { Dialog, DialogType, ProgressIndicator } from "office-ui-fabric-react";
import * as React from "react";

interface IPopupProgressIndicatorProps {
    title?: string;
    description?: string;
    percentComplete?: number;
    onDismiss?(): void;
}

export class PopupProgressIndicator
    extends React.PureComponent<IPopupProgressIndicatorProps> {
    public render(): React.ReactNode {

        return <Dialog
            hidden={false}
            minWidth={800}
            onDismiss={this.props.onDismiss}
            modalProps={{
                isBlocking: !this.props.onDismiss
            }}
            dialogContentProps={{
                type: DialogType.normal,
                title: this.props.title
            }}
        >
            <ProgressIndicator
                description={this.props.description}
                percentComplete={this.props.percentComplete} />
        </Dialog>;
    }
}
