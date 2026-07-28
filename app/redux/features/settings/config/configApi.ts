import { apiSlice } from "@/app/redux/api/apiSlice";


export const configApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL system-config
    getConfig: builder.query({
      query: () => ({
        url: "/system-config",
        method: "GET",
      }),
      providesTags: ["system-config"],
    }),

    // CREATE system-config
    createConfig: builder.mutation({
      query: (configData) => ({
        url: "/system-config",
        method: "POST",
        body: configData,
      }),
      invalidatesTags: ["system-config"],
    }),


    // UPDATE / EDIT system-config
    updateConfig: builder.mutation({
      query: ({ data }) => ({
        url: `/system-config/update`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["system-config"],
    }),
  }),
});

// Export hooks
export const {
    useCreateConfigMutation,
    useGetConfigQuery,
    useUpdateConfigMutation
} = configApi;
