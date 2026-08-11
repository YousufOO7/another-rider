"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { FaRegClock } from "react-icons/fa";

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

const BookingSummary: FC<BookingSummaryProps> = ({
  vehicleName,
  pickup,
  dropoff,
  date,
  time,
  passengers,
  bags,
  onConfirm,
}) => {
  return (
    <div className="p-4 bg-white border shadow-sm rounded-xl h-full">
      <h2 className="pb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Booking Summary
        </h3>
        <p className="text-gray-400 font-bold text-xs">
          Review details before paying
        </p>
      </h2>
      <hr className="mb-4" />

      <div className="space-y-6">
        {/* Vehicle & basic info */}
        <div className="lg:flex items-start gap-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <Car className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium md:text-[14px] lg:text-lg">{vehicleName}</h3>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Max {passengers} passengers • {bags} bags
            </p>
          </div>
        </div>

        <hr />

        {/* Locations */}
        {/* Pickup & Drop-off (Timeline style) */}
        <div className="flex gap-4">
          {/* Timeline */}
          <div className="flex flex-col items-center">
            {/* Pickup circle */}
            <div className="w-3 h-3 rounded-full border-2 border-primary bg-white" />

            {/* Line */}
            <div className="w-px flex-1 bg-gray-300 my-1" />

            {/* Drop-off circle */}
            <div className="w-3 h-3 rounded-full bg-black" />
          </div>

          {/* Content */}
          <div className="space-y-4 flex-1">
            {/* Pickup */}
            <div>
              <p className="text-xs text-muted-foreground">
                Pickup · {date || "N/A"}, {time || "N/A"}
              </p>
              <p className="text-sm font-medium">{pickup || "N/A"}</p>
            </div>

            {/* Drop-off */}
            <div>
              <p className="text-xs text-muted-foreground">Drop-off</p>
              <p className="text-sm font-medium">{dropoff || "N/A"}</p>
            </div>
          </div>
        </div>

        <hr />

      

        <hr />

        {/* Payment options */}
        <div className="space-y-4">
          {/* Main action button */}
          <Button
            size="lg"
            className="w-full text-base py-6 cursor-pointer"
            onClick={onConfirm}
          >
            Confirm 
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="w-full py-6 text-xs text-bold text-gray-600 hover:bg-black hover:text-white cursor-pointer"
            onClick={onConfirm}
          >
            <span><FaRegClock /></span>
            Pay later at the end of the trip
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Review details before paying
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
