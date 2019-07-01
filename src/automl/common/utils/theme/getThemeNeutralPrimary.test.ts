import { ITheme } from "office-ui-fabric-react";
import { getThemeNeutralPrimary } from "./getThemeNeutralPrimary";

describe("getThemeNeutralPrimary", () => {
    it("should return undefined if undefined", async () => {
        expect(getThemeNeutralPrimary(undefined))
            .toBeUndefined();
    });

    it("should return undefined if theme is undefined", async () => {
        expect(getThemeNeutralPrimary({}))
            .toBeUndefined();
    });

    it("should return pallette", async () => {
        const theme = {
            palette: {
                neutralPrimary: "foo",
            }
        } as unknown as ITheme;
        expect(getThemeNeutralPrimary({ theme }))
            .toBe("foo");
    });
});
