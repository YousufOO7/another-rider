/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { FiClock, FiMapPin, FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/app/utils/helper/DateTimePicker";
import PickupAndDropOff from "@/app/utils/helper/PickupAndDropOff";
import { getQuoteData, setQuoteData } from "@/app/utils/storage";
import { useRouter } from "next/navigation";
import DistanceDisplay from "@/app/utils/helper/DistanceDisplay";
import { IoChevronBack } from "react-icons/io5";

type PassengerKey = "passengers" | "child_seats" | "bags" | "adults";

const Counter = ({
  label,
  value,
  onIncrement,
  onDecrement,
}: {
  label: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div>
    <p className="mb-1 text-xs text-gray-500">{label}</p>
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <button onClick={onDecrement} className="text-gray-400 hover:text-black">
        <FiMinus />
      </button>
      <span className="text-sm font-medium">{value}</span>
      <button onClick={onIncrement} className="text-gray-400 hover:text-black">
        <FiPlus />
      </button>
    </div>
  </div>
);

const PriceQuoteForm = () => {
  const [formData, setFormData] = useState<any>({
    mode: "point_to_point", // default
    pickupDate: undefined,
    pickupTime: "",
    pickup_address: "",
    dropoff_address: "",
    passengers: {
      passengers: 0,
      kids: 0,
      bags: 0,
    },
    hours: 3,
    minutes: 0,
    extraStops: [] as { type: "pickup" | "dropoff"; location: string }[],
  });

  console.log(formData);

  useEffect(() => {
    const storedData = getQuoteData();
    if (!storedData) return;

    setFormData((prev: any) => ({
      ...prev,
      ...storedData,
      passengers: {
        ...prev.passengers,
        ...storedData.passengers,
      },
      pickupDate: storedData.pickupDate
        ? new Date(storedData.pickupDate)
        : prev.pickupDate,
    }));
  }, []);

  const updateFormData = (updater: (prev: any) => any) => {
    setFormData((prev: any) => {
      const updated = updater(prev);
      setQuoteData(updated); // ✅ localStorage sync
      return updated;
    });
  };

  const updatePassenger = (key: PassengerKey, value: number) => {
    updateFormData((prev: any) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [key]: Math.max(0, prev.passengers[key] + value),
      },
    }));
  };

  const {
    mode,
    pickupDate,
    pickupTime,
    pickup_address,
    dropoff_address,
    passengers,
    hours,
    minutes,
    extraStops,
  } = formData;

  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto mt-10 mb-20 rounded-xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">PRICE QUOTE</h2>

        <div className="flex rounded-2xl border overflow-hidden h-10">
          <button
            className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors cursor-pointer ${
              mode === "point_to_point"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            <FiMapPin className="text-sm" />
            TRANSFER
          </button>
          <button
            className={`px-4 py-2 text-sm flex items-center gap-2 transition-colors cursor-pointer ${
              mode === "hourly"
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            <FiClock className="text-sm" />
            HOURLY
          </button>
        </div>
      </div>

      {/* Hourly Trip Duration */}
      {mode === "hourly" && (
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium">Trip Duration</p>
          <div className="grid grid-cols-2 gap-4">
            <Counter
              label="Hours"
              value={hours}
              onIncrement={() =>
                setFormData((p: any) => ({ ...p, hours: p.hours + 1 }))
              }
              onDecrement={() =>
                setFormData((p: any) => ({
                  ...p,
                  hours: Math.max(1, p.hours - 1),
                }))
              }
            />
            <Counter
              label="Minutes"
              value={minutes}
              onIncrement={() =>
                setFormData((p: any) => ({
                  ...p,
                  minutes: Math.min(59, p.minutes + 15),
                }))
              }
              onDecrement={() =>
                setFormData((p: any) => ({
                  ...p,
                  minutes: Math.max(0, p.minutes - 15),
                }))
              }
            />
          </div>
        </div>
      )}

      {/* Date & Time */}
      <div className="mb-6">
        <DateTimePicker
          date={pickupDate}
          time={pickupTime}
          onDateChange={(date) =>
            setFormData((p: any) => ({ ...p, pickupDate: date }))
          }
          onTimeChange={(time) =>
            setFormData((p: any) => ({ ...p, pickupTime: time }))
          }
        />
      </div>

      {/* Trip Route */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4 space-y-2">
        <p className="mb-3 text-sm font-medium text-gray-600">TRIP ROUTE</p>

        <PickupAndDropOff
          pickup_address={pickup_address}
          dropoff_address={dropoff_address}
          extraStops={extraStops} // ✅ data
          setExtraStops={(
            updater, // ✅ VERY IMPORTANT
          ) =>
            updateFormData((prev: any) => ({
              ...prev,
              extraStops:
                typeof updater === "function"
                  ? updater(prev.extraStops)
                  : updater,
            }))
          }
          onPickupChange={(v) =>
            setFormData((p: any) => ({ ...p, pickup_address: v }))
          }
          onDropoffChange={(v) =>
            setFormData((p: any) => ({ ...p, dropoff_address: v }))
          }
        />
      </div>

      {/* Passengers */}
      <div className="mb-6 grid grid-cols-3 gap-4 text-sm">
        {(mode === "point_to_point"
          ? [
              { label: "Passengers", key: "passengers" as PassengerKey },
              { label: "Kids", key: "child_seats" as PassengerKey },
              { label: "Bags", key: "bags" as PassengerKey },
            ]
          : [
              { label: "Passengers", key: "passengers" as PassengerKey },
              { label: "Kids", key: "child_seats" as PassengerKey },
              { label: "Bags", key: "bags" as PassengerKey },
            ]
        ).map((item) => (
          <Counter
            key={item.key}
            label={item.label}
            value={passengers[item.key]}
            onIncrement={() => updatePassenger(item.key, 1)}
            onDecrement={() => updatePassenger(item.key, -1)}
          />
        ))}
      </div>

      <div className="mb-6">
        <DistanceDisplay
          distance={formData.distance}
          duration={formData.duration}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => router.back()}
          variant={"outline"}
          className="cursor-pointer"
        >
          <IoChevronBack /> Back
        </Button>
      </div>
    </div>
  );
};

export default PriceQuoteForm;
