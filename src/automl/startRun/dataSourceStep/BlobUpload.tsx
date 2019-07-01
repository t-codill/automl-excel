import * as React from "react";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { PopupProgressIndicator } from "../../components/Progress/PopupProgressIndicator";
import { BlockBlobService, IBlockBlobServiceProps } from "../../services/BlockBlobService";

export interface IBlobUploadProps extends IBlockBlobServiceProps {
    file: File;
    cancel(): void;
    complete(): void;
}
export class BlobUpload
    extends BaseComponent<IBlobUploadProps, { percentComplete: number }, {
        blockBlobService: BlockBlobService;
    }> {
    protected readonly serviceConstructors = {
        blockBlobService: BlockBlobService,
    };

    constructor(props: IBlobUploadProps) {
        super(props);
        this.state = {
            percentComplete: 0
        };
    }

    public render(): React.ReactNode {
        return <PopupProgressIndicator
            title="Uploading dataset"
            description={`Uploading ${this.props.file.name} to azure storage.`}
            percentComplete={this.state.percentComplete}
            onDismiss={this.props.cancel}
        />;
    }
    protected readonly getData = async () => {
        const result = await this.services.blockBlobService.uploadBlob(this.props.file, this.updatePercent);
        if (!result) {
            return;
        }
        this.props.complete();
    }

    private readonly updatePercent = (percent: number) => {
        this.setState({ percentComplete: percent });
    }

}
