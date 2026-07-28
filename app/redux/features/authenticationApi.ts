import { apiSlice } from "../api/apiSlice";

export const authenticationApi = apiSlice.injectEndpoints({
     endpoints: (builder) => ({
          // LOGIN
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login-user",
        method: "POST",
        body: credentials,
      }),
    }),
     })
})

// Export all hooks together
export const {
  useLoginMutation,
} = authenticationApi;