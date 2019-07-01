export async function blob2string(blob: Blob): Promise<string> {
    return new Promise<string>((resolver) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolver(reader.result as string);
        };
        reader.readAsText(blob);
    });
}
