import { apiSlice } from "../../api/apiSlice";

export const vehicleClassesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL VehicleClass
    getAllVehicleClass: builder.query({
      query: () => ({
        url: "/vehicle-classes",
        method: "GET",
      }),
      providesTags: ["vehicle-classes"],
    }),

    // CREATE VehicleClass
    createVehicleClass: builder.mutation({
      query: (vehicleClassesData) => ({
        url: "/vehicle-classes",
        method: "POST",
        body: vehicleClassesData,
      }),
      invalidatesTags: ["vehicle-classes"],
    }),

        // GET vehicle classes BY ID
    getVehicleClassesById: builder.query({
      query: (id) => ({
        url: `/vehicle-classes/${id}`,
        method: "GET",
      }),
      providesTags: ["vehicle-classes"],
    }),

    // UPDATE / EDIT VehicleClass
    updateVehicleClass: builder.mutation({
      query: ({ id, data }) => ({
        url: `/vehicle-classes/update/${id}`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["vehicle-classes"],
    }),

    // DELETE VehicleClass
    deleteVehicleClassById: builder.mutation({
      query: (id) => ({
        url: `/vehicle-classes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vehicle-classes"],
    }),
  }),
});

// Export hooks
export const {
    useCreateVehicleClassMutation,
    useDeleteVehicleClassByIdMutation,
    useGetAllVehicleClassQuery,
    useUpdateVehicleClassMutation
} = vehicleClassesApi;
