export const stringifyToPython = (obj: object): string => {
    return JSON.stringify(obj, (_name, value) => {
        if (value === true) {
            return "__True__";
        }
        if (value === false) {
            return "__False__";
        }
        if (value === null) {
            return "__None__";
        }
        return value;
    })
        .replace(/"__(True|False|None)__"/g, "$1")
        .replace(/'/g, "\\'")
        .replace(/([^\\])"/g, "$1'")
        .replace(/\\"/g, "\"");
};
