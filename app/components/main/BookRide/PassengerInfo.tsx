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
  const router = useRouter();
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

  const [isLoading, setIsLoading] = useState(false);

  const validatePassengerInfo = () => {
    const { fullName, email, phone } = passengerInfo;

    if (!fullName) {
      toast.error("Please fill in all required fields Full Name");
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    // Phone validation (basic)
    if (phone.length < 11) {
      toast.error("Please enter a valid phone number");
      return false;
    }

    return true;
  };

  const handleShowSummary = async () => {
    try {
      if (!validatePassengerInfo()) {
        return;
      }

      setIsLoading(true);

      // Check if booking already exists from SelectVehicle
      if (formData?.bookingId) {
        // Booking already created in SelectVehicle, just show summary
        setShowSummary(true);
        setIsLoading(false);
        return;
      }

      // If no booking exists (shouldn't happen with current flow)
      toast.error("No booking found. Please select a vehicle first.");
      setIsLoading(false);
      
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error:", error);
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
            onConfirm={() => {
              router.push("/");
            }}
          />
        </div>
      </div>
    );
  }

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
                {isLoading ? "Loading..." : "Show Summary →"}
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
          {isLoading ? "Loading..." : "Show Summary →"}
        </Button>
      </div>
    </div>
  );
};

export default PassengerInfo;