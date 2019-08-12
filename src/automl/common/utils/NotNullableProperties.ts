export type NotNullableProperties<T> = {
    [P in keyof T]-?: NonNullable<T[P]>;
};
