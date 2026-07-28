/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import StepIndicator from "@/app/utils/common/StepIndicator";
// import SecurePayment from "./SecurePayment";
import { clearQuoteData, getQuoteData } from "@/app/utils/storage";
import PriceWhereAndWhen from "./PriceWhereAndWhen";
import PriceSelectVehicle from "./PriceSelectVehicle";

const PriceBookingForm = () => {
  const [step, setStep] = useState(1);
  const [showPriceWhereAndWhen, setShowPriceWhereAndWhen] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);
  const now = new Date();
  const defaultTime = now.toTimeString().slice(0, 8);

  const [formData, setFormData] = useState({
    mode: "point_to_point",
    pickupDate: now,
    pickupTime: defaultTime,
    pickup_address: "",
    dropoff_address: "",
    passengers: {
      passengers: 0,
      child_seats: 0,
      bags: 0,
    },
    passengerInfo: {
      fullName: "",
      phone: "",
      email: "",
      flightNumber: "",
      airline: "",
      childSeat: false,
      instructions: "",
    },
    vehicle: null as { name: string; price?: number } | null,
    payment: {
      method: "card" as "card" | "wallet" | "later",
      cardNumber: "",
      expiry: "",
      cvc: "",
      nameOnCard: "",
      saveCard: false,
    },

     distance: "",              // "12.4 km"
  distanceValue: 0,          
  estimatedTime: "",         
  estimatedTimeValue: 0,

    billingAddress: {
      sameAsPickup: true,
      street: "",
      city: "",
      zip: "",
    },
  });

      useEffect(() => {
  const storedData = getQuoteData();
  if (storedData) {
    setFormData((prev: any) => ({
      ...prev,
      ...storedData,
      passengers: {
        ...prev.passengers,
        ...storedData.passengers,
      },
      pickupDate: storedData.pickupDate ? new Date(storedData.pickupDate) : prev.pickupDate,
    }));
  }
}, []);

    const handleShowPriceWhereAndWhen = () => {
    setShowPriceWhereAndWhen(true);
  };

  // ব্যাক বাটনে ক্লিক করলে আবার WhereAndWhen দেখাবে
  const handleBackToWhereAndWhen = () => {
    setShowPriceWhereAndWhen(false);
  };
 

useEffect(() => {
  clearQuoteData();
}, []);

  return (
    <div className="px-5 md:px-0 lg:mt-10 pt-10">
      <div className="max-w-3xl mx-auto  mb-20">
        <StepIndicator currentStep={step} />
        {step === 1 && (
          <>
            {!showPriceWhereAndWhen ? (
              <PriceWhereAndWhen
                pickup_address={formData.pickup_address}
                dropoff_address={formData.dropoff_address}
                passengers={formData.passengers}
                setFormData={setFormData}
                pickupDate={formData.pickupDate}
                pickupTime={formData.pickupTime}
                onNext={nextStep}
                formData={formData}
                onShowPriceWhereAndWhen={handleShowPriceWhereAndWhen}
              />
            ) : (
              <PriceWhereAndWhen
                pickup_address={formData.pickup_address}
                dropoff_address={formData.dropoff_address}
                passengers={formData.passengers}
                setFormData={setFormData}
                pickupDate={formData.pickupDate}
                pickupTime={formData.pickupTime}
                onNext={nextStep}
                formData={formData}
                onBack={handleBackToWhereAndWhen}
                isFromPriceQuote={true}
              />
            )}
          </>
        )}
        {step === 2 && (
          <div>
            <PriceSelectVehicle
              onNext={nextStep}
              onBack={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
       
      </div>
    </div>
  );
};

export default PriceBookingForm;