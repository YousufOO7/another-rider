import { apiSlice } from "../../api/apiSlice";

export const authenticationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // LOGIN
    loginCustomer: builder.mutation({
      query: (credentials) => ({
        url: "/customer/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // customer logout
      customerLogout: builder.mutation({
      query: () => ({
        url: "/customer/logout",
        method: "POST",
      }),
      invalidatesTags: ["customer"],
    }),

    // REGISTER USER
    registerCustomer: builder.mutation({
      query: (userData) => ({
        url: "/customer/register",
        method: "POST",
        body: userData,
      }),
    }),

    // VERIFY CUSTOMER REGISTRATION CODE
    verifyCustomerRegistrationCode: builder.mutation({
      query: (data) => ({
        url: "/customer/verify-registration-code",
        method: "POST",
        body: data,
      }),
    }),

    // RESEND VERIFICATION CODE
    resendCustomerVerificationCode: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/customer/resend-verification-code",
        method: "POST",
        body: data,
      }),
    }),
    //customerResetPasswordRequest
    customerResetPasswordRequest: builder.mutation({
      query: (data: { email: string }) => ({
        url: "/customer/request-reset-password-code",
        method: "POST",
        body: data,
      }),
    }),

    // RESET PASSWORD WITH CODE
    resetCustomerPasswordWithCode: builder.mutation({
      query: (data: {
        email: string;
        reset_code: string;
        new_password: string;
        new_password_confirmation: string;
      }) => ({
        url: "/customer/reset-password-with-code",
        method: "POST",
        body: data,
      }),
    }),

    // GET CUSTOMER PROFILE
    getCustomerProfile: builder.query({
      query: () => ({
        url: "/customer/profile",
        method: "GET",
      }),
    }),

    // UPDATE USER
    updateCustomerProfile: builder.mutation({
      query: (userData) => ({
        url: `/customer/self-update`,
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["user"],
    }),

    // admin
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // REGISTER ADMIN
    registerAdmin: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

// Export all hooks together
export const {
  useLoginCustomerMutation,
  useCustomerLogoutMutation,
  useRegisterCustomerMutation,
  useGetCustomerProfileQuery,
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useUpdateCustomerProfileMutation,
  useVerifyCustomerRegistrationCodeMutation,
  useResendCustomerVerificationCodeMutation,
  useCustomerResetPasswordRequestMutation,
  useResetCustomerPasswordWithCodeMutation,
} = authenticationApi;
