import { dateCompare } from "./dateCompare";
import { defaultCompare } from "./defaultCompare";
import { emptyCompare } from "./emptyCompare";
import { numberCompare } from "./numberCompare";
import { stringCompare } from "./stringCompare";

export interface ICompareOption {
    ignoreCase?: boolean;
    nanAsMax?: boolean;
}

// tslint:disable: no-any
export function compare(a: any, b: any, options?: ICompareOption): -1 | 0 | 1 {
    const emptyResult = emptyCompare(a, b);
    if (emptyResult !== undefined) {
        return emptyResult;
    }

    if (typeof (a) === "number" && typeof (b) === "number") {
        return numberCompare(a, b, options && options.nanAsMax);
    }
    if (typeof (a) === "string" && typeof (b) === "string") {
        return stringCompare(a, b, options && options.ignoreCase);
    }
    if (a instanceof Date && b instanceof Date) {
        return dateCompare(a, b);
    }
    return defaultCompare(a, b);
}
