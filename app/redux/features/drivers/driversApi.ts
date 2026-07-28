import { apiSlice } from "../../api/apiSlice";

export const driversApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL drivers
    getAllDrivers: builder.query({
      query: ({per_page = 10, page = 1}) => ({
        url: "/drivers",
        method: "GET",
        params: {
          per_page,
          page
        }
      }),
      providesTags: ["drivers"],
    }),

    // CREATE drivers
    createDrivers: builder.mutation({
      query: (driversData) => ({
        url: "/drivers",
        method: "POST",
        body: driversData,
      }),
      invalidatesTags: ["drivers"],
    }),

    // UPDATE / EDIT VehicleClass
    updateDrivers: builder.mutation({
      query: ({ id, data }) => ({
        url: `/drivers/update/${id}`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["drivers"],
    }),

    // DELETE VehicleClass
    deleteDriversById: builder.mutation({
      query: (id) => ({
        url: `/drivers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["drivers"],
    }),


     // drivers dashboard
  getDriversCart: builder.query({
      query: () => ({
        url: "/drivers/dashboard-summary",
        method: "GET",
      }),
      providesTags: ["drivers"],
    }),


     // csv 
  getDriversCsv: builder.query({
      query: () => ({
        url: "/drivers/export/csv",
        method: "GET",
        responseHandler: (response) => response.text(),
      }),
      transformResponse: (response: string) => response,
    }),

  }),
 
});

// Export hooks
export const {
    useCreateDriversMutation,
    useDeleteDriversByIdMutation,
    useGetAllDriversQuery,
    useUpdateDriversMutation,
    useGetDriversCartQuery,
    useLazyGetDriversCsvQuery,
} = driversApi;
