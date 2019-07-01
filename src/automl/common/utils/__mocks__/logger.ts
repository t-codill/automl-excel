import { NotImplementedError } from "../../NotImplementedError";

export class Logger {
    public getSessionId(): string {
        return "sessionId";
    }
    public logPageView(): void { return; }
    public logError(): void { throw new NotImplementedError(); }
    public logCustomEvent(): void { throw new NotImplementedError(); }
}
