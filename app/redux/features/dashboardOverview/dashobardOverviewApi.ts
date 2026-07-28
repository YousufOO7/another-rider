import { apiSlice } from "../../api/apiSlice";

export const dashboardOverviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // dashboard-summary data
    getDashboardSummary: builder.query({
      query: () => ({
        url: "/bookings/dashboard-summary",
        method: "GET",
      }),
      providesTags: ["dashboard-summary"],
    }),

    //admin get all bookings
    getAllBookings: builder.query({
      query: ({ status, per_page = 10, page = 1 }) => ({
        url: "/bookings",
        method: "GET",
        params: {
          status,
          per_page,
          page,
        },
      }),
      providesTags: ["bookings"],
    }),

    // admin live Operations
    getAllLiveOperations: builder.query({
      query: () => ({
        url: "/bookings/live-operations-feed",
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),

    // admin vehicle availability
    getVehicleAvailability: builder.query({
      query: () => ({
        url: "/bookings/vehicle-availability",
        method: "GET",
      }),
      providesTags: ["bookings"],
    }),

    // admin recent activity
    getRecentActivity: builder.query({
      query: ({per_page = 20, page = 1}) => ({
        url: "/bookings/recent-activity",
        method: "GET",
        params: {
          per_page,
          page
        }
      }),
      providesTags: ["bookings"],
    }),
  }),
});

// Export hooks
export const {
  useGetDashboardSummaryQuery,
  useGetAllBookingsQuery,
  useGetAllLiveOperationsQuery,
  useGetVehicleAvailabilityQuery,
  useGetRecentActivityQuery,
} = dashboardOverviewApi;
