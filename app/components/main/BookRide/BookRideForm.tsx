/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import WhereAndWhen from "./WhereAndWhen";
import SelectVehicle from "./SelectVehicle";
import StepIndicator from "@/app/utils/common/StepIndicator";
import PassengerInfo from "./PassengerInfo";
// import SecurePayment from "./SecurePayment";
import { clearQuoteData, getQuoteData } from "@/app/utils/storage";

const BookRideForm = () => {
  const [step, setStep] = useState(1);

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
    setFormData((prev) => ({
      ...prev,
      ...storedData,
      passengers: {
        passengers: storedData.passengers?.passengers ?? prev.passengers.passengers,
        child_seats: storedData.passengers?.child_seats ?? prev.passengers.child_seats,
        bags: storedData.passengers?.bags ?? prev.passengers.bags,
      },
      pickupDate: storedData.pickupDate ? new Date(storedData.pickupDate) : prev.pickupDate,
    }));
  }
}, []);
 
//   const pickupDate = formData.pickupDate ? new Date(formData.pickupDate) : null;

//   const handleConfirmBooking = () => {
//   console.log("FINAL BOOKING DATA 👉", formData);
// };
useEffect(() => {
  clearQuoteData();
}, []);

  return (
    <div className="px-5 md:px-0">
      <div className="container md:max-w-2xl lg:max-w-3xl mx-auto">
        <StepIndicator currentStep={step} />
        {step === 1 && (
          <WhereAndWhen
            pickup_address={formData.pickup_address}
            dropoff_address={formData.dropoff_address}
            passengers={formData.passengers}
            setFormData={setFormData}
            pickupDate={formData.pickupDate}
            pickupTime={formData.pickupTime}
            onNext={nextStep}
             formData={formData}
          />
        )}
        {step === 2 && (
          <div>
            <SelectVehicle
              onNext={nextStep}
              onBack={prevStep}
              formData={formData}
              setFormData={setFormData}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <PassengerInfo
              passengerInfo={formData.passengerInfo}
              setFormData={setFormData}
              onBack={prevStep}
              onNext={nextStep}
              formData={formData}
            />
          </div>
        )}
      </div>
      {/* <div className="container md:max-w-2xl lg:max-w-4xl mx-auto mb-20">
        {step === 4 && (
          <div>
            <SecurePayment
              vehicleName={formData.vehicle?.name || "Luxury Sedan"}
              baseRate={formData.vehicle?.price || 120}
              taxesAndFees={0.5 * (formData.vehicle?.price || 120)}
              gratuity={0.1 * (formData.vehicle?.price || 120)}
              total={
                formData.vehicle?.price
                  ? formData.vehicle.price +
                    0.5 * formData.vehicle.price +
                    0.1 * formData.vehicle.price
                  : 0
              }
              pickup={`${formData.pickup}
${pickupDate?.toLocaleDateString()} ${formData.pickupTime}`}
              dropoff={formData.dropoff}
              passengers={formData.passengers.travelers + formData.passengers.kids}
              bags={formData.passengers.bags}
              onBack={prevStep}
              formData={formData}
              setFormData={setFormData}
              onConfirm={handleConfirmBooking} 
            />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default BookRideForm;
