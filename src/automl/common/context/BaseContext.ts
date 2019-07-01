import * as React from "react";
import { NotImplementedError } from "../NotImplementedError";
import { PageNames } from "../PageNames";
import { Logger } from "../utils/logger";
import { IBaseContextProps } from "./IBaseContextProps";
import { WorkspaceFlight } from "./WorkspaceFlight";

const baseContext = React.createContext<IBaseContextProps>(
    {
        pageName: PageNames.Unknown,
        logger: new Logger("development"),
        flight: new WorkspaceFlight(""),
        theme: "light",
        getToken: () => { throw new NotImplementedError(); },
        setPageName: () => { throw new NotImplementedError(); },
    }
);

export {
    baseContext as BaseContext
};
