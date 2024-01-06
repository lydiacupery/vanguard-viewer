import { restClient } from "@polygon.io/client-js";

export const polygonRestClient = restClient(process.env.POLYGON_API_KEY);
