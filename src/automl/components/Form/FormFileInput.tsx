import { ITextFieldProps, PrimaryButton, TextField } from "office-ui-fabric-react";
import React from "react";
import { Omit } from "../../common/Omit";
import { blob2string } from "../../common/utils/blob2string";
import { FormBaseInput } from "./FormBaseInput";

export class FormFileInput<
    TData extends { [key in TField]: string | undefined },
    TField extends keyof TData
    > extends FormBaseInput<TData, TField, string | undefined, Omit<
        ITextFieldProps,
        "disabled">>{
    private _fileName: string | undefined;
    private readonly fileInput = React.createRef<HTMLInputElement>();
    public render(): React.ReactNode {
        return <>
            <input type="file"
                accept={this.props.accept}
                hidden={true}
                ref={this.fileInput}
                onChange={this.uploadFile} />
            <TextField
                {...this.props}
                readOnly={true}
                onClick={this.showFilePicker}
                value={this._fileName}
                errorMessage={this.state.errorMessage}
            />
            <PrimaryButton
                text="upload"
                style={{ height: 26 }}
                onClick={this.showFilePicker} />
        </>;
    }

    private readonly showFilePicker = () => {
        if (this.fileInput.current) {
            this.fileInput.current.click();
        }
    }

    private readonly uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        if (input.files && input.files[0]) {
            this._fileName = input.files[0].name;
            const content = await blob2string(input.files[0]);
            this.setValue(content);
            return;
        }
        this._fileName = undefined;
        this.setValue(undefined);
    }
}
