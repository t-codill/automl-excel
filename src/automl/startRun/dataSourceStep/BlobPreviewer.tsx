import { AzureMachineLearningWorkspacesModels } from "@azure/arm-machinelearningservices";
import { Callout, DirectionalHint, Pivot, PivotItem, PivotLinkFormat, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { IDataLoadState } from "../../common/IDataLoadState";
import { computeUtils } from "../../common/utils/computeUtils";
import { ICsvData } from "../../common/utils/csv";
import { BaseComponent } from "../../components/Base/BaseComponent";
import { DataTable } from "../../components/DataTable/DataTable";
import { IDataToggleProps } from "../../components/DataTable/DataTableToggle";
import { PageLoadingSpinner } from "../../components/Progress/PageLoadingSpinner";
import { BlockBlobService, IBlockBlobServiceProps } from "../../services/BlockBlobService";
import { DataProfiling } from "./DataProfiling";

import "./BlobPreviewer.scss";

const previewLines = 5;
export interface IBlobPreviewerProps extends IBlockBlobServiceProps {
    previewData: ICsvData | undefined;
    dataStoreName: string | undefined;
    compute: AzureMachineLearningWorkspacesModels.ComputeResource;
    onSetPreviewData(previewData: ICsvData | undefined): void;
    onFeatureSelectionChanged(featureName: string, checked?: boolean): void;
}
export interface IBlobPreviewerStates extends IDataLoadState {
    hasHeader: boolean;
    isCalloutVisible: boolean;
    visiblePivot: "Preview" | "Profile";
}

export class BlobPreviewer
    extends BaseComponent<IBlobPreviewerProps, IBlobPreviewerStates, { blockBlobService: BlockBlobService }> {
    protected readonly serviceConstructors = { blockBlobService: BlockBlobService };
    protected readonly toggleProps: IDataToggleProps = {
        onText: "Included",
        offText: "Ignored",
        onColumnSelectorChanged: this.props.onFeatureSelectionChanged,
        defaultState: true
    };
    private readonly profilePivotItem = React.createRef<HTMLDivElement>();
    constructor(props: IBlobPreviewerProps) {
        super(props);
        this.state = {
            hasHeader: true,
            isCalloutVisible: false,
            visiblePivot: "Preview",
            isDataLoaded: false
        };
    }

    public componentDidUpdate(prevProps: IBlobPreviewerProps): void {
        if (
            prevProps.account !== this.props.account
            || prevProps.container !== this.props.container
            || prevProps.blob !== this.props.blob
        ) {
            this.refresh();
        }
    }

    public render(): React.ReactNode {
        if (!this.state || !this.props.previewData) {
            return (
                <div className="ms-md12 ms-lg8 ms-xl6 ms-xxl4">
                    <PageLoadingSpinner />
                </div>
            );
        }
        const columns = this.getColumnsFromHeader(this.props.previewData.header);
        const profilingEnabled = computeUtils.isComputeProfilingEnabled(this.props.compute);
        return (<>
            <Toggle
                className="header-toggle"
                defaultChecked={true}
                inlineLabel={true}
                label="Use first row as header"
                onText="Yes"
                offText="No"
                onChange={this.onHasHeaderChange}
            />
            <Pivot linkFormat={PivotLinkFormat.tabs} headersOnly={true} onLinkClick={this.onPivotSwitch}
                selectedKey={profilingEnabled ? undefined : "Preview"} >
                <PivotItem
                    itemKey={"Preview"}
                    headerText={"Preview"}
                />
                <PivotItem
                    itemKey={"Profile"}
                    headerText={"Profile"}
                    onRenderItemLink={this.renderPivotWithCallout} />
            </Pivot>
            <div id="divPreview" style={!profilingEnabled || this.state.visiblePivot === "Preview" ? undefined : { display: "none" }}>
                <DataTable
                    items={this.props.previewData.data}
                    columns={columns}
                    toggleProps={this.toggleProps}
                    noSorting={true}
                    enableShimmer={!this.state.isDataLoaded}
                    itemsPerPage={5}
                />
            </div>
            <div id="divProfiling" style={this.state.visiblePivot === "Profile" ? undefined : { display: "none" }}>
                <DataProfiling
                    previewData={this.props.previewData}
                    dataStoreName={this.props.dataStoreName}
                    blob={this.props.blob}
                    compute={this.props.compute}
                />
            </div>
        </>);
    }

    protected readonly getData = async () => {
        this.setState({ isDataLoaded: false });
        const previewData = await this.services.blockBlobService.previewBlob(this.state.hasHeader, previewLines);
        if (!previewData) {
            return;
        }
        this.props.onSetPreviewData(previewData);
        this.setState({ isDataLoaded: true });

        // scroll into view
        const dataDisplayElement = document.getElementsByClassName("header-toggle");
        if (dataDisplayElement[0]) {
            dataDisplayElement[0].scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    private readonly onPivotSwitch = (item?: PivotItem): void => {
        if (!item || !item.props.itemKey) {
            return;
        }
        if (item.props.itemKey === "Preview") {
            this.setState({ visiblePivot: "Preview" });
        }
        if (item.props.itemKey === "Profile") {
            if (computeUtils.isComputeProfilingEnabled(this.props.compute)) {
                this.setState({ visiblePivot: "Profile" });
            }
            else {
                this.setState({ isCalloutVisible: true });
            }
        }
    }

    private readonly getColumnsFromHeader = (header: string[]) => {
        return header.map((v) => ({
            field: v,
            minWidth: 150,
        }));
    }

    private readonly onHasHeaderChange = async (_ev: React.MouseEvent<HTMLElement>, checked?: boolean) => {
        this.setState({ isDataLoaded: false });
        const previewData = await this.services.blockBlobService.previewBlob(checked || false, previewLines);
        if (!previewData) {
            return;
        }
        this.props.onSetPreviewData(previewData);
        this.setState({ hasHeader: checked || false, isDataLoaded: true });
    }
    private readonly renderPivotWithCallout = () => {
        return (<>
            <span className={"profilePivotItem"} ref={this.profilePivotItem}>
                <span className={"Profile"}> Profile </span>
            </span>
            <Callout
                target={this.profilePivotItem.current}
                setInitialFocus={true}
                onDismiss={this.onCalloutDismiss}
                hidden={!this.state.isCalloutVisible}
                className="pivotCallout"
                directionalHint={DirectionalHint.topRightEdge}
                onClick={this.onCalloutDismiss}>
                <div className="pivotCalloutInner" >
                    Data profiling is only available for compute targets which are already running (min nodes > 0).
                     To enable data profiling, select a compute which is marked as “profiling enabled”, or create a
                     new compute with min nodes > 0
                </div>
            </Callout>
        </>);
    }
    private readonly onCalloutDismiss = () => {
        this.setState({ isCalloutVisible: false });
    }
}
