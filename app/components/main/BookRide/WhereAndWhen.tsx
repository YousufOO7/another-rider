/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DateTimePicker from "@/app/utils/helper/DateTimePicker";
import PickupAndDropOff from "@/app/utils/helper/PickupAndDropOff";
import { Button } from "@/components/ui/button";
import { FiPlus, FiMinus, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HourlyForm from "./HourlyForm";
import { getDistanceData } from "@/app/utils/storage";
import { useCallback, useEffect, useState } from "react";
import { usePlacesAutocomplete } from "@/app/hooks/usePlacesAutocomplete";
import DistanceDisplay from "@/app/utils/helper/DistanceDisplay";
import { useDistanceCalculator } from "@/app/utils/helper/useDistanceCalculator";
import toast from "react-hot-toast";
import AirportForm from "./AirportForm";

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
}: Props) => {
  //  const totalPassengers = (passengers?.passengers || 0) + (passengers?.child_seats || 0);
  // const totalLuggage = passengers?.bags || 0;

  // const updatePassenger = (key: PassengerKey, value: number) => {
  //   setFormData((prev: { passengers: { [x: string]: number } }) => ({
  //     ...prev,
  //     passengers: {
  //       ...prev.passengers,
  //       [key]: Math.max(0, prev.passengers[key] + value),
  //     },
  //   }));
  // };

  // ✅ Update formData when passengers change
  // useEffect(() => {
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     totalPassengers: totalPassengers,
  //     totalLuggage: totalLuggage,
  //   }));
  // }, [totalPassengers, totalLuggage]);

  const updatePassenger = (key: PassengerKey, value: number) => {
    setFormData((prev: any) => {
      const newPassengers = {
        ...prev.passengers,
        [key]: Math.max(0, (prev.passengers?.[key] || 0) + value),
      };

      console.log("🔍 updatePassenger:", {
        key,
        value,
        before: prev.passengers,
        after: newPassengers,
      });

      const total =
        (newPassengers.passengers || 0) + (newPassengers.child_seats || 0);
      return {
        ...prev,
        passengers: newPassengers,
        totalPassengers: total,
        totalLuggage: newPassengers.bags || 0,
      };
    });
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
    },
  );

  const savedDistance = getDistanceData();

  const { distance, loading, calculateDistance } =
    useDistanceCalculator(savedDistance);

  useEffect(() => {
    if (pickup_address && dropoff_address) {
      calculateDistance(pickup_address, dropoff_address);
    }
  }, [pickup_address, dropoff_address, calculateDistance]);

  // Calculate distance when pickup or dropoff changes
  useEffect(() => {
    if (
      pickup_address &&
      dropoff_address &&
      pickup_address !== dropoff_address
    ) {
      calculateDistance(pickup_address, dropoff_address);
    }
  }, [pickup_address, dropoff_address, calculateDistance]);

  console.log("pickup_address:", pickup_address);
  console.log("dropoff_address:", dropoff_address);
  console.log("distance:", distance);

  // Save distance to formData when available
  // useEffect(() => {
  //   if (distance) {
  //     setFormData((prev: any) => ({
  //       ...prev,
  //       distance: distance.distance,
  //       distanceValue: distance.distanceValue,
  //       duration: distance.duration,
  //       durationValue: distance.durationValue,
  //     }));
  //   }
  // }, [distance, setFormData]);

  useEffect(() => {
    if (distance) {
      const distanceKm = distance.distanceValue
        ? Number((distance.distanceValue / 1000).toFixed(1))
        : 0;

      setFormData((prev: any) => ({
        ...prev,
        distance: distance.distance,
        distanceValue: distance.distanceValue,
        distance_km: distanceKm, // ✅ payload এর জন্য
        duration: distance.duration,
        durationValue: distance.durationValue,
      }));
    }
  }, [distance, setFormData]);

  // Calculate total distance with extra stops
  const calculateTotalDistance = useCallback(async () => {
    if (!pickup_address || !dropoff_address) return null;

    const allLocations = [
      pickup_address,
      ...extraStops.map((s: { location: any }) => s.location),
      dropoff_address,
    ];
    let totalDistance = 0;
    let totalDuration = 0;

    // Create distance matrix service instance
    const { google } = window as any;
    if (!google?.maps?.DistanceMatrixService) {
      console.error("Google Maps DistanceMatrixService not available");
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
              },
            );
          });

          if (
            result.status === "OK" &&
            result.response?.rows[0]?.elements[0]?.status === "OK"
          ) {
            const element = result.response.rows[0].elements[0];
            totalDistance += element.distance.value;
            totalDuration += element.duration.value;
          }
        } catch (err) {
          console.error("Error calculating leg distance:", err);
        }
      }
    }

    // Convert total distance to kilometers
    const distanceInKm = (totalDistance / 1000).toFixed(1);
    const durationInHours = Math.floor(totalDuration / 3600);
    const durationInMinutes = Math.round((totalDuration % 3600) / 60);

    return {
      totalDistance: `${distanceInKm} km`,
      totalDuration: `${durationInHours > 0 ? `${durationInHours}h ` : ""}${durationInMinutes}m`,
      totalDistanceValue: totalDistance,
      totalDurationValue: totalDuration,
      distance_km: Number(distanceInKm),
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

  //   const handleSelectVehicle = () => {
  //   if (!formData?.pickup_address) {
  //     toast.error("Pickup address is required");
  //     return;
  //   }

  //   if (!formData?.dropoff_address) {
  //     toast.error("Dropoff address is required");
  //     return;
  //   }

  //    const total = (formData?.passengers?.passengers || 0) + (formData?.passengers?.child_seats || 0);

  //     if (total <= 0) {
  //       toast.error("Please select at least 1 passenger and 1 kid");
  //       return;
  //     }

  //     // ✅ Save total to formData
  //     setFormData((prev: any) => ({
  //       ...prev,
  //       totalPassengers: total,
  //       totalLuggage: formData?.passengers?.bags || 0,
  //     }));

  //   onNext();
  // };

  const handleSelectVehicle = async () => {
    if (!formData?.pickup_address) {
      toast.error("Pickup address is required");
      return;
    }

    if (!formData?.dropoff_address) {
      toast.error("Dropoff address is required");
      return;
    }

    const passengers = formData?.passengers?.passengers || 0;
    const children = formData?.passengers?.child_seats || 0;
    const bags = formData?.passengers?.bags || 0;
    const total = passengers + children;

    if (total <= 0) {
      toast.error("Please select at least 1 passenger");
      return;
    }

    let distanceKm = formData?.distance_km || 0;
    let distanceValue = (formData as any)?.distanceValue || 0;

    // ✅ distance না থাকলে calculate
    if (!distanceKm) {
      try {
        const result = await calculateDistance(
          formData.pickup_address,
          formData.dropoff_address,
        );

        distanceValue =
          (result as any)?.distanceValue ?? (distance as any)?.distanceValue;

        distanceKm = distanceValue
          ? Number((distanceValue / 1000).toFixed(1))
          : 0;

        if (!distanceKm) {
          toast.error("Distance calculate করা যায়নি, আবার চেষ্টা করুন");
          return;
        }
      } catch (err) {
        console.error("Distance calc failed:", err);
        toast.error("Distance calculate করা যায়নি");
        return;
      }
    }

    // ✅ একবারেই সব set করুন
    setFormData((prev: any) => ({
      ...prev,
      passengers: {
        passengers: passengers + children,
        child_seats: children,
        bags: bags,
      },
      totalPassengers: total,
      totalLuggage: bags,
      distance_km: distanceKm,
      distanceValue: distanceValue,
    }));

    onNext();
  };

  return (
    <div>
      <div className="rounded-xl bg-white p-4 md:p-8 shadow-sm border">
        {/* Header */}
        <div className="mb-6 sm:flex-col md:flex-row">
          <h2 className="text-lg font-semibold tracking-wide mb-3">WHERE & WHEN</h2>

          {/* Mode Dropdown */}
          <Select
            value={mode}
            onValueChange={(value) =>
              setFormData((prev: any) => ({
                ...prev,
                mode: value,
              }))
            }
          >
            <SelectTrigger
              className="
      h-10 w-full md:w-auto
      rounded-2xl border
      px-4 text-xs md:text-sm font-medium
      cursor-pointer
      bg-black text-white
      data-[state=open]:ring-2 data-[state=open]:ring-black/10
      [&>svg]:text-white
    "
            >
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>

            <SelectContent
              position="popper"
              side="bottom"
              align="end"
              sideOffset={4}
              avoidCollisions={false}
              sticky="always"
              hideWhenDetached={false}
              className="rounded-xl"
            >
              <SelectItem
                value="point_to_point"
                className="
        cursor-pointer rounded-lg
        data-highlighted:bg-black data-highlighted:text-white
        data-[state=checked]:bg-black data-[state=checked]:text-white
        data-[state=checked]:font-semibold
      "
              >
                <div className="flex items-center gap-2">
                  <FiMapPin /> TRANSFER
                </div>
              </SelectItem>

              <SelectItem
                value="hourly"
                className="
        cursor-pointer rounded-lg
        data-highlighted:bg-black data-highlighted:text-white
        data-[state=checked]:bg-black data-[state=checked]:text-white
        data-[state=checked]:font-semibold
      "
              >
                <div className="flex items-center gap-2">
                  <FiClock /> HOURLY
                </div>
              </SelectItem>

              <SelectItem
                value="airport"
                className="
        cursor-pointer rounded-lg
        data-highlighted:bg-black data-highlighted:text-white
        data-[state=checked]:bg-black data-[state=checked]:text-white
        data-[state=checked]:font-semibold
      "
              >
                <div className="flex items-center gap-2">
                  <FiSend /> AIRPORT
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
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
                  calculateTotalDistance().then((total) => {
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

        {/* airport component */}
        {mode === "airport" && (
          <>
            <AirportForm
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
