import { stringifyToPython } from "./stringifyToPython";

describe("stringifyToPython", () => {
    it("should handle complex objects", () => {
        const data = {
            lv2: {
                color: ["red", "green", "blue"],
                isTrue: true,
                isFalse: false,
                nullProp: null,
                undefinedProp: undefined,
                stringProp: "This is a test string \"Tom's\" \"cat\"'"
            }
        };
        expect(stringifyToPython(data))
            .toBe(`{'lv2':{'color':['red','green','blue'],'isTrue':True,'isFalse':False,'nullProp':None,'stringProp':'This is a test string "Tom\\'s" "cat"\\''}}`);
    });
});
