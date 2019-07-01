import { AuthorizationManagementClient } from "@azure/arm-authorization";
import { restCanceledError } from "../../__data__/restCanceledError";
import { testContext } from "../common/context/__data__/testContext";
import { AccessService } from "./AccessService";

jest.mock("@azure/arm-authorization");

const service = new AccessService(testContext);

describe("AccessService", () => {
    let listForResourceSpy: jest.SpyInstance;
    beforeEach(() => {
        listForResourceSpy = jest.spyOn(AuthorizationManagementClient.prototype.permissions, "listForResource");
    });
    it("should getAccess", async () => {
        const result = await service.getAccess();
        expect(result)
            .toMatchSnapshot();
    });

    it("should return undefined if permissions is undefined", async () => {
        listForResourceSpy.mockImplementation(() => {
            throw restCanceledError;
        });
        expect(await service.checkPermission())
            .toBeUndefined();
    });
    it("should return false if permission is for reader", async () => {
        listForResourceSpy.mockReturnValue(Promise.resolve([
            {
                actions: [
                    "*/read"
                ],
                notActions: [],
                dataActions: [],
                notDataActions: []
            }]));
        expect(await service.checkPermission())
            .toEqual(false);
    });

    it("should return true if permission is for owner or contributor", async () => {
        listForResourceSpy.mockReturnValue(Promise.resolve([
            {
                actions: [
                    "*"
                ],
                notActions: [],
                dataActions: [],
                notDataActions: []
            }]));
        expect(await service.checkPermission())
            .toEqual(true);
    });
});
