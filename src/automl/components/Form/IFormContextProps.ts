import { IFormBaseInput } from "./IFormBaseInput";

export interface IFormContextProps {
    mount(component: IFormBaseInput): void;
    unmount(component: IFormBaseInput): void;
    // tslint:disable-next-line: no-any
    onUpdated?(key: any, value: any): void;
}
