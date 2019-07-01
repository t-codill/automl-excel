import { PageNames } from "../PageNames";
import { ILogger } from "../utils/ILogger";
import { WorkspaceFlight } from "./WorkspaceFlight";

export interface IBaseContextProps {
    readonly pageName: PageNames;
    readonly logger: ILogger;
    readonly flight: WorkspaceFlight;
    readonly theme: string;
    getToken(): string;
    setPageName(value: PageNames): void;
}
