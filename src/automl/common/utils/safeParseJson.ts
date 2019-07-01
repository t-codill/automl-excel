// tslint:disable-next-line:no-any
export function safeParseJson(jsonString: string | undefined): any {
    if (!jsonString) {
        return {};
    }

    // Using try-catch to handle the JSON.parse error
    try {
        return JSON.parse(jsonString);
    }
    catch (e) {
        return {};
    }
}
