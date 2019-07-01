import { isEmpty } from "./isEmpty";

// tslint:disable-next-line: no-any
export function emptyCompare(a: any, b: any): -1 | 0 | 1 | undefined {
    if (isEmpty(a) && isEmpty(b)) {
        return 0;
    }
    if (isEmpty(a)) {
        return -1;
    }
    if (isEmpty(b)) {
        return 1;
    }
    return undefined;
}
