/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getQuoteData, setQuoteData } from "@/app/utils/storage";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";
import {
  useAuthorizeBookingPaymentMutation,
  useCreateBookingsMutation,
} from "@/app/redux/features/bookings/bookingsApi";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [authorizePayment, { isLoading }] =
    useAuthorizeBookingPaymentMutation();
  const [createBooking] = useCreateBookingsMutation();

  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();

  //   if (!stripe || !elements) return;

  //   const cardNumberElement = elements.getElement(CardNumberElement);
  //   if (!cardNumberElement) return;

  //   const { error, paymentMethod } = await stripe.createPaymentMethod({
  //     type: "card",
  //     card: cardNumberElement,
  //   });

  //   if (error) {
  //     toast.error("Failed to process payment");
  //     return;
  //   }

  //   const storedData = getQuoteData();

  //   const bookingId = storedData?.booking_id;
  //   const bookingAccessToken = storedData?.booking_access_token;
  //   const customerId = storedData?.customer_id;

  //   try {
  //     // eslint-disable-next-line prefer-const
  //     let body: any = {
  //       payment_method_id: paymentMethod?.id,
  //     };

  //     //  Guest User
  //     if (!customerId) {
  //       body.booking_access_token = bookingAccessToken;
  //     }

  //     // Customer হলে booking_access_token যাবে না
  //     await authorizePayment({
  //       bookingId,
  //       body,
  //     }).unwrap();

  //     toast.success("Payment Authorized Successfully");
  //     onSuccess();
  //   } catch (err: any) {
  //     console.log(err);
  //     toast.error("Payment authorization failed");
  //   }
  // };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    // 1️⃣ Payment method create
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      toast.error("Failed to process payment");
      return;
    }

    const storedData = getQuoteData();
    if (!storedData) {
      toast.error("Booking data not found");
      return;
    }

    try {
      // 2️⃣ Booking payload build করুন (PassengerInfo এর buildPayload logic এখানে আনুন)
      const pickupDateObj = storedData.pickupDate
        ? new Date(storedData.pickupDate)
        : null;

      const isValidDate = pickupDateObj && !isNaN(pickupDateObj.getTime());

      const pickupDateTime = isValidDate
        ? `${pickupDateObj.getFullYear()}-${String(
            pickupDateObj.getMonth() + 1,
          ).padStart(2, "0")}-${String(pickupDateObj.getDate()).padStart(
            2,
            "0",
          )} ${storedData.pickupTime || "00:00"}`
        : null;

      const totalHours =
        Number(storedData.hours || 0) + Number(storedData.minutes || 0) / 60;

      const passengerInfoData = storedData?.passengerInfo || {};
      const totalLuggage = storedData.passengers?.bags || 0;

      const payload = {
        service_type: storedData.mode,
        pickup_time: pickupDateTime,
        pickup_address: storedData.pickup_address,
        dropoff_address: storedData.dropoff_address,
        passengers: storedData.passengers?.passengers || 0,
        distance_km: Number(storedData.distanceValue || 0) / 1000,
        child_seats: storedData.passengers?.child_seats || 0,
        bags: totalLuggage || 0,
        hours: totalHours,
        vehicle_class_id: storedData.vehicle?.vehicle_class_id,
        name: passengerInfoData.fullName || "",
        email: passengerInfoData.email || "",
        phone: passengerInfoData.phone || "",
        customer_id: passengerInfoData.id || null,
        flight_number: passengerInfoData.flightNumber || "",
        airlines: passengerInfoData.airline || "",
        notes: passengerInfoData.instructions || "",
        child_seat_requested: passengerInfoData.childSeat || false,
      };

      // 3️⃣ Booking create করুন

      const bookingRes = await createBooking(payload).unwrap();
      const bookingId = bookingRes?.data?.id;
      const bookingAccessToken = bookingRes?.booking_access_token;
      const customerId = bookingRes?.data?.customer_id;

      if (!bookingId) {
        toast.error("Booking creation failed");
        console.error("❌ No booking ID. Response:", bookingRes);
        return;
      }

      // 4️⃣ Payment authorize করুন
      let body: any = {
        payment_method_id: paymentMethod?.id,
      };

      if (!customerId) {
        body.booking_access_token = bookingAccessToken;
      }

      const authRes = await authorizePayment({
        bookingId,
        body,
      }).unwrap();

      console.log("✅ Payment authorized:", authRes);
      // 5️⃣ Updated data store করুন
      const updatedData = {
        ...storedData,
        booking_id: bookingId,
        booking_access_token: bookingAccessToken,
        customer_id: customerId,
      };
      setQuoteData(updatedData);

      toast.success("Payment & Booking Successful");
      onSuccess();
    } catch (err: any) {
      // নির্দিষ্ট error message দেখান
      const errorMsg =
        err?.data?.message ||
        err?.data?.error ||
        err?.message ||
        "Payment or booking failed";
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10">
      <div className="border p-4 rounded mb-4 bg-white">
        <div className="mb-4">
          <label className="block text-sm mb-1">Card number</label>
          <div className="border rounded p-3 bg-white">
            <CardNumberElement />
          </div>
        </div>

        {/* Expiry + CVC */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm mb-1">Expiry</label>
            <div className="border rounded p-3 bg-white">
              <CardExpiryElement />
            </div>
          </div>

          <div className="w-1/2">
            <label className="block text-sm mb-1">CVC</label>
            <div className="border rounded p-3 bg-white">
              <CardCvcElement />
            </div>
          </div>
        </div>
      </div>

      <Button
        disabled={isLoading}
        type="submit"
        variant={"default"}
        className="cursor-pointer w-full"
      >
        {isLoading ? "Processing..." : "Pay (Test Mode)"}
      </Button>
    </form>
  );
}
