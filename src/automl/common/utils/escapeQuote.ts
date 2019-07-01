export const escapeQuote = (str: string): string => {
    return str.replace(/(\\|")/g, "\\$1");
};
