/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCreateBookingsMutation } from "@/app/redux/features/bookings/bookingsApi";
import { Vehicle } from "@/app/types/Vehicle";
import BackButton from "@/app/utils/common/BackButton";
import ButtonLoader from "@/app/utils/common/ButtonLoader";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/ui/VehicleCart";
import { useEffect, useState } from "react";
import SelectVehiclePriceBreakdown from "./SelectVehiclePriceBreakdown";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
}

const SelectVehicle = ({ onNext, onBack, formData, setFormData }: Props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [createBooking] = useCreateBookingsMutation({});
  const [loading, setLoading] = useState<boolean>(false);

  const buildPayload = (includeVehicleId = false) => {
    const pickupDateTime = formData.pickupDate
      ? `${formData.pickupDate.getFullYear()}-${String(
          formData.pickupDate.getMonth() + 1,
        ).padStart(2, "0")}-${String(formData.pickupDate.getDate()).padStart(
          2,
          "0",
        )} ${formData.pickupTime}`
      : null;

    const totalHours =
      Number(formData.hours || 0) + Number(formData.minutes || 0) / 60;

    return {
      service_type: formData.mode,
      pickup_time: pickupDateTime,
      pickup_address: formData.pickup_address,
      dropoff_address: formData.dropoff_address,
      passengers: formData.passengers.passengers,
      distance_km: formData.distanceValue / 1000,
      child_seats: formData.passengers.child_seats || 0,
      airport_id: formData.airport_id || null,
      bags: formData.passengers.bags || 0,
      hours: totalHours,
      stops: (formData.extraStops || []).map((stop: any) => ({
      address: stop.location,
    })),
      ...(includeVehicleId && {
        vehicle_class_id: formData.vehicle?.vehicle_class_id,
      }),
    };
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);

      const payload = buildPayload(false);
      try {
        const res = await createBooking(payload).unwrap();
        setVehicles(res?.data?.vehicle_class_options || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
      }
    };
    fetchVehicles();
  }, [
    formData.pickupDate,
    formData.pickupTime,
    formData.pickup_address,
    formData.dropoff_address,
    formData.passengers,
    formData.distanceValue,
    formData.hours,
    formData.minutes,
    formData.mode,
  ]);

  const totalPassengers = formData.totalPassengers || 0;
  const totalLuggage = formData.totalLuggage || 0;
  const selectedVehicle = formData?.vehicle;

  
 

  const handleNext = async () => {
    if (!formData.vehicle) return;

    onNext();
  };

  return (
    <div className="mb-20">
      {/* Back */}
      <BackButton onClick={onBack} text="Back to where & when" />

      {/* Title */}
      <h2 className="text-xl font-semibold">Select your vehicle</h2>
      <p className="text-sm text-gray-500 mb-6">
        Choose the fleet that best fits your group and luggage.
      </p>

      <div className="bg-white rounded-lg shadow">
        {/* Header row */}
        <div className="grid grid-cols-12 p-2 md:p-6 text-xs md:text-sm text-gray-400 bg-gray-50 border-b pb-2 mb-2">
          <div className="col-span-5">Vehicle</div>
          <div className="col-span-4">Capacity</div>
          <div className="col-span-3">Starting from</div>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-sm justify-center flex py-4">
            <ButtonLoader />
          </p>
        )}

        {/* Vehicle list */}
        <div className="space-y-2 p-2 md:p-6">
          {vehicles?.map((vehicle: any) => (
            <VehicleCard
              key={vehicle?.vehicle_id}
              vehicle={{
                ...vehicle,
                passengers: totalPassengers,
                luggage: totalLuggage,
                service_type: formData?.mode,
              }}
              selected={
                formData.vehicle?.vehicle_class_id === vehicle.vehicle_class_id
              }
              onSelect={() =>
                setFormData((prev: any) => ({ ...prev, vehicle }))
              }
            />
          ))}
        </div>

               {/* ✅ Price Breakdown component */}
        {selectedVehicle && (
          <SelectVehiclePriceBreakdown vehicle={selectedVehicle} />
        )}

        {/* Next button */}
        <div className="flex justify-end  pb-5 p-2 md:p-6">
          <Button
            disabled={!formData.vehicle}
            onClick={handleNext}
            className={`px-5 py-2 rounded-md text-sm font-medium cursor-pointer
            ${
              formData.vehicle
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Next: Passenger info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectVehicle;
