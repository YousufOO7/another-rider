/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Briefcase,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearQuoteData } from "@/app/utils/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  customer_type: string | null;
  avatar?: string | null;
  address?: string | null;
}

interface RideConfirmProps {
  rideData: any;
}

const RideConfirm = ({ rideData }: RideConfirmProps) => {
  useEffect(() => {
    // Confirmation page এ আসলেই clear হবে
    clearQuoteData();
  }, []);

  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const router = useRouter();

  if (!rideData) return null;

  const {
    pickup_address,
    dropoff_address,
    pickupDate,
    pickupTime,
    passengers,
    vehicle,
    booking_id,
  } = rideData;

  // Build full itinerary: pickup → extra stops → dropoff
  // const itinerary: Stop[] = [
  //   { type: "pickup", location: pickup_address, dateTime: pickupDate },
  //   ...(extraStops || []),
  //   { type: "dropoff", location: dropoff_address },
  // ];

  // Format date/time nicely
  // const formatDateTime = (dateStr?: string, timeStr?: string) => {
  //   if (!dateStr) return "~ Estimated";
  //   const date = new Date(dateStr);
  //   if (timeStr) {
  //     const [hours, minutes] = timeStr.split(":");
  //     date.setHours(Number(hours));
  //     date.setMinutes(Number(minutes));
  //   }
  //   return date.toLocaleString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   });
  // };

  // Default vehicle if none
  const vehicleName = vehicle?.name || "N/A";
  const vehicleImage = vehicle?.image || "img.freepik.com";
  const maxPassengers = passengers?.passengers || 0;
  const maxBags = passengers?.bags || 0;
  const bookingId = booking_id;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header with gradient background */}
      <div className="bg-linear-to-r from-black to-black px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg">
                <Car className="h-5 w-5 text-white" />
              </span>
              Booking Confirmed
            </h2>
            <p className="text-blue-100 text-sm mt-1 font-medium">
              Review & confirm your ride details
            </p>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full">
            <span className="text-white text-xs font-semibold">
              Booking ID #{bookingId || "BK-2026"}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Vehicle Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-all">
          <div className="flex items-center gap-4">
            <div className=" rounded-xl">
              {/* <Car className="h-6 w-6 text-blue-600" /> */}
              <img
                src={vehicleImage}
                alt={vehicleName}
                className="h-12 w-20 rounded-md object-cover "
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base">
                {vehicleName}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {maxPassengers} passengers
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {maxBags} bags
                </span>
              </div>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded-full">
              <span className="text-green-700 text-xs font-semibold">
                Available
              </span>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="h-4 w-4 text-black" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-700">
                  {pickupDate}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-blue-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-black" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-semibold text-gray-700">
                  {pickupTime || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Timeline */}
            <div className="flex flex-col items-center pt-1">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-green-500 bg-white" />
              <div className="w-0.5 h-14 bg-gray-300 my-1" />
              <div className="w-3.5 h-3.5 rounded-full bg-red-500" />
            </div>

            {/* Location details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-gray-500">
                    Pickup
                  </span>
                  <span className="text-xs text-gray-400 ml-auto">
                    {pickupTime || "N/A"}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {pickup_address}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <span className="text-xs font-medium text-gray-500">
                    Drop-off
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {dropoff_address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs text-gray-400 font-medium">
              Payment Options
            </span>
          </div>
        </div>

        {/* Payment actions */}
        <div className="space-y-3 pt-1">
          <Button
            size="lg"
            className="w-full bg-linear-to-r from-black to-black hover:from-black hover:to-black text-white text-base font-semibold py-6 hover:shadow-xl transition-all duration-200 cursor-pointer group"
            onClick={() => router.push("/")}
          >
            <span>Confirm Reservation</span>
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {!user && (
            <Button
              size="lg"
              variant="outline"
              className="w-full py-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all duration-200 cursor-pointer"
              onClick={() => router.push("/auth/registration")}
            >
              <p className="text-sm font-bold text-center  mt-3">
                Don&apos;t have account? Register
              </p>
            </Button>
          )}

          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex -space-x-1">
              {["Visa", "Mastercard", "PayPal"].map((item, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-600"
                >
                  {item[0]}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Secure payment • 100% encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideConfirm;
