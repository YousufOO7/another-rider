/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getQuoteData } from "@/app/utils/storage";
import {
  CardElement,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useAuthorizeBookingPaymentMutation } from "@/app/redux/features/bookings/bookingsApi";
import { Button } from "@/components/ui/button";

interface CheckoutFormProps {
  onSuccess: () => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [authorizePayment, { isLoading }] =
    useAuthorizeBookingPaymentMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (error) {
      toast.error("Failed to process payment");
      return;
    }

    const storedData = getQuoteData();

    const bookingId = storedData?.booking_id;
    const bookingAccessToken = storedData?.booking_access_token;
    const customerId = storedData?.customer_id;

    try {
      // eslint-disable-next-line prefer-const
      let body: any = {
        payment_method_id: paymentMethod?.id,
      };

      //  Guest User
      if (!customerId) {
        body.booking_access_token = bookingAccessToken;
      }

      // Customer হলে booking_access_token যাবে না
      await authorizePayment({
        bookingId,
        body,
      }).unwrap();

      toast.success("Payment Authorized Successfully");
      onSuccess();
    } catch (err: any) {
      console.log(err);
      toast.error("Payment authorization failed");
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
