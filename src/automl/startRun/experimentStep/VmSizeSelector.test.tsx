import { shallow } from "enzyme";
import * as React from "react";
import { IVMSizeResult } from "../../services/WorkSpaceService";
import { VmSizeSelector } from "./VmSizeSelector";

describe("VmSizeSelector", () => {

    it("should show loader when vmSizes is undefined", () => {
        const tree = shallow(
            <VmSizeSelector vmSizes={undefined} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
    it("should show loader when vmSizes is empty", () => {
        const vmSizes: IVMSizeResult = {};

        const tree = shallow(
            <VmSizeSelector vmSizes={vmSizes} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
    it("should show loader when vmSizes' amlCompute is empty", () => {
        const vmSizes = {
            amlCompute: []
        };

        const tree = shallow(
            <VmSizeSelector vmSizes={vmSizes} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with default to Standard_DS12_v2", () => {
        const vmSizes = {
            amlCompute: [
                { name: "foo" },
                { name: "foo1", vCPUs: 2, },
                { name: "foo2", vCPUs: 4, memoryGB: 8 },
                { name: "Standard_DS12_v2", vCPUs: 8, memoryGB: 16, maxResourceVolumeMB: 32 * 1024 },
                { name: "foo3", vCPUs: 16, memoryGB: 32, maxResourceVolumeMB: 64 * 1024 },
                { name: "foo3", memoryGB: 64, maxResourceVolumeMB: 128 * 1024 },
                { name: "foo3", maxResourceVolumeMB: 256 * 1024 }
            ]
        };

        const tree = shallow(
            <VmSizeSelector vmSizes={vmSizes} />
        );
        expect(tree)
            .toMatchSnapshot();
    });

    it("should render with default to first", () => {
        const vmSizes = {
            amlCompute: [
                {},
            ]
        };

        const tree = shallow(
            <VmSizeSelector vmSizes={vmSizes} />
        );
        expect(tree)
            .toMatchSnapshot();
    });
});
