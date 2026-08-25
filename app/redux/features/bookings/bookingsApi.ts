import { apiSlice } from "../../api/apiSlice";

export const bookingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // bookings data
    createBookings: builder.mutation({
      query: (bookingsData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingsData,
      }),
      invalidatesTags: ["bookings"],
    }),

    authorizeBookingPayment: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/payment/authorize`,
        method: "POST",
        body,
      }),
    }),

    //admin get all bookings
    getAllBookings: builder.query({
      query: ({ status, per_page = 10, page = 1, date_from, date_to }) => ({
        url: "/bookings",
        method: "GET",
        params: {
          status,
          per_page,
          page,
           ...(date_from && { date_from }),
      ...(date_to && { date_to }),
        },
      }),
      providesTags: ["bookings"],
    }),

    getBookingsDownloadCsv: builder.query<
      string,
      { date_from: string; date_to: string; status?: string }
    >({
      query: ({ date_from, date_to, status }) => {
        const params = new URLSearchParams({
          date_from,
          date_to,
          ...(status && { status }),
        });

        return {
          url: `/bookings/export/csv?${params.toString()}`,
          method: "GET",
          responseHandler: (response) => response.text(),
        };
      },
    }),

    //
    updateBookingStatus: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `/bookings/update/${bookingId}`,
        method: "POST", 
        body,
      }),
      invalidatesTags: ["bookings"],
    }),

    assignBookingDriver: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/assign-driver`,
        method: "POST", 
        body,
      }),
      invalidatesTags: ["bookings"],
    }),


    paymentCapture: builder.mutation({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}/payment/capture`,
        method: "POST", 
        body,
      }),
      invalidatesTags: ["bookings"],
    }),


    // quick receipt data
    quickReceipt: builder.mutation<Blob, {
  booking_id: number;
  email: string;
  trip_date: string;
}>({
  query: (data) => ({
    url: '/bookings/quick-receipt',
    method: 'POST',
    body: data,
    responseHandler: (response) => response.blob(),
  }),
}),

  }),
});

// Export hooks
export const {
  useCreateBookingsMutation,
  useAuthorizeBookingPaymentMutation,
  useGetAllBookingsQuery,
  useLazyGetBookingsDownloadCsvQuery,
  useUpdateBookingStatusMutation,
  useAssignBookingDriverMutation,
  usePaymentCaptureMutation,
  useQuickReceiptMutation,
} = bookingsApi;
