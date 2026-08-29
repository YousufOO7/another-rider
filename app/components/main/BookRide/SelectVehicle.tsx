/* eslint-disable @typescript-eslint/no-explicit-any */

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
  const [loading] = useState<boolean>(false);
  const {
    data: vehiclesData,
  } = useGetAllVehiclesQuery({});
  const vehicles = vehiclesData?.data || [];

  const handleNext = () => {
    if (!formData.vehicle) {
      toast.error("Please select a vehicle first");
      return;
    }
    
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
                passengers: (formData.passengers?.passengers || 0) + (formData.passengers?.child_seats || 0),
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

        {/* Next button */}
        <div className="flex justify-end pb-5 p-2 md:p-6">
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