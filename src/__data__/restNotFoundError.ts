import { RestError } from "@azure/ms-rest-js";

export const restNotFoundError = new RestError("Not Found Error", "NotFound", 404);
