import { reduce } from "lodash";
import { IDictionary } from "../IDictionary";

export class WorkspaceFlight {
    private readonly flight: IDictionary<string>;
    constructor(flight: string) {
        this.flight = reduce<string, IDictionary<string>>(
            flight
                .split(/[,;]/),
            (result, value) => {
                if (!value) {
                    return result;
                }
                const arr = value.split("=", 2);
                result[arr[0].toLowerCase()] = arr[1];
                return result;
            }, {});
    }

    public has(flight: string): boolean {
        return this.flight.hasOwnProperty(flight.toLowerCase());
    }

    public get(flight: string): string | undefined {
        return this.flight[flight.toLowerCase()];
    }

    public appendQueryParam(to: string): string {
        const param = `flight=${reduce<IDictionary<string>, string>(
            this.flight,
            (result, value, key) => {
                let returnValue = result ? `${result},` : "";
                returnValue += key;
                if (!value) {
                    return returnValue;
                }
                return `${returnValue}=${value}`;
            }, "")}`;
        const [pathAndQuery, hash] = to.split("#", 2);
        const [path, query] = pathAndQuery.split("?", 2);
        let url = path || "";
        url += "?";
        if (query) {
            url += `${query}&`;
        }
        url += param;
        if (hash) {
            url += `#${hash}`;
        }
        return url;
    }
}
