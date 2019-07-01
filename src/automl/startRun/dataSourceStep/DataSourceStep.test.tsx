import { shallow, ShallowWrapper } from "enzyme";
import { ITextFieldProps, TextField } from "office-ui-fabric-react";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";
import { reactMouseEvent } from "../../__data__/reactMouseEvent";
import { BlobPreviewer } from "./BlobPreviewer";
import { BlobSelector } from "./BlobSelector";
import { DataSourceStep, IDataSourceStepProps, IDataSourceStepState } from "./DataSourceStep";
import { StorageAccountSelector } from "./StorageAccountSelector";
import { StorageContainerSelector } from "./StorageContainerSelector";

describe("DataSourceStep", () => {
    let tree: ShallowWrapper<IDataSourceStepProps, IDataSourceStepState>;
    let onDataSourceChanged: jest.Mock;
    let onFeatureSelectionChanged: jest.Mock;
    function findTextFiledByLabel(label: string): ShallowWrapper<ITextFieldProps> {
        return tree.find(TextField)
            .filterWhere((t) => t.prop("label") === label);
    }
    beforeAll(() => {
        onDataSourceChanged = jest.fn();
        onFeatureSelectionChanged = jest.fn();
        const props: IDataSourceStepProps = {
            account: undefined,
            sasToken: undefined,
            container: undefined,
            blob: undefined,
            previewData: undefined,
            dataStoreName: undefined,
            compute: { id: "compute", name: "sample compute", properties: { computeType: "VirtualMachine" } },
            defaultStorageAccountData: undefined,
            onDataSourceChanged,
            onFeatureSelectionChanged
        };
        tree = shallow(<DataSourceStep {...props} />);
    });

    describe("Account", () => {
        it("should render StorageAccountSelector", async () => {
            expect(tree.exists(StorageAccountSelector))
                .toBe(true);
        });

        it("should defaultStorageAccountName", async () => {
            tree.setProps({
                defaultStorageAccountData: {
                    defaultAccountName: "defaultAccount",
                    defaultContainerName: undefined
                }
            });
            expect(tree.find(StorageAccountSelector)
                .prop("defaultStorageAccountName"))
                .toBe("defaultAccount");
        });

        it("should call back StorageAccountSelector", async () => {
            tree.find(StorageAccountSelector)
                .prop("onAccountSelected")(
                    sampleStorageAccount,
                    "sampleToken"
                );
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", undefined, undefined, undefined);
        });

        it("should render account text filed", async () => {
            tree.setProps({
                account: sampleStorageAccount,
                sasToken: "sampleToken"
            });
            expect(findTextFiledByLabel("Storage Account")
                .length)
                .toBe(1);
        });

        it("should change account", async () => {
            expect(tree.state("autoSelect"))
                .toBe(true);
            const onClick = findTextFiledByLabel("Storage Account")
                .prop("onClick");
            if (onClick) {
                onClick(reactMouseEvent);
            }
            expect(tree.state("autoSelect"))
                .toBe(false);
            expect(onDataSourceChanged)
                .toBeCalledWith(undefined, undefined, undefined, undefined, undefined);
            tree.setState({ autoSelect: true });
        });
    });

    describe("Container", () => {
        it("should render StorageContainerSelector", async () => {
            expect(tree.exists(StorageContainerSelector))
                .toBe(true);
        });
        it("should defaultStorageContainerName", async () => {
            tree.setProps({
                defaultStorageAccountData: {
                    defaultAccountName: "defaultAccount",
                    defaultContainerName: "defaultContainer"
                }
            });
            expect(tree.find(StorageContainerSelector)
                .prop("defaultContainerName"))
                .toBe("defaultContainer");
        });

        it("should call back StorageContainerSelector", async () => {
            tree.find(StorageContainerSelector)
                .prop("onContainerSelected")(
                    sampleStorageContainer
                );
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", sampleStorageContainer, undefined, undefined);
        });

        it("should render container text filed", async () => {
            tree.setProps({
                container: sampleStorageContainer
            });
            expect(findTextFiledByLabel("Storage Container")
                .length)
                .toBe(1);
        });

        it("should change Container", async () => {
            const onClick = findTextFiledByLabel("Storage Container")
                .prop("onClick");
            if (onClick) {
                onClick(reactMouseEvent);
            }
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", undefined, undefined, undefined);
        });
    });

    describe("Blob", () => {
        it("should render BlobSelector", async () => {
            expect(tree.exists(BlobSelector))
                .toBe(true);
        });

        it("should call back BlobSelector", async () => {
            tree.find(BlobSelector)
                .prop("onBlobSelected")(
                    sampleStorageBlob
                );
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", sampleStorageContainer, sampleStorageBlob, undefined);
        });

        it("should render blob text filed", async () => {
            tree.setProps({
                blob: sampleStorageBlob
            });
            expect(findTextFiledByLabel("Blob")
                .length)
                .toBe(1);
        });

        it("should change Blob", async () => {
            const onClick = findTextFiledByLabel("Blob")
                .prop("onClick");
            if (onClick) {
                onClick(reactMouseEvent);
            }
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", sampleStorageContainer, undefined, undefined);
        });
    });

    describe("Preview", () => {
        it("should render Preview", async () => {
            expect(tree.exists(BlobPreviewer))
                .toBe(true);
        });

        it("should call back BlobSelector", async () => {
            const previewData = {
                data: [],
                delimiter: ",",
                hasHeader: true,
                header: []
            };
            tree.find(BlobPreviewer)
                .prop("onSetPreviewData")(previewData);
            expect(onDataSourceChanged)
                .toBeCalledWith(sampleStorageAccount, "sampleToken", sampleStorageContainer, sampleStorageBlob, previewData);
        });
    });
});
