import { FormDataType } from "./FormDataType";
import { IValidator } from "./Validators";

export function validate<TValue extends FormDataType>(value: TValue, validators: Array<IValidator<TValue>> | undefined): string | undefined {
    if (!validators) {
        return undefined;
    }
    for (const validator of validators) {
        const error = validator(value);
        if (error) {
            return error;
        }
    }
    return undefined;
}
