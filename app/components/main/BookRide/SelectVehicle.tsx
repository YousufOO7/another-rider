/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCreateBookingsMutation } from "@/app/redux/features/bookings/bookingsApi";
import { useGetAllVehiclesQuery } from "@/app/redux/features/vehicles/vehiclesApi";
import BackButton from "@/app/utils/common/BackButton";
import ButtonLoader from "@/app/utils/common/ButtonLoader";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/ui/VehicleCart";
import { useState } from "react";
import toast from "react-hot-toast";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  onBack: () => void;
}

const SelectVehicle = ({ onNext, onBack, formData, setFormData }: Props) => {
  const [createBooking] = useCreateBookingsMutation({});
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
    const {
    data: vehiclesData,
  } = useGetAllVehiclesQuery({});
  const vehicles = vehiclesData?.data || [];
  console.log(vehicles)
  
  const buildPayload = (includeVehicleId = false) => {
  const pickupDateTime = formData.pickupDate
    ? `${formData.pickupDate.getFullYear()}-${String(
        formData.pickupDate.getMonth() + 1
      ).padStart(2, "0")}-${String(
        formData.pickupDate.getDate()
      ).padStart(2, "0")} ${formData.pickupTime}`
    : null;

  const totalHours =
    Number(formData.hours || 0) +
    Number(formData.minutes || 0) / 60;

  return {
    service_type: formData.mode,
    pickup_time: pickupDateTime,
    pickup_address: formData.pickup_address,
    dropoff_address: formData.dropoff_address,
    passengers: formData.passengers.passengers,
    distance_km: formData.distanceValue / 1000,
    child_seats: formData.passengers.kids || 0,
    hours: totalHours,
    ...(includeVehicleId && {
      vehicle_id: formData.vehicle?.id,
    }),
  };
};


    const handleNext = async () => {
    if (!formData.vehicle) {
      toast.error("Please select a vehicle first");
      return;
    }

    // Create the booking with the selected vehicle ID
    try {
      setLoading(true);
      setError(null); 
      const payload = buildPayload(true);
      const res = await createBooking(payload).unwrap();
      console.log("Booking created:", res);
      
      // Store the booking ID
      if (res?.data?.id) {
        setFormData((prev: any) => ({ 
          ...prev, 
          bookingId: res.data.id 
        }));
      }
      
      toast.success("Vehicle booked successfully!");
      setLoading(false);
      onNext();
    } catch (err: any) {
      console.error("Error creating booking:", err);
      
      let errorMessage = "Failed to book vehicle. Please try again.";
      
      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.data?.errors?.[0]?.msg) {
        errorMessage = err.data.errors[0].msg;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      if (errorMessage.includes("not available")) {
        errorMessage = "Selected vehicle is not available for the requested time. Please choose another vehicle.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

console.log("vehicles data 👉", vehicles);


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
          <div className="col-span-3">Select</div>
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
              key={vehicle?.id}
              vehicle={{
                ...vehicle,
                passengers: formData?.passengers?.passengers,
                luggage: formData?.passengers?.bags,
                service_type: formData?.mode,
              }}
              selected={formData.vehicle?.id === vehicle.id}
              onSelect={() =>
                setFormData((prev: any) => ({ ...prev, vehicle }))
              }
            />
          ))}
        </div>

        {/* <div className="border py-5 p-2 md:p-6 flex flex-col md:flex-row justify-between">
           <div>
              <p className="text-muted-foreground">Base fare</p>
              <p className="font-medium">
                {basePrice ? `$${basePrice.toFixed(2)}` : "$0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Taxes & fees</p>
              <p className="font-medium">
                {taxesAmount ? `$${taxesAmount.toFixed(2)}` : "$0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Gratuity</p>
              <p className="font-medium">{gratuityAmount ? `$${gratuityAmount.toFixed(2)}` : "$0.00"}</p>
            </div>
            <div className="text-right">
            <p className="text-muted-foreground">TOTAL PAID</p>
            <p className="text-lg font-bold">
              {`$${(
                (selectedVehicle?.total_price || 0)
              )
                .toFixed(2)}`}
            </p>
          </div>
        </div> */}

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
