import { apiSlice } from "../../api/apiSlice";

export const affiliateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL affiliates
    getAllAffiliates: builder.query({
      query: ({per_page = 10, page = 1}) => ({
        url: "/affiliates?per_page=10&page=1",
        method: "GET",
        params: {
            per_page,
            page
        }
      }),
      providesTags: ["affiliates"],
    }),

    // GET COMPANY BY ID
    getCompanyById: builder.query({
      query: (id) => ({
        url: `/company/${id}`,
        method: "GET",
      }),
      providesTags: ["company"],
    }),

    // CREATE COMPANY
    createAffiliate: builder.mutation({
      query: (affiliateData) => ({
        url: "/affiliates",
        method: "POST",
        body: affiliateData,
      }),
      invalidatesTags: ["affiliates"],
    }),

    // UPDATE / EDIT COMPANY
    updateCompany: builder.mutation({
      query: ({ data }) => ({
        url: `/company/update`,
        method: "POST", // or PATCH
        body: data,
      }),
      invalidatesTags: ["company"],
    }),

    // DELETE COMPANY
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `/company`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["company"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllAffiliatesQuery,
  useGetCompanyByIdQuery,
  useCreateAffiliateMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = affiliateApi;
