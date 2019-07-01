// tslint:disable-next-line:no-any
export function defaultCompare(a: any, b: any): -1 | 0 | 1 {
    return (a > b ? 1 : a < b ? -1 : 0);
}
