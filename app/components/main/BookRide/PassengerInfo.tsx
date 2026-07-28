/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateBookingsMutation } from "@/app/redux/features/bookings/bookingsApi";
import BackButton from "@/app/utils/common/BackButton";
import Label from "@/app/utils/common/Label";
import DistanceDisplay from "@/app/utils/helper/DistanceDisplay";
import { setQuoteData } from "@/app/utils/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  onNext: () => void;
  onBack: () => void;
  passengerInfo: {
    fullName: string;
    phone: string;
    email: string;
    flightNumber: string;
    airline: string;
    childSeat: boolean;
    instructions: string;
  };
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const PassengerInfo = ({
  onBack,
  passengerInfo,
  setFormData,
  formData,
}: Props) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      passengerInfo: {
        ...prev.passengerInfo,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      },
    }));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);

      setFormData((prev: any) => ({
        ...prev,
        passengerInfo: {
          ...prev.passengerInfo,
          fullName: parsedUser?.name ?? "",
          email: parsedUser?.email ?? "",
          phone: parsedUser?.phone ?? "",
        },
      }));
    }
  }, [setFormData]);

  const [createBooking] = useCreateBookingsMutation({});
  const totalPrice = formData?.vehicle?.calculation?.total_price || 0;

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const buildPayload = (includeVehicleId = false) => {
    const pickupDateTime = formData.pickupDate
      ? `${formData.pickupDate.getFullYear()}-${String(
          formData.pickupDate.getMonth() + 1,
        ).padStart(2, "0")}-${String(formData.pickupDate.getDate()).padStart(
          2,
          "0",
        )} ${formData.pickupTime}`
      : null;

    const totalHours =
      Number(formData.hours || 0) + Number(formData.minutes || 0) / 60;

    const {
      fullName,
      email,
      phone,
      flightNumber,
      airline,
      childSeat,
      instructions,
    } = formData.passengerInfo || {};

    return {
      service_type: formData.mode,
      pickup_time: pickupDateTime,
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      passengers: formData.passengers.passengers,
      distance_km: formData.distanceValue / 1000,
      child_seats: formData.passengers.kids || 0,
      hours: totalHours,
      name: fullName,
      email: email,
      phone: phone,
      // Optional fields
      flight_number: flightNumber || null,
      airline: airline || null,
      child_seat_required: childSeat || false,
      special_instructions: instructions || null,
      ...(includeVehicleId && {
        vehicle_id: formData.vehicle?.vehicle_id,
      }),
    };
  };

  const validatePassengerInfo = () => {
    const { fullName, email, phone } = passengerInfo;

    if (!fullName) {
      toast.error("Please fill in all required fields Full Name");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone validation (basic)
    if (phone.length < 11) {
      toast.error("Please enter a valid phone number");
      return;
    }

    return true;
  };

  const handleSeePriceQuote = async () => {
    try {
      if (!validatePassengerInfo()) {
        return;
      }

      setIsLoading(true);

      const payload = buildPayload(true);
      // console.log("Sending payload to API:", payload);
      // return;

      const res = await createBooking(payload).unwrap();

      const bookingId = res?.data?.id;
      const bookingToken = res?.booking_access_token;
      const customerId = res?.data?.customer_id;

      const updatedFormData = {
        ...formData,
        booking_id: bookingId,
        booking_access_token: bookingToken,
        customer_id: customerId,
      };

      setQuoteData(updatedFormData);
      setFormData(updatedFormData);

      router.push("/manage-reservation?from=book-a-ride");
    } catch (error) {
      toast.error("Failed to fetch price quote. Please try again.");
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-xl mx-auto mb-5 md:mb-20">
        {/* Back */}
        <BackButton onClick={onBack} text="Back to vehicle selection" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-3">Passenger Details</h2>
            <p className="text-xs font-bold text-gray-400">
              Keep your contact and flight details in one place for a smooth
              pickup.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm border">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold mb-1 text-lg md:text-2xl">
              Contact person
            </h3>
            {/* <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
            Step 3 of 4
          </span> */}
          </div>

          {/* Contact person */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 mb-4">
              PRIMARY CONTACT
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label text="Full Name" className="font-bold" required={true} />
                <Input
                  name="fullName"
                  value={passengerInfo.fullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  type="text"
                  className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <Label
                  text="Phone Number"
                  className="font-bold"
                  required={true}
                />
                <Input
                  type="number"
                  name="phone"
                  value={passengerInfo.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            <div>
              <Label
                text="Email Address"
                className="font-bold"
                required={true}
              />
              <Input
                type="email"
                name="email"
                value={passengerInfo.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          {/* Flight & preferences */}
          <div className="mb-3 md:mb-6">
            <p className="text-xs font-semibold text-gray-400 mb-4">
              FLIGHT & PREFERENCES (OPTIONAL)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label
                  text="Flight Number (Optional)"
                  className="font-bold"
                  required={false}
                />
                <Input
                  type="text"
                  name="flightNumber"
                  value={passengerInfo.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g. AA1234"
                  className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <Label
                  text="Airline (Optional)"
                  className="font-bold"
                  required={false}
                />
                <Input
                  type="text"
                  name="airline"
                  value={passengerInfo.airline}
                  onChange={handleChange}
                  placeholder="e.g. American Airlines"
                  className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Child seat */}
            <div className="flex items-start gap-2 mb-4">
              <input
                name="childSeat"
                checked={passengerInfo.childSeat}
                onChange={handleChange}
                type="checkbox"
                className="mt-1"
              />
              <div>
                <p className="text-sm font-medium">
                  Request a child safety seat
                </p>
                <p className="text-xs text-gray-500">
                  We will provide an age-appropriate seat and install it for
                  you.
                </p>
              </div>
            </div>

            {/* Special instructions */}
            <div>
              <Label
                text="Special Instructions (optional)"
                className="font-bold"
                required={false}
              />
              <Textarea
                name="instructions"
                value={passengerInfo.instructions}
                onChange={handleChange}
                rows={3}
                placeholder="Add notes for your driver (gate number, meeting point, language preference...)"
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black resize-none"
              />
            </div>
          </div>

          <div className="flex justify-between items-center gap-6">
            <div>
              <DistanceDisplay
                distance={formData.distance}
                duration={formData.duration}
              />
            </div>

            <div className="rounded-lg border bg-gray-50 px-4 py-3">
              <p>Total Price: ${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Footer */}
          <div className=" hidden md:block">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-xs text-gray-400 md:max-w-2/3">
                You can review all trip details on the next step before
                confirming payment.
              </p>

              <Button
                onClick={handleSeePriceQuote}
                disabled={isLoading}
                size={"sm"}
                className="cursor-pointer py-2 mt-4 md:mt-0 font-medium flex items-center gap-2"
              >
                {isLoading ? "Loading..." : "Continue to Payment →"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between md:hidden">
        <p className="text-xs text-gray-400 text-center mb-2">
          You can review all trip details on the next step before confirming
          payment.
        </p>
      </div>

      <div className="bg-white md:hidden py-2 flex justify-center">
        <Button
          onClick={handleSeePriceQuote}
          disabled={isLoading}
          className="cursor-pointer py-2 rounded-none mt-4 md:mt-0 font-medium flex items-center gap-2"
        >
          {isLoading ? "Loading..." : "Continue to Payment →"}
        </Button>
      </div>
    </div>
  );
};

export default PassengerInfo;
