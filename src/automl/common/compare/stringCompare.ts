export function stringCompare(a: string, b: string, ignoreCase?: boolean): -1 | 0 | 1 {
    if (ignoreCase) {
        return stringCompare(a.toLowerCase(), b.toLowerCase());
    }
    return (a > b ? 1 : a < b ? -1 : 0);
}
