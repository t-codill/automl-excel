import { shallow, ShallowWrapper } from "enzyme";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";
import { reactFormEvent } from "../../__data__/reactFormEvent";
import { getLogCustomEventSpy, testContext } from "../../common/context/__data__/testContext";
import { DataTable } from "../../components/DataTable/DataTable";
import { DataSourceService } from "../../services/DataSourceService";
import { BlobSelector, IBlobSelectorProps, IBlobSelectorState } from "./BlobSelector";
import { BlobUpload } from "./BlobUpload";

jest.mock("../../services/DataSourceService");

let listBlobSpy: jest.SpyInstance<ReturnType<DataSourceService["listBlob"]>>;

describe("BlobSelector", () => {
    let tree: ShallowWrapper<IBlobSelectorProps, IBlobSelectorState>;
    let onBlobSelected: jest.Mock;
    beforeEach(async () => {
        onBlobSelected = jest.fn();
        const props: IBlobSelectorProps = {
            account: sampleStorageAccount,
            container: sampleStorageContainer,
            blob: sampleStorageBlob,
            sasToken: "sampleSasToken",
            onBlobSelected
        };
        tree = shallow(<BlobSelector {...props} />);
        await Promise.resolve();
        listBlobSpy = jest.spyOn(DataSourceService.prototype, "listBlob");
    });

    it("should render", async () => {
        expect(tree)
            .toMatchSnapshot();
    });

    it("should refresh if account change", async () => {
        tree.setProps({ account: { ...sampleStorageAccount } });
        expect(tree.state("isDataLoaded"))
            .toBe(false);
        await Promise.resolve();
        expect(listBlobSpy)
            .toBeCalled();
    });

    it("should not refresh if list action is canceled", async () => {
        listBlobSpy.mockReturnValue(Promise.resolve(undefined));
        tree.setProps({ account: { ...sampleStorageAccount } });
        expect(tree.state("isDataLoaded"))
            .toBe(false);
        await Promise.resolve();
        expect(tree.state("isDataLoaded"))
            .toBe(false);
    });

    describe("with file upload", () => {
        beforeEach(() => {
            tree.setState({
                file: new File([], "sample.csv")
            });
        });

        it("should show upload", () => {
            expect(tree.exists(BlobUpload))
                .toBe(true);
        });

        it("should log file picker", () => {
            const commandItems = tree.find(DataTable)
                .prop("commandItems");
            const logger = getLogCustomEventSpy();
            if (commandItems && commandItems[0] && commandItems[0].onClick) {
                commandItems[0].onClick();
            }
            expect(logger)
                .toBeCalledWith("_FileUpload_Click_UserAction", testContext, { component: "FileUpload_Click", pageName: "" });
        });

        it("should show file picker", () => {
            const fileInputClick = jest.fn();
            Object.defineProperty(tree.instance(), "fileInput", {
                get(): {} {
                    return {
                        current: {
                            click: fileInputClick
                        }
                    };
                }
            });
            const commandItems = tree.find(DataTable)
                .prop("commandItems");
            getLogCustomEventSpy();
            if (commandItems && commandItems[0] && commandItems[0].onClick) {
                commandItems[0].onClick();
            }
            expect(fileInputClick)
                .toBeCalled();
        });

        it("should log upload file", () => {
            const onChange = tree.find("input")
                .prop("onChange");
            const logger = getLogCustomEventSpy();
            if (onChange) {
                onChange(reactFormEvent);
            }
            expect(logger)
                .toBeCalledWith("_FileUpload_Upload_UserAction", testContext, { component: "FileUpload_Upload", pageName: "" });
        });

        it("should set upload file", () => {
            const fileInputClick = jest.fn();
            const file = new File([], "sample.csv");
            Object.defineProperty(tree.instance(), "fileInput", {
                get(): {} {
                    return {
                        current: {
                            click: fileInputClick,
                            files: [file]
                        }
                    };
                }
            });
            const onChange = tree.find("input")
                .prop("onChange");
            getLogCustomEventSpy();
            if (onChange) {
                onChange(reactFormEvent);
            }
            expect(tree.state("file"))
                .toEqual(file);
        });

        it("should cancel upload file", () => {
            const logger = getLogCustomEventSpy();
            tree.find(BlobUpload)
                .prop("cancel")();
            expect(logger)
                .toBeCalledWith("_FileUpload_Cancel_UserAction", testContext, { component: "FileUpload_Cancel", pageName: "" });
            expect(tree.state("file"))
                .toBeUndefined();
        });

        it("should complete upload file", () => {
            const logger = getLogCustomEventSpy();
            tree.find(BlobUpload)
                .prop("complete")();
            expect(logger)
                .toBeCalledWith("_FileUpload_Complete_UserAction", testContext, { component: "FileUpload_Complete", pageName: "" });
            expect(tree.state("file"))
                .toBeUndefined();
        });
    });
});
