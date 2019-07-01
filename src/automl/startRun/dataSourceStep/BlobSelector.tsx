import { Models } from "@azure/storage-blob";
import { Label } from "office-ui-fabric-react";
import * as React from "react";
import { IDataLoadState } from "../../common/IDataLoadState";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { DataTable } from "../../components/DataTable/DataTable";
import { DataSourceService } from "../../services/DataSourceService";
import { IServiceBaseBlobProps } from "../../services/ServiceBaseBlob";
import { BlobUpload } from "./BlobUpload";

export interface IBlobSelectorProps extends IServiceBaseBlobProps {
    blob: Models.BlobItem | undefined;
    onBlobSelected(blob: Models.BlobItem): void;
}

export interface IBlobSelectorState extends IDataLoadState {
    blobs: Models.BlobItem[] | undefined;
    file: File | undefined;
    inputKey: number;
}

export class BlobSelector
    extends BaseComponent<IBlobSelectorProps, IBlobSelectorState, {
        dataSourceService: DataSourceService;
    }> {
    protected readonly serviceConstructors = {
        dataSourceService: DataSourceService
    };
    private readonly fileInput = React.createRef<HTMLInputElement>();
    constructor(props: IBlobSelectorProps) {
        super(props);
        this.state = {
            isDataLoaded: false,
            blobs: undefined,
            file: undefined,
            inputKey: Date.now()
        };
    }

    public componentDidUpdate(prevProps: IBlobSelectorProps): void {
        if (
            prevProps.account !== this.props.account
            || prevProps.container !== this.props.container
        ) {
            this.refresh();
        }
    }

    public render(): React.ReactNode {
        return <>
            <Label>Select a CSV/TSV data file, or upload from your local computer</Label>
            <input type="file"
                key={this.state.inputKey}
                accept=".csv, .tsv"
                hidden={true}
                ref={this.fileInput}
                onChange={this.uploadFile} />
            {this.state.file ?
                <BlobUpload
                    {...this.props}
                    cancel={this.cancelUpload}
                    complete={this.uploadComplete}
                    blob={{
                        name: this.state.file.name,
                        deleted: false,
                        snapshot: "",
                        properties: {
                            lastModified: new Date(this.state.file.lastModified),
                            etag: "",
                            contentLength: this.state.file.size
                        }
                    }} file={this.state.file} /> : undefined}
            <div className="data-source-grid-container">
                <DataTable
                    enableShimmer={!this.state.isDataLoaded}
                    items={this.state.blobs || []}
                    itemsPerPage={10}
                    selectCallback={this.props.onBlobSelected}
                    sortColumnFieldName="name"
                    commandItems={[{
                        key: "upload",
                        name: "Upload",
                        icon: "Upload",
                        onClick: this.showFilePicker
                    }]}
                    columns={[
                        { field: "name" }
                    ]}
                />
            </div>
        </>;
    }

    protected readonly getData = async () => {
        this.setState({ isDataLoaded: false });
        const unfilteredBlobs = await this.services.dataSourceService.listBlob();
        if (!unfilteredBlobs) {
            return;
        }
        const blobRegEx = new RegExp(".*\\.(csv|tsv)$");
        const blobs = unfilteredBlobs.filter((blob) => blob.name.match(blobRegEx));
        this.setState({ blobs, isDataLoaded: true });
    }

    private readonly showFilePicker = () => {
        this.logUserAction("FileUpload_Click");
        if (this.fileInput.current) {
            this.fileInput.current.click();
        }
    }

    private readonly uploadFile = () => {
        this.logUserAction("FileUpload_Upload");
        if (this.fileInput.current && this.fileInput.current.files) {
            this.setState({ file: this.fileInput.current.files[0] });
        }
    }

    private readonly cancelUpload = () => {
        this.logUserAction("FileUpload_Cancel");
        this.setState({ file: undefined, inputKey: Date.now() });
    }

    private readonly uploadComplete = () => {
        this.logUserAction("FileUpload_Complete");
        this.setState({ file: undefined, inputKey: Date.now() });
        this.refresh();
    }
}
