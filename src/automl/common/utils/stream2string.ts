export async function stream2string(readable: NodeJS.ReadableStream): Promise<string> {
    return new Promise<string>(async (resolver) => {
        let content = "";
        readable.on("data", (chunk) => {
            content += chunk;
        });

        readable.on("end", () => {
            resolver(content);
        });
    });
}
