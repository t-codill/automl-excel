import { shallow } from "enzyme";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageBlob } from "../../../__data__/sampleStorageBlob";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";
import { PopupProgressIndicator } from "../../components/Progress/PopupProgressIndicator";
import { BlockBlobService } from "../../services/BlockBlobService";
import { BlobUpload, IBlobUploadProps } from "./BlobUpload";

jest.mock("../../services/BlockBlobService");
let uploadBlobSpy: jest.SpyInstance<ReturnType<BlockBlobService["uploadBlob"]>>;

describe("BlobUpload", () => {
    let cancel: jest.Mock;
    let complete: jest.Mock;
    let props: IBlobUploadProps;
    const sampleFile = new File([], "sample.csv");
    beforeEach(() => {
        uploadBlobSpy = jest.spyOn(BlockBlobService.prototype, "uploadBlob");
        cancel = jest.fn();
        complete = jest.fn();
        props = {
            file: sampleFile,
            account: sampleStorageAccount,
            container: sampleStorageContainer,
            blob: sampleStorageBlob,
            sasToken: "sampleSasToken",
            cancel,
            complete
        };
    });

    it("should render", async () => {
        const tree = shallow(<BlobUpload {...props} />);
        await Promise.resolve();
        expect(uploadBlobSpy)
            .toBeCalledWith(sampleFile, expect.anything());
        expect(tree)
            .toMatchSnapshot();
        expect(complete)
            .toBeCalled();
    });

    it("should not render if upload canceled", async () => {
        uploadBlobSpy.mockReturnValue(Promise.resolve(undefined));
        shallow(<BlobUpload {...props} />);
        await Promise.resolve();
        expect(complete)
            .not
            .toBeCalled();
    });

    it("should update Percent", async () => {
        uploadBlobSpy.mockImplementation(async (_: File, updatePercent: (percent: number) => void) => {
            updatePercent(12);
            return Promise.resolve(undefined);
        });
        const tree = shallow(<BlobUpload {...props} />);
        await Promise.resolve();
        expect(tree.find(PopupProgressIndicator)
            .prop("percentComplete"))
            .toBe(12);
    });
});
