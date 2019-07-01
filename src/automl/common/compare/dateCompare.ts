export function dateCompare(a: Date, b: Date): -1 | 0 | 1 {
    if (isNaN(a.getDate()) && isNaN(b.getDate())) {
        return 0;
    }
    if (isNaN(a.getDate())) {
        return -1;
    }
    if (isNaN(b.getDate())) {
        return 1;
    }
    return (a > b ? 1 : a < b ? -1 : 0);
}
