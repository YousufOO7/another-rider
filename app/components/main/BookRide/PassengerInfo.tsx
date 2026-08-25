/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BackButton from "@/app/utils/common/BackButton";
import Label from "@/app/utils/common/Label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookingSummary from "./BookingSummary";
import { useRouter } from "next/navigation";
import { useCreateBookingsMutation } from "@/app/redux/features/bookings/bookingsApi"; // ইম্পোর্ট করুন

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
  const [showSummary, setShowSummary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [createBooking] = useCreateBookingsMutation({}); // হুক যোগ করুন

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev: any) => ({
      ...prev,
      passengerInfo: {
        ...prev.passengerInfo,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  // Load user data from localStorage if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setFormData((prev: any) => {
          const hasUserData = prev?.passengerInfo?.fullName && 
                             prev?.passengerInfo?.email && 
                             prev?.passengerInfo?.phone;
          
          if (hasUserData) {
            return prev;
          }

          return {
            ...prev,
            passengerInfo: {
              ...prev.passengerInfo,
              fullName: parsedUser?.name || parsedUser?.fullName || "",
              email: parsedUser?.email || "",
              phone: parsedUser?.phone || "",
            },
          };
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [setFormData]);

  // Validate passenger info
  const validatePassengerInfo = () => {
    const currentInfo = formData?.passengerInfo || passengerInfo;
    const { fullName, email, phone } = currentInfo;

    if (!fullName || fullName.trim() === "") {
      toast.error("Please enter your full name");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!phone || phone.length < 11) {
      toast.error("Please enter a valid phone number (minimum 11 digits)");
      return false;
    }

    return true;
  };

  // বুকিং তৈরির ফাংশন
  const buildPayload = (includeVehicleId = false) => {
    const pickupDateTime = formData.pickupDate
      ? `${formData.pickupDate.getFullYear()}-${String(
          formData.pickupDate.getMonth() + 1
        ).padStart(2, "0")}-${String(
          formData.pickupDate.getDate()
        ).padStart(2, "0")} ${formData.pickupTime}`
      : null;

    const totalHours =
      Number(formData.hours || 0) +
      Number(formData.minutes || 0) / 60;

    // প্যাসেঞ্জার ইনফো যোগ করুন
    const passengerInfoData = formData?.passengerInfo || {};

    return {
      service_type: formData.mode,
      pickup_time: pickupDateTime,
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      passengers: formData.passengers.passengers,
      distance_km: formData.distanceValue / 1000,
      child_seats: formData.passengers.kids || 0,
      hours: totalHours,
      ...(includeVehicleId && {
        vehicle_id: formData.vehicle?.id,
      }),
      // প্যাসেঞ্জার ইনফো যোগ করুন
      name: passengerInfoData.fullName || "",
      email: passengerInfoData.email || "",
      phone: passengerInfoData.phone || "",
      flight_number: passengerInfoData.flightNumber || "",
      airline: passengerInfoData.airline || "",
      special_instructions: passengerInfoData.instructions || "",
      child_seat_requested: passengerInfoData.childSeat || false,
    };
  };

  // Handle show summary - এখানে বুকিং API কল হবে
  const handleShowSummary = async () => {
    try {
      // Validate passenger info
      if (!validatePassengerInfo()) {
        return;
      }

      // Validate vehicle selection
      if (!formData.vehicle) {
        toast.error("Please select a vehicle first");
        return;
      }

      setIsLoading(true);

      // বুকিং API কল করুন
      const payload = buildPayload(true);
      const res = await createBooking(payload).unwrap();
      
      // বুকিং আইডি সেভ করুন
      if (res?.data?.id) {
        setFormData((prev: any) => ({ 
          ...prev, 
          bookingId: res.data.id 
        }));
      }

      toast.success("Booking created successfully!");
      setShowSummary(true);
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error creating booking:", err);
      
      let errorMessage = "Failed to create booking. Please try again.";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.errors?.[0]?.msg) {
        errorMessage = err.data.errors[0].msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      if (errorMessage.includes("not available")) {
        errorMessage = "Selected vehicle is not available for the requested time. Please choose another vehicle.";
      }
      
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  // If showSummary is true, render BookingSummary
  if (showSummary) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <BackButton onClick={() => setShowSummary(false)} text="Back to passenger details" />
        <div className="mt-4">
          <BookingSummary
            vehicleName={formData?.vehicle?.name || "Vehicle"}
            pickup={formData?.pickup_address}
            dropoff={formData?.dropoff_address}
            date={formData?.pickupDate?.toLocaleDateString()}
            time={formData?.pickupTime}
            passengers={formData?.passengers?.passengers}
            bags={formData?.passengers?.bags}
            bookingId={formData?.bookingId}
            onConfirm={() => {
              router.push("/");
            }}
          />
        </div>
      </div>
    );
  }

  // Get current passenger info for display
  const currentInfo = formData?.passengerInfo || passengerInfo;

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
                  value={currentInfo.fullName || ""}
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
                  type="tel"
                  name="phone"
                  value={currentInfo.phone || ""}
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
                value={currentInfo.email || ""}
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
                  value={currentInfo.flightNumber || ""}
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
                  value={currentInfo.airline || ""}
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
                checked={currentInfo.childSeat || false}
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
                value={currentInfo.instructions || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Add notes for your driver (gate number, meeting point, language preference...)"
                className="w-full mt-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="hidden md:block">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-xs text-gray-400 md:max-w-2/3">
                You can review all trip details on the next step before
                confirming payment.
              </p>

              <Button
                onClick={handleShowSummary}
                disabled={isLoading}
                size={"sm"}
                className="cursor-pointer py-2 mt-4 md:mt-0 font-medium flex items-center gap-2"
              >
                {isLoading ? "Creating Booking..." : "Show Summary →"}
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
          onClick={handleShowSummary}
          disabled={isLoading}
          className="cursor-pointer py-2 rounded-none mt-4 md:mt-0 font-medium flex items-center gap-2"
        >
          {isLoading ? "Creating Booking..." : "Show Summary →"}
        </Button>
      </div>
    </div>
  );
};

export default PassengerInfo;