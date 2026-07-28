/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaCalendarPlus, FaRedo } from "react-icons/fa";
import { useEffect } from "react";
import { clearQuoteData } from "@/app/utils/storage";
import { useRouter } from "next/navigation";

interface Stop {
  type: "pickup" | "dropoff";
  location: string;
  dateTime?: string;
}

interface RideConfirmProps {
  rideData: any;
}

const RideConfirm = ({ rideData }: RideConfirmProps) => {

     useEffect(() => {
    // Confirmation page এ আসলেই clear হবে
    clearQuoteData();
  }, []);

  const router = useRouter();

  if (!rideData) return null;

  const {
    pickup_address,
    dropoff_address,
    pickupDate,
    pickupTime,
    extraStops,
    passengerInfo,
    passengers,
    vehicle,
    booking_id,
  } = rideData;

  // Build full itinerary: pickup → extra stops → dropoff
  const itinerary: Stop[] = [
    { type: "pickup", location: pickup_address, dateTime: pickupDate },
    ...(extraStops || []),
    { type: "dropoff", location: dropoff_address },
  ];

  // Format date/time nicely
  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return "~ Estimated";
    const date = new Date(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(":");
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
    }
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Default vehicle if none
  const vehicleName = vehicle?.name || "N/A";
  const maxPassengers = passengers?.passengers?.passengers || 0;
  const maxBags = passengers?.passengers?.bags || 0;
  const image = vehicle?.image || "";
  const basePrice = vehicle?.calculation?.base_price || 0;
  const gratuityAmount = vehicle?.calculation?.gratuity_amount || 0;
  const taxesAmount = vehicle?.calculation?.tax_amount || 0;
  const bookingId = booking_id;
  


  return (
    <div className="mb-20">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Your ride is confirmed</h1>
        <p className="text-sm text-muted-foreground mt-2">
          A confirmation email has been sent to{" "}
          <span className="font-medium">
            {passengerInfo?.email || "john.doe@example.com"}
          </span>
        </p>

        <div className="flex justify-center gap-2 mt-4">
          <Button
            size={"sm"}
            variant={"outline"}
            className="text-xs rounded-full bg-white border"
          >
            Booking ID: #{bookingId || "N/A"}
          </Button>
          <Button
            size={"sm"}
            variant={"green"}
            className="text-xs rounded-full font-medium"
          >
            Confirmed
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-t-xl p-6 shadow-sm">
        {/* Trip Itinerary */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-muted-foreground">
              TRIP ITINERARY
            </h3>
            {/* <span className="text-xs text-muted-foreground">
              Airport pickup with direct hotel drop-off
            </span> */}
          </div>

          <div className="flex gap-4">
            {/* Timeline Dots */}
            <div className="flex flex-col items-center">
              {itinerary.map((stop, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center relative"
                >
                  {/* Dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      index === 0
                        ? "bg-green-600 border-green-600" // Pickup
                        : index === itinerary.length - 1
                          ? "bg-white border-gray-400" // Dropoff
                          : "bg-blue-500 border-blue-500" // Extra Stops
                    }`}
                  />
                  {/* Vertical line connecting to next dot */}
                  {index < itinerary.length - 1 && (
                    <div
                      className="w-px bg-gray-300 flex-1"
                      style={{ minHeight: "40px" }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Timeline Content */}
            <div className="flex flex-col justify-between space-y-6">
              {itinerary.map((stop, index) => (
                <div key={index}>
                  {/* Date/Time for pickup, optional for stops */}
                  <p className="text-sm font-medium">
                    {index === 0
                      ? formatDateTime(stop.dateTime, pickupTime)
                      : `Stop ${index}`}
                  </p>

                  {/* Label & Location */}
                  <p className="text-xs text-muted-foreground">
                    {index === 0 && stop.location} {/* Pickup */}
                    {index > 0 && index < itinerary.length - 1 && (
                      <span className="font-medium">{stop.location}</span>
                    )}
                    {index === itinerary.length - 1 && (
                      <span className="font-medium">
                        Final Drop-off: {stop.location}
                      </span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr />

        {/* Vehicle & Passenger */}
        <div className="grid md:grid-cols-2 gap-6 py-6">
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-2">
              VEHICLE
            </p>
            <div className="flex items-center gap-3">
              <img
                src={image}
                alt="car"
                className="w-36 h-20 lg:w-52 lg:h-36 rounded-md object-cover"
              />
              <div>
                <p className="font-medium">{vehicleName}</p>
                <p className="text-xs text-muted-foreground">
                  Max {maxPassengers} Passengers • {maxBags} Bags
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 mb-2">PASSENGER</p>
            <div className="space-y-1 hidden md:block text-sm">
              <p className="font-medium text-gray-400 text-xs">
                Lead Passenger
              </p>
              <p className="font-medium">
                {passengerInfo?.fullName || "John Doe"}
              </p>
              <p className="text-muted-foreground">Contact</p>
              <p>{passengerInfo?.phone || "+1 (555) 000-0000"}</p>
              <p className="font-medium text-gray-400 text-xs">Email</p>
              <p>{passengerInfo?.email || "john.doe@example.com"}</p>
            </div>
          </div>

          {/* sm device design info  */}
          <div className="grid grid-cols-2 gap-8 md:hidden text-sm">
            <div>
              <p className="font-medium text-gray-400 text-xs">
                Lead Passenger
              </p>
              <p className="font-medium">
                {passengerInfo?.fullName || "John Doe"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Contact</p>
              <p>{passengerInfo?.phone || "+1 (555) 000-0000"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400 text-xs">Email</p>
              <p>{passengerInfo?.email || "john.doe@example.com"}</p>
            </div>
            <div>
              <p className="font-medium text-gray-400 text-xs">TOTAL PAID</p>
              <p className="font-bold">
                {`$${(vehicle?.total_price || 140).toFixed(2)}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-b-xl py-6 p-6 hidden md:block">
        <p className="text-xs font-bold text-muted-foreground mb-4">
          PAYMENT SUMMARY
        </p>

        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-5">
            <div>
              <p className="text-muted-foreground">Base fare</p>
              <p className="font-medium">
                {basePrice ? `$${basePrice.toFixed(2)}` : "$0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Taxes & fees</p>
              <p className="font-medium">
                {taxesAmount ? `$${taxesAmount.toFixed(2)}` : "$0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Gratuity</p>
              <p className="font-medium">{gratuityAmount ? `$${gratuityAmount.toFixed(2)}` : "$0.00"}</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-muted-foreground">TOTAL PAID</p>
            <p className="text-lg font-bold">
              {`$${(
                (vehicle?.total_price || 140)
              )
                .toFixed(2)}`}
            </p>
          </div>
        </div>
        <div className="text-center border-t mt-4 pt-4 block md:hidden">
          <p className="text-muted-foreground">TOTAL PAID</p>
          <p className="text-lg font-bold">
            {`$${(
              (vehicle?.total_price || 0)
            )
              .toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row md:justify-center gap-3 pt-6">
        {/* <Button className="gap-2 rounded-xs">
          <FaCalendarPlus /> Add to calendar
        </Button> */}

        {/* <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xs hidden md:flex"
        >
          <FaPrint className="text-sm" />
          <span>Print receipt</span>
        </Button> */}

        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-xs hidden md:flex"
          onClick={() => router.push("/book-a-ride")}
        >
          <FaRedo className="text-sm" />
          <span>Return to booking</span>
        </Button>

        <div className="md:hidden flex justify-between mt-5">
          {/* <Button variant="outline" className="gap-2 rounded-xs">
            <FaPrint /> Print receipt
          </Button> */}

          <Button variant="outline" className="gap-2 rounded-xs">
            <FaRedo /> Return to booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RideConfirm;
