
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = appConfiguration.baseUrl;
const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders(headers) {
    headers.set(
      "Authorization",
      `Bearer ${shareWithCookies("get", `${appConfiguration.appCode}token`)}`
    );
    return headers;
  },
});
export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "User",
    "vehicle-classes",
    "vehicles",
    "drivers",
    "customers",
    "system-config",
    "bookings",
    "user",
    "dashboard-summary",
    "company",
    "affiliates",
    "customer"
  ],
});
