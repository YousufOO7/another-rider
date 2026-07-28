/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Printer, X } from "lucide-react";
import Image from "next/image";

interface Stop {
  type: "pickup" | "dropoff";
  location: string;
  dateTime?: string;
}

type Props = {
  onBack: () => void;
  rideData: any;
};

const ViewReservation = ({ onBack, rideData }: Props) => {
  if (!rideData) return null;

  const {
    pickup,
    dropoff,
    pickupDate,
    pickupTime,
    extraStops = [],
    passengers,
    passengerInfo,
    vehicle,
    mode,
  } = rideData;

  const itinerary: Stop[] = [
    { type: "pickup", location: pickup, dateTime: pickupDate },
    ...extraStops,
    { type: "dropoff", location: dropoff },
  ];

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "Estimated time";
    const date = new Date(dateStr);
    if (timeStr) {
      const [h, m] = timeStr.split(":");
      date.setHours(+h);
      date.setMinutes(+m);
    }
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-4xl mx-auto md:px-4 pb-10 md:py-10 md:pb-0">
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="md:flex space-y-3 md:space-y-0 flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gray-50 border-b">
          <div>
            <h2 className="text-lg font-semibold">
              Reservation <span className="font-bold">#839201</span>
            </h2>
            <span className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full">
              ● CONFIRMED
            </span>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex gap-2 rounded-none">
              <Printer size={14} /> Print Receipt
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 border-red-200 hover:bg-red-50 flex gap-2 rounded-none"
            >
              <X size={14} /> Cancel Ride
            </Button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-3 md:p-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            {/* Trip Details */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 mb-4">
                TRIP DETAILS
              </h3>

              <div className="inline-block mb-4 text-xs font-semibold bg-gray-100 px-3 py-1 rounded-full capitalize">
                {mode === "hourly"
                  ? `${rideData?.hours} •  hours And ${rideData?.minutes} min`
                  : formatDateTime(pickupDate, pickupTime)}
              </div>

              {/* Timeline */}
              <div className="flex gap-4 mt-6">
                {/* Dots */}
                <div className="flex flex-col items-center">
                  {itinerary.map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          index === 0
                            ? "bg-green-600 border-green-600"
                            : index === itinerary.length - 1
                              ? "bg-white border-gray-400"
                              : "bg-blue-500 border-blue-500"
                        }`}
                      />
                      {index < itinerary.length - 1 && (
                        <div className="w-px bg-gray-300 h-10" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="space-y-6 text-sm">
                  {itinerary.map((stop, index) => (
                    <div key={index}>
                      <p className="font-medium">
                        {index === 0
                          ? formatDateTime(stop.dateTime, pickupTime)
                          : index === itinerary.length - 1
                            ? "Final Drop-off"
                            : `Stop ${index}`}
                      </p>
                      <p className="text-xs text-gray-500">{stop.location}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* sm device  */}

            <div className="block md:hidden">
                <h3 className="text-xs font-semibold text-gray-400">
              VEHICLE & PAYMENT
            </h3>

            <div className="p-1 bg-gray-50 rounded-lg">
              <div className="p-4">
                <Image
                  src="https://i.ibb.co/Y3YpPpZ/car.png"
                  alt="Vehicle"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover mb-4 border"
                />

                <h4 className="font-semibold">{vehicle.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Max {vehicle.passengers} • {vehicle.luggage} Bags
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Hourly booking • 4 hours • Up to 80 km included
                </p>
              </div>
            </div>


            <div className="block md:hidden mt-4">
              <h3 className="text-xs font-semibold text-gray-400 mb-4">
                PASSENGER INFORMATION
              </h3>

              <div className="grid grid-cols-1 gap-y-6 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Primary Passenger</p>
                  <p className="font-medium">{passengerInfo?.fullName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone Number</p>
                  <p className="font-medium">{passengerInfo?.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-medium">{passengerInfo?.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Travelers & Bags</p>
                  <p className="font-medium text-xs">
                    {passengers.travelers} Adults
                    {passengers.kids > 0 && `, ${passengers.kids} Child`},{" "}
                    {passengers.bags} Bags
                  </p>
                </div>
              </div>
            </div>

            </div>

            {/* Passenger Info */}
            <div className="hidden md:block">
              <h3 className="text-xs font-semibold text-gray-400 mb-4">
                PASSENGER INFORMATION
              </h3>

              <div className="grid grid-cols-2 gap-y-6 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Primary Passenger</p>
                  <p className="font-medium">{passengerInfo?.fullName}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone Number</p>
                  <p className="font-medium">{passengerInfo?.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Email Address</p>
                  <p className="font-medium">{passengerInfo?.email}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Travelers & Bags</p>
                  <p className="font-medium">
                    {passengers.travelers} Adults
                    {passengers.kids > 0 && `, ${passengers.kids} Child`},{" "}
                    {passengers.bags} Bags
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <h3 className="text-xs font-semibold text-gray-400 hidden md:block">
              VEHICLE & PAYMENT
            </h3>

            <div className="p-1 bg-gray-50 rounded-lg hidden md:block">
              <div className="p-4">
                <Image
                  src="https://i.ibb.co/Y3YpPpZ/car.png"
                  alt="Vehicle"
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover mb-4 border"
                />

                <h4 className="font-semibold">{vehicle.name}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Max {vehicle.passengers} • {vehicle.luggage} Bags
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Hourly booking • 4 hours • Up to 80 km included
                </p>
              </div>
            </div>

            {/* Payment */}
            <div className="p-4 space-y-3 text-sm -mt-10 md:-mt-0">
              <p className="text-xs text-gray-400">Payment Method</p>
              <p className="font-medium capitalize">
                {rideData.payment.method}
              </p>

              <div className="pt-3 border-t space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Base Price</span>
                  <span>${vehicle.price}.00</span>
                </div>

                <div className="flex justify-between font-semibold text-sm pt-2">
                  <span>Total Paid</span>
                  <span>${vehicle.price}.00</span>
                </div>
              </div>
            </div>

            <Button onClick={onBack} className="w-full rounded-none">
              Modify Reservation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReservation;
