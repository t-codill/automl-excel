import { RestError } from "@azure/ms-rest-js";

export const restInternalServerError = new RestError("UnknownError Error", "InterServerError", 500);
