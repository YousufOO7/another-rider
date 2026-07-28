import { apiSlice } from "../../api/apiSlice";

export const vehiclesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL Vehicles
    getAllVehicles: builder.query({
      query: () => ({
        url: "/vehicles",
        method: "GET",
      }),
      providesTags: ["vehicles"],
    }),

    // CREATE Vehicles
    createVehicles: builder.mutation({
      query: (vehiclesData) => ({
        url: "/vehicles",
        method: "POST",
        body: vehiclesData,
      }),
      invalidatesTags: ["vehicles"],
    }),

        // GET vehicle  BY ID
    // getVehicleClassesById: builder.query({
    //   query: (id) => ({
    //     url: `/vehicle-classes/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["vehicle-classes"],
    // }),

    // UPDATE / EDIT VehicleClass
    updateVehicles: builder.mutation({
      query: ({ id, data }) => ({
        url: `/vehicles/update/${id}`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["vehicles"],
    }),

    // DELETE VehicleClass
    deleteVehiclesById: builder.mutation({
      query: (id) => ({
        url: `/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicles"],
    }),
  }),
});

// Export hooks
export const {
    useCreateVehiclesMutation,
    useDeleteVehiclesByIdMutation,
    useGetAllVehiclesQuery,
    useUpdateVehiclesMutation
} = vehiclesApi;
