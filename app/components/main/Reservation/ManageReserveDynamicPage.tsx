"use client";
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
// import RideConfirm from "./RideConfirm";
import { getQuoteData } from "@/app/utils/storage";
import FindMyReservation from "./FindMyReservation";
import { useSearchParams } from "next/navigation";
import ViewReservation from "./ViewReservation";
import StripeProvider from "@/app/stripe-provider";
import CheckoutForm from "./CheckoutForm";
import RideConfirm from "./RideConfirm";

const ManageReserveDynamicPage = () => {
  const [stored, setStored] = useState([]);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
    const [step, setStep] = useState(1);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1); 

  useEffect(() => {
    const storedData = getQuoteData();
    setStored(storedData);
  }, []);

  console.log(stored);
  console.log(from);

  //   const pickupDate = formData.pickupDate ? new Date(formData.pickupDate) : null;

  return (
    <div className="px-5 md:px-0">
      {from === "book-a-ride" ? (
        <>
          <div className="container md:max-w-2xl lg:max-w-4xl mx-auto">
            {paymentSuccess ? (
        <RideConfirm rideData={stored} />
      ) : (
        <StripeProvider>
          <CheckoutForm onSuccess={() => setPaymentSuccess(true)} />
        </StripeProvider>
      )}
          </div>
        </>
      ) : (
        <div>
         {step === 1 && (
          <FindMyReservation onNext={nextStep} />
         )}
         {
          step === 2 && (
            <ViewReservation rideData={stored} onBack={prevStep} />
          )
         }
          
        </div>
      )}
    </div>
  );
};

export default ManageReserveDynamicPage;
