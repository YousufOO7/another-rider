/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Car,
  MapPin,
  Clock,
  Calendar,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingSummaryProps {
  vehicleName?: string;
  pickup?: string;
  dropoff?: string;
  date?: string;
  time?: string;
  passengers?: number;
  bags?: number;
  onConfirm?: () => void;
  onPayLater?: () => void;
}

interface UserData {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  customer_type: string | null;
  avatar?: string | null;
  address?: string | null;
}

const BookingSummary: FC<BookingSummaryProps> = ({
  vehicleName = "Standard Sedan",
  pickup = "123 Main Street, New York",
  dropoff = "456 Park Avenue, Los Angeles",
  date = "2026-08-23",
  time = "10:30 AM",
  passengers = 4,
  bags = 2,
  onConfirm,
}) => {
  // Format date for better display
  const router = useRouter();
   const [user, setUser] = useState<UserData | null>(null);

       useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "N/A") return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header with gradient background */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg">
                <Car className="h-5 w-5 text-white" />
              </span>
              Booking Summary
            </h2>
            <p className="text-blue-100 text-sm mt-1 font-medium">
              Review & confirm your ride details
            </p>
          </div>
          <div className="bg-white/20 px-3 py-1.5 rounded-full">
            <span className="text-white text-xs font-semibold">#BK-2026</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Vehicle Card */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-base">
                {vehicleName}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {passengers} passengers
                </span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {bags} bags
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
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(date)}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-blue-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-sm font-semibold text-gray-700">
                  {time || "N/A"}
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
                    {time || "N/A"}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 leading-tight">
                  {pickup}
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
                  {dropoff}
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
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group"
            onClick={onConfirm}
          >
            <span>Pay Later at Trip End</span>
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>

          {
            !user && (
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
            )
          }

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

export default BookingSummary;
