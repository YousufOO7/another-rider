/* eslint-disable @next/next/no-img-element */
"use client";
import { FiBriefcase, FiUsers } from "react-icons/fi";

interface Props {
  vehicle: {
    service_type: string;
   vehicle_id: 1,
  name: "",
  class: "",
  image: "",
  capacity: 0,
  rate: 0,
  base_price: 0,
  total_price: 0,
  passengers: number;
  luggage: number;
  recommended: true
  };
  selected: boolean;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, selected, onSelect }: Props) => {
  // console.log("vehicle data 👉", vehicle?.service_type);
  return (
    <div
      onClick={onSelect}
      className={`grid grid-cols-12 items-center rounded-md md:px-4 py-3 border-b cursor-pointer
        ${selected ? " bg-gray-50" : ""}`}
    >
      {/* Vehicle name */}
      <div className="col-span-5 flex items-center gap-1 ">
        <img
          src={vehicle?.image || "img.freepik.com"}
          alt={vehicle.name}
          className="h-12 w-20 rounded-md object-cover "
        />
        <p className="block md:hidden text-xs">{vehicle.name.slice(0, 8)}...</p>

        <p className="hidden md:block">{vehicle.name}</p>
      </div>

      {/* Capacity */}
      <div className="col-span-4 text-sm text-gray-500 ml-3 md:ml-0">
        <div className="flex items-center gap-3 md:hidden">
          <span className="flex items-center gap-1">
            <FiUsers className="text-base" />
            <span className="text-xs">{vehicle.passengers}</span>
          </span>

          <span className="flex items-center gap-1">
            <FiBriefcase className="text-base" />
            <span className="text-xs">{vehicle.luggage}</span>
          </span>
        </div>

        {/* MD & LG → text */}
        <div className="hidden md:block">
          {vehicle.passengers} passenger • {vehicle.luggage} luggage
        </div>
      </div>

      {/* Price + button */}
      <div className="col-span-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold">${vehicle.total_price.toFixed(2)}</p>
         {/* Dynamic Pricing Label */}
    {vehicle.service_type === "point_to_point" ? (
      <span className="text-xs text-gray-500">
        ${vehicle.rate} / km
      </span>
    ) :
    <span className="text-xs text-gray-500">
        ${vehicle.rate} / Hr
      </span>
    }
        </div>

        {selected ? (
          <span className="text-xs bg-black text-white px-1 text-center  md:px-3 py-1 rounded-full">
            Selected
          </span>
        ) : (
          <button
            onClick={onSelect}
            className="text-xs px-3 py-1 cursor-pointer rounded-full border hover:bg-gray-100"
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
};

export default VehicleCard;
