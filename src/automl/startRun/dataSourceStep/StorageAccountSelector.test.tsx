import { shallow } from "enzyme";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { StorageService } from "../../services/StorageService";
import { IStorageAccountSelectorProps, StorageAccountSelector } from "./StorageAccountSelector";

jest.mock("../../services/StorageService");

let listAccountSpy: jest.SpyInstance<ReturnType<StorageService["listAccount"]>>;
let getSasTokenSpy: jest.SpyInstance<ReturnType<StorageService["getSasToken"]>>;

describe("StorageAccountSelector", () => {
    let onAccountSelected: jest.Mock;
    let props: IStorageAccountSelectorProps;
    beforeEach(() => {
        listAccountSpy = jest.spyOn(StorageService.prototype, "listAccount");
        getSasTokenSpy = jest.spyOn(StorageService.prototype, "getSasToken");
        onAccountSelected = jest.fn();
        props = {
            account: sampleStorageAccount,
            defaultStorageAccountName: "defaultAccount",
            autoSelect: true,
            onAccountSelected
        };
    });

    it("should render", async () => {
        const tree = shallow(<StorageAccountSelector {...props} />);
        await Promise.resolve();
        expect(tree)
            .toMatchSnapshot();
    });

    it("should not render if list account canceled", async () => {
        listAccountSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const tree = shallow<StorageAccountSelector>(<StorageAccountSelector {...props} />);
        await Promise.resolve();
        expect(tree.state("isDataLoaded"))
            .toBe(false);
    });

    it("should not auto select account", async () => {
        shallow(<StorageAccountSelector {...props} autoSelect={false} />);
        await Promise.resolve();
        expect(onAccountSelected)
            .not
            .toBeCalled();
    });

    it("should ot auto select account if cannot find account", async () => {
        shallow(<StorageAccountSelector {...props} />);
        await Promise.resolve();
        expect(onAccountSelected)
            .not
            .toBeCalled();
    });

    it("should auto select account", async () => {
        shallow(<StorageAccountSelector {...props} defaultStorageAccountName={sampleStorageAccount.name} />);
        await Promise.resolve();
        await Promise.resolve();
        expect(onAccountSelected)
            .toBeCalledWith(sampleStorageAccount, "sampleToken");
    });

    it("should auto select if get sas is canceled", async () => {
        getSasTokenSpy.mockReturnValue(Promise.resolve(undefined));
        shallow(<StorageAccountSelector {...props} defaultStorageAccountName={sampleStorageAccount.name} />);
        await Promise.resolve();
        await Promise.resolve();
        expect(onAccountSelected)
            .not
            .toBeCalled();
    });
});
