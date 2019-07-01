export function numberCompare(a: number, b: number, nanAsMax?: boolean): -1 | 0 | 1 {
    if (isNaN(a) && isNaN(b)) {
        return 0;
    }
    if (isNaN(a)) {
        if (nanAsMax) {
            return 1;
        }
        return -1;
    }
    if (isNaN(b)) {
        if (nanAsMax) {
            return -1;
        }
        return 1;
    }
    return (a > b ? 1 : a < b ? -1 : 0);
}
