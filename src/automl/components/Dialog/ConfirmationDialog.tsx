import { DefaultButton, Dialog, DialogFooter, DialogType, PrimaryButton } from "office-ui-fabric-react";
import * as React from "react";

export interface IConfirmationDialogProps {
    title: string | undefined;
    subText: string | undefined;
    hidden: boolean;
    onConfirm(): void;
    onClose(): void;
}
export class ConfirmationDialog
    extends React.PureComponent<IConfirmationDialogProps> {
    public render(): React.ReactNode {
        return <Dialog
            hidden={this.props.hidden}
            onDismiss={this.onClose}
            dialogContentProps={{
                type: DialogType.normal,
                title: this.props.title,
                subText: this.props.subText
            }}
            modalProps={{
                isBlocking: false,
                containerClassName: "ms-dialogMainOverride"
            }}
        >
            <DialogFooter>
                <PrimaryButton onClick={this.onConfirm} text="Yes" />
                <DefaultButton onClick={this.onClose} text="No" />
            </DialogFooter>
        </Dialog>;
    }

    private readonly onClose = () => {
        this.props.onClose();
    }

    private readonly onConfirm = () => {
        this.props.onConfirm();
    }
}
