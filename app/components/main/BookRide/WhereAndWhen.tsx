/* eslint-disable react-hooks/preserve-manual-memoization */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateTimePicker from "@/app/utils/helper/DateTimePicker";
import PickupAndDropOff from "@/app/utils/helper/PickupAndDropOff";
import { Button } from "@/components/ui/button";
import { FiPlus, FiMinus, FiMapPin, FiClock } from "react-icons/fi";
import HourlyForm from "./HourlyForm";
import Link from "next/link";
import { getDistanceData, setQuoteData } from "@/app/utils/storage";
import { useCallback, useEffect, useState } from "react";
import { usePlacesAutocomplete } from "@/app/hooks/usePlacesAutocomplete";
import DistanceDisplay from "@/app/utils/helper/DistanceDisplay";
import { useDistanceCalculator } from "@/app/utils/helper/useDistanceCalculator";
import toast from "react-hot-toast";

type PassengerKey = "passengers" | "child_seats" | "bags";

type Props = {
  onNext: () => void;
  formData: any;
  pickupDate: Date | undefined;
  pickupTime: string;
  pickup_address: string;
  dropoff_address: string;
  passengers: {
    passengers: number;
    child_seats: number;
    bags: number;
  };
   onShowPriceWhereAndWhen?: () => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
};

const WhereAndWhen = ({
  formData,
  onNext,
  pickup_address,
  dropoff_address,
  passengers,
  setFormData,
  pickupDate,
  pickupTime,
   onShowPriceWhereAndWhen,
}: Props) => {
  
  const updatePassenger = (key: PassengerKey, value: number) => {
    setFormData((prev: { passengers: { [x: string]: number } }) => ({
      ...prev,
      passengers: {
        ...prev.passengers,
        [key]: Math.max(0, prev.passengers[key] + value),
      },
    }));
  };

  const [draftStop, setDraftStop] = useState<{
    type: "pickup" | "dropoff";
    location: string;
  } | null>(null);

  // helper function to add stop to parent state


  const mode = formData.mode ?? "point_to_point";
  const extraStops = formData.extraStops || [];

  const draftInputRef = usePlacesAutocomplete(
  draftStop?.location || "",
  (address) => {
    setDraftStop((p) => (p ? { ...p, location: address } : p));
  }
);

const savedDistance = getDistanceData();

const { distance, loading, calculateDistance } = useDistanceCalculator(savedDistance);

useEffect(() => {
  if (pickup_address && dropoff_address) {
    calculateDistance(pickup_address, dropoff_address);
  }
}, [pickup_address, dropoff_address, calculateDistance]);




  // Calculate distance when pickup or dropoff changes
  // useEffect(() => {
  //   if (pickup_address && dropoff_address && pickup_address !== dropoff_address) {
  //     calculateDistance(pickup_address, dropoff_address);
  //   }
  // }, [pickup_address, dropoff_address, calculateDistance]);

  // console.log("pickup_address:", pickup_address);
  // console.log("dropoff_address:", dropoff_address);
  // console.log("distance:", distance);

  // Save distance to formData when available
  useEffect(() => {
    if (distance) {
      setFormData((prev: any) => ({
        ...prev,
        distance: distance.distance,
        distanceValue: distance.distanceValue,
        duration: distance.duration,
        durationValue: distance.durationValue,
      }));
    }
  }, [distance, setFormData]);

  // Calculate total distance with extra stops
  const calculateTotalDistance = useCallback(async () => {
    if (!pickup_address || !dropoff_address) return null;

    const allLocations = [pickup_address, ...extraStops.map((s: { location: any; }) => s.location), dropoff_address];
    let totalDistance = 0;
    let totalDuration = 0;

    // Create distance matrix service instance
    const { google } = window as any;
    if (!google?.maps?.DistanceMatrixService) {
      console.error('Google Maps DistanceMatrixService not available');
      return null;
    }

    // Calculate distances between consecutive locations
    for (let i = 0; i < allLocations.length - 1; i++) {
      const origin = allLocations[i];
      const destination = allLocations[i + 1];
      
      if (origin && destination) {
        try {
          const result = await new Promise<any>((resolve) => {
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
              {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
              },
              (response: any, status: string) => {
                resolve({ response, status });
              }
            );
          });

          if (result.status === 'OK' && 
              result.response?.rows[0]?.elements[0]?.status === 'OK') {
            const element = result.response.rows[0].elements[0];
            totalDistance += element.distance.value;
            totalDuration += element.duration.value;
          }
        } catch (err) {
          console.error('Error calculating leg distance:', err);
        }
      }
    }

    // Convert total distance to kilometers
    const distanceInKm = (totalDistance / 1000).toFixed(1);
    const durationInHours = Math.floor(totalDuration / 3600);
    const durationInMinutes = Math.round((totalDuration % 3600) / 60);

    return {
      totalDistance: `${distanceInKm} km`,
      totalDuration: `${durationInHours > 0 ? `${durationInHours}h ` : ''}${durationInMinutes}m`,
      totalDistanceValue: totalDistance,
      totalDurationValue: totalDuration,
    };
  }, [pickup_address, dropoff_address, extraStops]);

 
 // Extra stops add করার সময় distance update করুন
  const addExtraStop = async (stop: {
    type: "pickup" | "dropoff";
    location: string;
  }) => {
    setFormData((prev: any) => ({
      ...prev,
      extraStops: [...(prev.extraStops || []), stop],
    }));

    // Calculate total distance with new stop
    const total = await calculateTotalDistance();
    if (total) {
      setFormData((prev: any) => ({
        ...prev,
        ...total,
      }));
    }

    setDraftStop(null);
  };


  const handleSelectVehicle = () => {
  if (!formData?.pickup_address) {
    toast.error("Pickup address is required");
    return;
  }

  if (!formData?.dropoff_address) {
    toast.error("Dropoff address is required");
    return;
  }

  if (!formData?.passengers?.passengers || formData?.passengers.passengers <= 0) {
    toast.error("Please select number of passengers");
    return;
  }

  onNext();
};

   const handleSeePriceQuote = () => {
    const hasPickup = formData?.pickup_address?.trim();
    const hasDropoff = formData?.dropoff_address?.trim();
    const hasPassengers = passengers?.passengers > 0;

    // প্রথমে passenger সংখ্যা চেক করুন
    if (!hasPassengers) {
      toast.error("Please select at least 1 passenger");
      return;
    }

    // তারপর pickup এবং dropoff চেক করুন
    if (!hasPickup) {
      toast.error("Please add pickup location first");
      return;
    }

    if (!hasDropoff) {
      toast.error("Please add dropoff location first");
      return;
    }

    if (hasPickup && hasDropoff && hasPassengers) {
      // যদি pickup এবং dropoff উভয়ই থাকে, তাহলে ডাটা স্টোরে সেভ করে PriceBookingForm-এর next step এ যান
      const transferData = {
        ...formData,
        mode,
        passengers: {
          passengers: passengers.passengers,
          child_seats: passengers.child_seats,
          bags: passengers.bags,
        },
      };
      setQuoteData(transferData);
      onNext(); //  সরাসরি SelectVehicle এ যাবে (যেটা PriceBookingForm-এর step 2)
    } else {
      // যদি কোনোটি ফাঁকা থাকে, তাহলে PriceWhereAndWhen কম্পোনেন্ট দেখান
      if (onShowPriceWhereAndWhen) {
        onShowPriceWhereAndWhen(); //  PriceWhereAndWhen দেখাবে
      } else {
        toast.error("Please add pickup and dropoff locations first");
      }
    }
  };


  return (
    <div>
      <div className="rounded-xl bg-white p-4 md:p-8 shadow-sm border">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-lg font-semibold tracking-wide">WHERE & WHEN</h2>

          <div className="flex h-10 w-full overflow-hidden md:rounded-2xl border md:w-auto">
            {/* TRANSFER */}
            <button
              onClick={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  mode: "point_to_point",
                }))
              }
              className={`flex w-1/2 justify-center items-center gap-2 px-2 py-2 text-xs transition-colors cursor-pointer md:w-auto md:px-4 md:text-sm
      ${
        mode === "point_to_point"
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-gray-200"
      }`}
            >
              <FiMapPin className="text-xs md:text-sm" />
              TRANSFER
            </button>

            {/* HOURLY */}
            <button
              onClick={() =>
                setFormData((prev: any) => ({
                  ...prev,
                  mode: "hourly",
                }))
              }
              className={`flex w-1/2 justify-center items-center gap-2 px-2 py-2 text-xs transition-colors cursor-pointer md:w-auto md:px-4 md:text-sm
      ${
        mode === "hourly"
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-gray-200"
      }`}
            >
              <FiClock className="text-xs md:text-sm" />
              HOURLY
            </button>
          </div>
        </div>
        {mode === "point_to_point" && (
          <>
            {/* Date & Time */}

            <DateTimePicker
              date={pickupDate}
              time={pickupTime}
              onDateChange={(date) =>
                setFormData((prev: any) => ({
                  ...prev,
                  pickupDate: date,
                }))
              }
              onTimeChange={(time) =>
                setFormData((prev: any) => ({
                  ...prev,
                  pickupTime: time,
                }))
              }
            />

            {/* Pickup & Dropoff */}
            <div className="space-y-4 mb-4">
              <PickupAndDropOff
                extraStops={extraStops}
                pickup_address={pickup_address}
                dropoff_address={dropoff_address}
                
                 setExtraStops={(stops) => {
              setFormData((prev: any) => ({
                ...prev,
                extraStops:
                  typeof stops === "function"
                    ? stops(prev.extraStops || [])
                    : stops,
              }));
              
              // Recalculate distance when stops change
              calculateTotalDistance().then(total => {
                if (total) {
                  setFormData((prev: any) => ({
                    ...prev,
                    ...total,
                  }));
                }
              });
            }}
                onPickupChange={(v) =>
                  setFormData((prev: any) => ({ ...prev, pickup_address: v }))
                }
                onDropoffChange={(v) =>
                  setFormData((prev: any) => ({ ...prev, dropoff_address: v }))
                }
              />
            </div>

            <button
              onClick={() => setDraftStop({ type: "pickup", location: "" })}
              className="mt-2 text-xs font-semibold border-b border-black cursor-pointer hover:text-gray-700"
            >
              + ADD STOP
            </button>


            {/* Add an Extra Stop */}
            {draftStop && (
              <div className="rounded-xl border bg-gray-50 p-4">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">ADD AN EXTRA STOP</p>
                    <p className="text-xs text-gray-500">
                      Include an additional pickup or dropoff in your hourly
                      ride.
                    </p>
                  </div>

                  <button
                    onClick={() => setDraftStop(null)}
                    className="text-xs font-semibold text-gray-400 hidden md:block"
                  >
                    CLEAR
                  </button>
                </div>

                {/* Toggle */}
                <div className="mb-3 flex gap-2">
                  <button
                    onClick={() =>
                      setDraftStop((p) => p && { ...p, type: "pickup" })
                    }
                    className={`rounded-full px-4 py-1.5 text-xs ${
                      draftStop.type === "pickup"
                        ? "bg-black text-white"
                        : "border bg-white"
                    }`}
                  >
                    Pickup stop
                  </button>

                  <button
                    onClick={() =>
                      setDraftStop((p) => p && { ...p, type: "dropoff" })
                    }
                    className={`rounded-full px-4 py-1.5 text-xs ${
                      draftStop.type === "dropoff"
                        ? "bg-black text-white"
                        : "border bg-white"
                    }`}
                  >
                    Dropoff stop
                  </button>
                </div>

                {/* Input */}
                <input
                  ref={draftInputRef}
                  value={draftStop.location}
                  onChange={(e) =>
                    setDraftStop((p) => p && { ...p, location: e.target.value })
                  }
                  placeholder="Search address, hotel or place"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                />

                {/* Footer */}
                <div className="mt-3 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDraftStop(null)}
                  >
                    Cancel
                  </Button>

                  <Button
                    size="sm"
                    className="bg-black text-white"
                    onClick={() => {
                      if (!draftStop.location) return;

                      addExtraStop(draftStop);
                      setDraftStop(null);
                    }}
                  >
                    Add stop
                  </Button>
                </div>
              </div>
            )}

            {/* Travellers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-8 text-sm mt-2">
              {[
                { label: "Passengers", key: "passengers" as const },
                { label: "Kids", key: "child_seats" as const },
                { label: "Bags", key: "bags" as const },
              ].map((item) => (
                <div key={item.label}>
                  <p className="mb-1 text-gray-500">{item.label}</p>
                  <div className="flex items-center justify-between rounded-md border px-3 py-2">
                    <Button
                      variant={"outline"}
                      onClick={() => updatePassenger(item.key, -1)}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      <FiMinus />
                    </Button>

                    <span className="font-medium">{passengers[item.key]}</span>

                    <Button
                      variant={"outline"}
                      onClick={() => updatePassenger(item.key, 1)}
                      className="text-gray-500 hover:text-black cursor-pointer"
                    >
                      <FiPlus />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6">
               <DistanceDisplay
            distance={distance?.distance || formData.distance}
            duration={distance?.duration || formData.duration}
            loading={loading}
          />
            </div>

            {/* CTA */}
            <div className="md:flex gap-5  md:justify-end">
             {/* <Button
                onClick={handleSeePriceQuote}
                className="w-full md:w-32 mb-2 md:mb-0 cursor-pointer"
              >
                See Price Quote
              </Button> */}
              <Button
                className="w-full md:w-32 cursor-pointer"
                onClick={handleSelectVehicle}
              >
                Select Vehicle
              </Button>
            </div>
          </>
        )}
        {/* hourly component */}
        {mode === "hourly" && (
          <>
            <HourlyForm
              formData={formData}
              setFormData={setFormData}
              onNext={onNext}
              pickup_address={pickup_address}
              dropoff_address={dropoff_address}
              // passengers={passengers}
              // pickupDate={pickupDate}
              // pickupTime={pickupTime}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default WhereAndWhen;
