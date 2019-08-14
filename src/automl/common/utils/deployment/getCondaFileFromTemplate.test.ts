import * as getSdkVersionModule from "../getSdkVersion";
import { getCondaFileFromTemplate } from "./getCondaFileFromTemplate";

jest.mock("../getSdkVersion");

describe("getCondaFileFromTemplate", () => {
    it("should return undefined if experiment name is undefined", () => {
        expect(getCondaFileFromTemplate({}))
            .toMatchSnapshot();
    });

    it("should call getSdkVersion with expected run", () => {
        const sp = jest.spyOn(getSdkVersionModule, "getSdkVersion");

        expect(getCondaFileFromTemplate({
            runId: "foo"
        }));

        expect(sp)
            .toMatchSnapshot();
    });
});
