import { shallow } from "enzyme";
import * as React from "react";
import { sampleStorageAccount } from "../../../__data__/sampleStorageAccount";
import { sampleStorageContainer } from "../../../__data__/sampleStorageContainer";
import { StorageService } from "../../services/StorageService";
import { IStorageContainerSelectorProps, StorageContainerSelector } from "./StorageContainerSelector";

jest.mock("../../services/StorageService");

let listContainerSpy: jest.SpyInstance<ReturnType<StorageService["listContainer"]>>;

describe("StorageContainerSelector", () => {
    let onContainerSelected: jest.Mock;
    let props: IStorageContainerSelectorProps;
    beforeEach(() => {
        listContainerSpy = jest.spyOn(StorageService.prototype, "listContainer");
        onContainerSelected = jest.fn();
        props = {
            account: sampleStorageAccount,
            container: sampleStorageContainer,
            defaultContainerName: "defaultContainer",
            autoSelect: true,
            onContainerSelected
        };
    });

    it("should render", async () => {
        const tree = shallow(<StorageContainerSelector {...props} />);
        await Promise.resolve();
        expect(tree)
            .toMatchSnapshot();
    });

    it("should refresh", async () => {
        const tree = shallow(<StorageContainerSelector {...props} />);
        await Promise.resolve();
        const newAccount = { ...sampleStorageAccount, name: "NewAccount" };
        tree.setProps({
            account: newAccount
        });
        await Promise.resolve();
        expect(listContainerSpy)
            .toBeCalledWith(newAccount);
    });

    it("should not render if list Container canceled", async () => {
        listContainerSpy.mockReturnValueOnce(Promise.resolve(undefined));
        const tree = shallow<StorageContainerSelector>(<StorageContainerSelector {...props} />);
        await Promise.resolve();
        expect(tree.state("isDataLoaded"))
            .toBe(false);
    });

    it("should not auto select Container", async () => {
        shallow(<StorageContainerSelector {...props} autoSelect={false} />);
        await Promise.resolve();
        expect(onContainerSelected)
            .not
            .toBeCalled();
    });

    it("should auto select Container", async () => {
        shallow(<StorageContainerSelector {...props} defaultContainerName={sampleStorageContainer.name} />);
        await Promise.resolve();
        await Promise.resolve();
        expect(onContainerSelected)
            .toBeCalledWith(sampleStorageContainer);
    });

    it("should auto select if container value is undefined", async () => {
        listContainerSpy.mockReturnValueOnce(Promise.resolve({}));
        shallow(<StorageContainerSelector {...props} defaultContainerName={sampleStorageContainer.name} />);
        await Promise.resolve();
        await Promise.resolve();
        expect(onContainerSelected)
            .not
            .toBeCalled();
    });
});
