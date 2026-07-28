import { apiSlice } from "../../api/apiSlice";

export const companyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL COMPANIES
    getAllCompanies: builder.query({
      query: () => ({
        url: "/company",
        method: "GET",
      }),
      providesTags: ["company"],
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
    createCompany: builder.mutation({
      query: (companyData) => ({
        url: "/company",
        method: "POST",
        body: companyData,
      }),
      invalidatesTags: ["company"],
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
  useGetAllCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
