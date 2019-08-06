import { useTls, apiPortWhenDeveloping } from "../../config";

export const apiUrl = (useTls ? "https" : "http") + "://localhost:" + apiPortWhenDeveloping + "/api";