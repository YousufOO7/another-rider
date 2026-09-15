/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiMinus, FiPlus } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/app/utils/helper/DateTimePicker";
import PickupAndDropOff from "@/app/utils/helper/PickupAndDropOff";
import { useCallback, useEffect, useState } from "react";
import { setQuoteData } from "@/app/utils/storage";
import { usePlacesAutocomplete } from "@/app/hooks/usePlacesAutocomplete";
import DistanceDisplay from "@/app/utils/helper/DistanceDisplay";
import { useDistanceCalculator } from "@/app/utils/helper/useDistanceCalculator";
import toast from "react-hot-toast";

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
}) => {
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <div className="flex items-center justify-between rounded-md border px-3 py-2">
        <button onClick={onDecrement} className="text-gray-500">
          <FiMinus />
        </button>
        <span className="text-sm font-medium">{value}</span>
        <button onClick={onIncrement} className="text-gray-500">
          <FiPlus />
        </button>
      </div>
    </div>
  );
};

const AirportForm = ({
  onNext,
  formData,
  setFormData,
  pickup_address,
  dropoff_address,
}: {
  onNext: () => void;
  formData: any;
  setFormData: any;
  pickup_address: string;
  dropoff_address: string;
}) => {
  const [draftStop, setDraftStop] = useState<{
    type: "pickup" | "dropoff";
    location: string;
  } | null>(null);

  // helper function to add stop to parent state
  // const addExtraStop = (stop: {
  //   type: "pickup" | "dropoff";
  //   location: string;
  // }) => {
  //   setFormData((prev: any) => ({
  //     ...prev,
  //     extraStops: [...(prev.extraStops || []), stop],
  //   }));
  //   setDraftStop(null);
  // };

  const handleSeePriceQuote = () => {
    setQuoteData(formData);
  };

  const extraStops = formData.extraStops || [];

    const draftInputRef = usePlacesAutocomplete(
  draftStop?.location || "",
  (address) => {
    setDraftStop((p) => (p ? { ...p, location: address } : p));
  }
);

   const { distance, loading, calculateDistance } = useDistanceCalculator();
  
    // Calculate distance when pickup or dropoff changes
    useEffect(() => {
      if (pickup_address && dropoff_address && pickup_address !== dropoff_address) {
        calculateDistance(pickup_address, dropoff_address);
      }
    }, [pickup_address, dropoff_address, calculateDistance]);
  
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

  const handleSelectVehicle = async () => {
  if (!formData?.hours || formData.hours <= 0) {
    toast.error("Please select number of hours");
    return;
  }
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
          formData.dropoff_address
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

  // ✅ Sob thik thakle
  onNext();
};



  return (
    <div className="space-y-8">
      {/* Date & Time */}
      <div>
        <p className="mb-3 text-sm font-medium">Pickup Date & Time</p>
        <DateTimePicker
          date={formData.pickupDate}
          time={formData.pickupTime}
          onDateChange={(date) =>
            setFormData((p: any) => ({ ...p, pickupDate: date }))
          }
          onTimeChange={(time) =>
            setFormData((p: any) => ({ ...p, pickupTime: time }))
          }
        />
      </div>

      {/* Pickup & Dropoff */}
      <div>
        <PickupAndDropOff
          extraStops={extraStops}
          pickup_address={formData.pickup_address}
          dropoff_address={formData.dropoff_address}
          setExtraStops={(stops) =>
            setFormData((prev: any) => ({
              ...prev,
              extraStops:
                typeof stops === "function"
                  ? stops(prev.extraStops || [])
                  : stops,
            }))
          }
          onPickupChange={(v) =>
            setFormData((p: any) => ({ ...p, pickup_address: v }))
          }
          onDropoffChange={(v) =>
            setFormData((p: any) => ({ ...p, dropoff_address: v }))
          }
        />

        <button
          onClick={() => setDraftStop({ type: "pickup", location: "" })}
          className="mt-2 text-xs font-semibold border-b border-black cursor-pointer hover:text-gray-700"
        >
          + ADD STOP
        </button>
      </div>

      {/* Add an Extra Stop */}
      {draftStop && (
        <div className="rounded-xl border bg-gray-50 p-4">
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">ADD AN EXTRA STOP</p>
              <p className="text-xs text-gray-500">
                Include an additional pickup or dropoff in your hourly ride.
              </p>
            </div>

            <button
              onClick={() => setDraftStop(null)}
              className="text-xs font-semibold text-gray-400"
            >
              CLEAR
            </button>
          </div>

          {/* Toggle */}
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setDraftStop((p) => p && { ...p, type: "pickup" })}
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

      {/* Passengers */}
      <div>
        <p className="mb-3 text-sm font-medium">Passengers</p>

        <div className="grid grid-cols-3 gap-4">
          <Counter
            label="Passengers"
            value={formData.passengers?.passengers || 0}
            onIncrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  passengers: (p.passengers?.passengers || 0) + 1,
                },
              }))
            }
            onDecrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  passengers: Math.max(0, (p.passengers?.passengers || 0) - 1),
                },
              }))
            }
          />

          <Counter
            label="Kids"
            value={formData.passengers?.child_seats || 0}
            onIncrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  child_seats: (p.passengers?.child_seats || 0) + 1,
                },
              }))
            }
            onDecrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  child_seats: Math.max(
                    0,
                    (p.passengers?.child_seats || 0) - 1,
                  ),
                },
              }))
            }
          />

          <Counter
            label="Bags"
            value={formData.passengers?.bags || 0}
            onIncrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  bags: (p.passengers?.bags || 0) + 1,
                },
              }))
            }
            onDecrement={() =>
              setFormData((p: any) => ({
                ...p,
                passengers: {
                  ...p.passengers,
                  bags: Math.max(0, (p.passengers?.bags || 0) - 1),
                },
              }))
            }
          />
        </div>
      </div>

       <div>
               <DistanceDisplay
            distance={distance?.distance || formData.distance}
            duration={distance?.duration || formData.duration}
            loading={loading}
          />
          </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        {/* <Link href={"/price-quote"}>
          <Button variant={"outline"} className="cursor-pointer" onClick={handleSeePriceQuote}>
            See Quote Price
          </Button>
        </Link> */}
        <Button className="bg-black text-white cursor-pointer" onClick={handleSelectVehicle}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default AirportForm;