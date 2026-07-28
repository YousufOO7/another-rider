/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FiCreditCard, FiClock } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { CiLock } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import Label from "@/app/utils/common/Label";

type Props = {
  payment: any;
  billingAddress: any;
  pickup: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const PaymentMethod = ({
  payment,
  billingAddress,
  pickup,
  setFormData,
}: Props) => {
  const handlePaymentChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      payment: {
        ...prev.payment,
        [field]: value,
      },
    }));
  };

  const handleBillingChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));
  };
  const [method, setMethod] = useState<"card" | "wallet" | "later">("card");

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm h-full">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Payment method</h2>
          <p className="text-sm text-muted-foreground">
            All payments are processed securely.
          </p>
        </div>
        <span className="text-sm flex items-center gap-1 text-green-600 font-medium">
          <CiLock className="text-xl" /> 256-bit SSL
        </span>
      </div>

      {/* Payment Tabs */}
      <div className="mb-6 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3">
        <Button
          variant="outline"
          onClick={() => setMethod("card")}
          className={`flex items-center  transition p-8 cursor-pointer
    ${method === "card" ? "border-2 border-black" : "border border-input"}
  `}
        >
          <p>
            <p className="flex justify-center">
              <FiCreditCard />
            </p>
            <p>Card</p>
          </p>
        </Button>

        <Button
          variant="outline"
          className={`flex items-center gap-2 transition p-8 cursor-pointer
    ${method === "wallet" ? "border-2 border-black" : "border border-input"}
  `}
          onClick={() => setMethod("wallet")}
        >
          <p>
            <p className="flex justify-center">
              <LuWallet />
            </p>
            <p>Apple / Google Pay</p>
          </p>
        </Button>

        <Button
          variant="outline"
          className={`flex items-center gap-2 transition p-8 cursor-pointer
    ${method === "later" ? "border-2 border-black" : "border border-input"}
  `}
          onClick={() => setMethod("later")}
        >
          <p>
            <p className="flex justify-center">
              <FiClock />
            </p>
            <p>Pay later</p>
          </p>
        </Button>
      </div>

      {/* Card Form */}
      {method === "card" && (
        <div className="space-y-4">
          <div className="relative">
            <IoWalletOutline
              className="absolute left-3 top-1/2 -translate-y-1/2 mt-3 text-muted-foreground"
              size={18}
            />
            <Label
              text="Card Number"
              className="font-bold text-gray-400 mb-2"
              required={false}
            />
            <Input
              className="pl-10"
              placeholder="0000 0000 0000 0000"
              value={payment.cardNumber}
              onChange={(e) =>
                handlePaymentChange("cardNumber", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Label
                text="Expiry Date"
                className="font-bold text-gray-400 mb-2"
                required={false}
              />
              <Input
                placeholder="MM / YY"
                value={payment.expiry}
                onChange={(e) => handlePaymentChange("expiry", e.target.value)}
              />
            </div>
            <div className="relative">
              <Label
                text="Expiry Date"
                className="font-bold text-gray-400 mb-2"
                required={false}
              />
              <Input
                placeholder="CVC"
                value={payment.cvc}
                onChange={(e) => handlePaymentChange("cvc", e.target.value)}
              />
            </div>
          </div>
          <Label
            text="Name on card"
            className="font-bold text-gray-400 mb-2"
            required={false}
          />
          <Input
            value={payment.nameOnCard}
            onChange={(e) => handlePaymentChange("nameOnCard", e.target.value)}
            placeholder="Name on card"
          />

          <div className="flex items-center gap-2">
            <Checkbox id="save-card" />
            <label htmlFor="save-card" className="text-sm">
              Save this card for future rides
            </label>
          </div>

          <hr className="my-4" />

          {/* Billing Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox
                id="same-address"
                checked={billingAddress.sameAsPickup}
                onCheckedChange={(checked) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    billingAddress: {
                      ...prev.billingAddress,
                      sameAsPickup: checked,
                      street: checked ? pickup : "",
                    },
                  }));
                }}
              />

              <label htmlFor="same-address" className="text-sm">
                Billing address same as pickup
              </label>
            </div>

            <div className="relative">
              <Label
                text="Street address"
                className="font-bold text-gray-400 mb-2"
                required={false}
              />
              <Input
                placeholder="Street address"
                value={billingAddress.street}
                disabled={billingAddress.sameAsPickup}
                onChange={(e) => handleBillingChange("street", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Label
                  text="City"
                  className="font-bold text-gray-400 mb-2"
                  required={false}
                />
                <Input
                  placeholder="City"
                  value={billingAddress.city}
                  onChange={(e) => handleBillingChange("city", e.target.value)}
                />
              </div>
              <div className="relative">
                <Label
                  text="ZIP / Postal code"
                  className="font-bold text-gray-400 mb-2"
                  required={false}
                />
                <Input
                  placeholder="ZIP / Postal code"
                  value={billingAddress.zip}
                  onChange={(e) => handleBillingChange("zip", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet */}
      {method === "wallet" && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Continue with Apple Pay or Google Pay
        </div>
      )}

      {/* Pay later */}
      {method === "later" && (
        <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
          Pay after completing your ride.
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
