import { FormDataType } from "./FormDataType";

const validators = {

    /**
     * Returns a validator that checks for null and whitespace
     * @param errorMessage Required error message to display
     */
    required(errorMessage: string): (value: string | string[] | undefined) => string | undefined {
        return (value: string | string[] | undefined): string | undefined => {
            if (value === undefined || value === "" || (Array.isArray(value) && value.length === 0)) {
                return errorMessage;
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks the length of a string and ensures its equal to a value. If input null return -1
     * @param desiredLength The length of the string
     * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
     */
    length(desiredLength: number, formatError: (length: number) => string): (value: string | undefined) => string | undefined {
        return (value: string | undefined): string | undefined => {
            const length = value ? value.length : 0;
            if (length !== desiredLength) {
                return formatError(length);
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks the length of a string and ensures its greater than a value (inclusive)
     * @param lengthBound The min length of the string
     * @param formatError a callback which takes the values Length and formats an appropriate error message for validation failed
     */
    minLength(lengthBound: number, formatError: (length: number) => string): (value: string | undefined) => string | undefined {
        return (value: string | undefined): string | undefined => {
            const length = value ? value.length : 0;
            if (length < lengthBound) {
                return formatError(length);
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks the length of a string and ensures its less than a value (inclusive)
     * @param lengthBound The max length of the string
     * @param formatError a callback which takes the values length and formats an appropriate error message for validation failed
     */
    maxLength(lengthBound: number, formatError: (length: number) => string): (value: string | undefined) => string | undefined {
        return (value: string | undefined): string | undefined => {
            const length = value ? value.length : 0;
            if (length > lengthBound) {
                return formatError(length);
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that calls the passed in regular expression aganist the string using exec()
     * @param expression The regular expression to use.
     * @param errorMessage Required error message to display
     */
    regex(expression: RegExp, errorMessage: string): (value: string | undefined) => string | undefined {
        return (value: string | undefined): string | undefined => {
            const testValue = (value || "").toString();
            const match = expression.test(testValue);
            if (!match) {
                return errorMessage;
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks if a number is greater than the provided bound
     * @param bound The bound
     * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
     */
    minValue(bound: number, formatError: (length: number) => string): (value: string | number | undefined) => string | undefined {
        return (value: string | number | undefined): string | undefined => {
            if (value) {
                const intValue: number = Number(value);
                if (!isNaN(intValue) && intValue < bound) {
                    return formatError(intValue);
                }
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks if a number is less than the provided bound
     * @param bound The bound
     * @param formatError a callback which takes the length and formats an appropriate error message for validation failed
     */
    maxValue(bound: number, formatError: (length: number) => string): (value: string | number | undefined) => string | undefined {
        return (value: string | number | undefined): string | undefined => {
            if (value) {
                const intValue: number = Number(value);
                if (!isNaN(intValue) && intValue > bound) {
                    return formatError(intValue);
                }
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that checks if a number is an integer
     * @param errorMessage Required error message to display
     */
    isInteger(errorMessage: string): (value: string | number | undefined) => string | undefined {
        return (value: string | number | undefined): string | undefined => {
            if (value) {
                if (Number(value) % 1 !== 0) {
                    return errorMessage;
                }
            }
            return undefined;
        };
    },

    /**
     * Returns a validator that ensures the value is a number
     * @param errorMessage Required error message to display
     */
    isNumber(errorMessage: string): (value: string | number | undefined) => string | undefined {
        return (value: string | number | undefined): string | undefined => {
            if (value) {
                if (isNaN(Number(value))) {
                    return errorMessage;
                }
            }
            return undefined;
        };
    }
};

export type IValidator<
    TValue extends FormDataType
    > = (value: TValue) => string | undefined;
export { validators as Validators };
