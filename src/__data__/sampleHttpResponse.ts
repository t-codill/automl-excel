import { HttpHeaders, HttpResponse, WebResource } from "@azure/ms-rest-js";

export const sampleHttpResponse: HttpResponse = {
    request: new WebResource(),
    headers: new HttpHeaders(),
    status: 200
};
