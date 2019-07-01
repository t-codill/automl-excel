import * as React from "react";
import { NotImplementedError } from "../../common/NotImplementedError";
import { IFormContextProps } from "./IFormContextProps";

const formContext = React.createContext<IFormContextProps>(
    {
        mount(): void { throw new NotImplementedError(); },
        unmount(): void { throw new NotImplementedError(); }
    }
);
export { formContext as FormContext };
