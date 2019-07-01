import { shallow, ShallowWrapper } from "enzyme";
import { Callout, IPivotProps, Pivot, PivotItem, Toggle } from "office-ui-fabric-react";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { PageLoadingSpinner } from "../../components/Progress/PageLoadingSpinner";
import { BlockBlobService } from "../../services/BlockBlobService";
import { BlobPreviewer, IBlobPreviewerProps, IBlobPreviewerStates } from "./BlobPreviewer";

jest.mock("../../services/ArtifactService");
jest.mock("../../services/BlockBlobService");
let previewBlobSpy: jest.SpyInstance<ReturnType<BlockBlobService["previewBlob"]>>;

describe("BlobPreviewer", () => {
    let tree: ShallowWrapper<IBlobPreviewerProps, IBlobPreviewerStates>;
    let onSetPreviewData: jest.Mock;
    let onFeatureSelectionChanged: jest.Mock;
    const previewData = {
        hasHeader: true,
        data: [
            { a: "1-1", b: "1-2", c: "1-3" },
            { a: "2-1", b: "2-2", c: "2-3" },
            { a: "3-1", b: "3-2", c: "3-3" }
        ],
        header: ["a", "b", "c"],
        delimiter: ","
    };
    beforeEach(async () => {
        onSetPreviewData = jest.fn();
        onFeatureSelectionChanged = jest.fn();
        const props: IBlobPreviewerProps = {
            dataStoreName: "",
            previewData,
            compute: { id: "id" },
            onSetPreviewData,
            onFeatureSelectionChanged,
            account: sampleStorageAccount,
            container: sampleStorageContainer,
            blob: sampleStorageBlob,
            sasToken: "sampleSasToken"
        };
        tree = shallow(<BlobPreviewer {...props} />);
        await Promise.resolve();
        previewBlobSpy = jest.spyOn(BlockBlobService.prototype, "previewBlob");
        onSetPreviewData.mockClear();
    });

    it("should render", async () => {
        expect(tree)
            .toMatchSnapshot();
    });

    it("should show loading", async () => {
        tree.setProps({ previewData: undefined });
        expect(tree.exists(PageLoadingSpinner))
            .toBe(true);
    });

    it("should scroll", async () => {
        const scrollIntoView = jest.fn();
        jest.spyOn(document, "getElementsByClassName")
            .mockReturnValue([{
                scrollIntoView
            }] as unknown as HTMLCollectionOf<Element>);
        tree.setProps({ blob: { ...sampleStorageBlob } });
        await Promise.resolve();
        expect(previewBlobSpy)
            .toBeCalled();
        expect(scrollIntoView)
            .toBeCalledWith({ behavior: "smooth", block: "start" });
    });

    it("should not load if preview return undefined", async () => {
        previewBlobSpy.mockReturnValue(Promise.resolve(undefined));
        tree.setProps({ blob: { ...sampleStorageBlob } });
        await Promise.resolve();
        expect(previewBlobSpy)
            .toBeCalled();
        expect(tree.state("isDataLoaded"))
            .toBe(false);
    });

    it("change to no header", async () => {
        const onHasHeaderChange = tree.find(Toggle)
            .prop("onChange");
        if (onHasHeaderChange) {
            onHasHeaderChange(reactMouseEvent, false);
        }
        expect(tree.state("isDataLoaded"))
            .toBe(false);
        await Promise.resolve();
        expect(onSetPreviewData)
            .toBeCalled();
    });

    it("change header with preview canceled", async () => {
        previewBlobSpy.mockReturnValue(Promise.resolve(undefined));
        const onHasHeaderChange = tree.find(Toggle)
            .prop("onChange");
        if (onHasHeaderChange) {
            onHasHeaderChange(reactMouseEvent, false);
        }
        expect(tree.state("isDataLoaded"))
            .toBe(false);
        await Promise.resolve();
        expect(tree.state("isDataLoaded"))
            .toBe(false);
        expect(onSetPreviewData)
            .not
            .toBeCalled();
    });

    describe("With Profiling", () => {
        let pivotProps: IPivotProps;
        beforeEach(() => {
            tree.setProps({ compute: { id: "id", properties: { computeType: "VirtualMachine" } } });
            pivotProps = tree.find(Pivot)
                .props();
        });

        it("should render Pivot", async () => {
            expect(tree.exists(Pivot))
                .toBe(true);
            expect(pivotProps)
                .toBeDefined();
            expect(pivotProps.onLinkClick)
                .toBeDefined();
        });

        it("should switch", async () => {
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick(new PivotItem({
                    itemKey: "Profile"
                }));
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toEqual({ display: "none" });
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toBeUndefined();
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick(new PivotItem({
                    itemKey: "Preview"
                }));
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toBeUndefined();
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toEqual({ display: "none" });
        });

        it("should not switch without item key", async () => {
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick(new PivotItem({
                }));
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toBeUndefined();
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toEqual({ display: "none" });
        });

        it("should not switch without item ", async () => {
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick();
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toBeUndefined();
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toEqual({ display: "none" });
        });

        it("should not switch with wrong id ", async () => {
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick(new PivotItem({
                    itemKey: "NotExist"
                }));
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toBeUndefined();
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toEqual({ display: "none" });
        });

        it("should show callout if not profile enabled ", async () => {
            tree.setProps({ compute: { id: "id", properties: { computeType: "AmlCompute" } } });
            if (pivotProps.onLinkClick) {
                pivotProps.onLinkClick(new PivotItem({
                    itemKey: "Profile"
                }));
            }
            expect(tree.find("#divPreview")
                .prop("style"))
                .toBeUndefined();
            expect(tree.find("#divProfiling")
                .prop("style"))
                .toEqual({ display: "none" });
            expect(tree.state("isCalloutVisible"))
                .toBe(true);
        });

        describe("Callout", () => {
            let callout: ShallowWrapper;
            beforeEach(() => {
                const onRenderItemLink = tree.find(PivotItem)
                    .filterWhere((p) => p.prop("itemKey") === "Profile")
                    .prop("onRenderItemLink");
                if (onRenderItemLink) {
                    callout = shallow(<div>{onRenderItemLink()}</div>);
                }
            });

            it("should render", () => {
                expect(callout)
                    .toMatchSnapshot();
            });

            it("callout dismiss", () => {
                tree.setState({ isCalloutVisible: true });
                const onCalloutDismiss = callout.find(Callout)
                    .prop("onDismiss");
                if (onCalloutDismiss) {
                    onCalloutDismiss();
                }
                expect(tree.state("isCalloutVisible"))
                    .toBe(false);
            });
        });
    });
});
