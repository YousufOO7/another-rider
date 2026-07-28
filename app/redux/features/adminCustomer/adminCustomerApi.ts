import { apiSlice } from "../../api/apiSlice";

export const adminCustomerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL customer
    getAllAdminCustomer: builder.query({
      query: ({page = 1, per_page = 10}) => ({
        url: "/customers",
        method: "GET",
        params: {
          page,
          per_page
        }
      }),
      providesTags: ["customers"],
    }),

    // CREATE AdminCustomer
    createAdminCustomer: builder.mutation({
      query: (adminCustomerData) => ({
        url: "/customers",
        method: "POST",
        body: adminCustomerData,
      }),
      invalidatesTags: ["customers"],
    }),



    // UPDATE / EDIT AdminCustomer
    updateAdminCustomer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/update/${id}`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["customers"],
    }),

    // DELETE AdminCustomer
    deleteAdminCustomerById: builder.mutation({
      query: (id) => ({
        url: `/customers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["customers"],
    }),



    //admin profile
    getAdminProfileInfo: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["customers"],
    }),

     updateAdminProfileInf: builder.mutation({
      query: ({ data }) => ({
        url: `/user/update`,
        method: "POST", 
        body: data,
      }),
      invalidatesTags: ["customers"],
    }),



    // admin customer stats
     getAdminCustomerStates: builder.query({
      query: () => ({
        url: "/customers/dashboard-summary",
        method: "GET",
      }),
      providesTags: ["customers"],
    }),


    // csv admin customer
     // csv 
 getAdminCustomerDownloadCsv: builder.query<string, { customer_type?: string }>({
  query: ({ customer_type }) => ({
    url: `/customers/export/csv${customer_type ? `?customer_type=${customer_type}` : ""}`,
    method: "GET",
    responseHandler: (response) => response.text(),
  }),
}),

  }),
});

// Export hooks
export const {
    useCreateAdminCustomerMutation,
    useDeleteAdminCustomerByIdMutation,
    useGetAllAdminCustomerQuery,
    useUpdateAdminCustomerMutation,
    useGetAdminProfileInfoQuery,
    useUpdateAdminProfileInfMutation,
    useGetAdminCustomerStatesQuery,
    useLazyGetAdminCustomerDownloadCsvQuery,
} = adminCustomerApi;
