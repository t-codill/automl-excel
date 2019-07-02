import { RestError } from "@azure/ms-rest-js";

export const restCanceledError = new RestError("request canceled", "REQUEST_ABORTED_ERROR");
