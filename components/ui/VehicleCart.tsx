// /* eslint-disable @next/next/no-img-element */

// "use client";
// import { FiBriefcase, FiUsers } from "react-icons/fi";

// interface Props {
//   vehicle: {
//     service_type: string;
//    id: number;
//   name: string;
//   class: string;
//   image: string;
//   capacity: number;
//   rate: number;
//   base_price: number;
//   total_price: number;
//   passengers: number;
//   luggage: number;
//   recommended: boolean;
//   };
//   selected: boolean;
//   onSelect: () => void;
// }

// const VehicleCard = ({ vehicle, selected, onSelect }: Props) => {
//   console.log("vehicle data 👉", vehicle?.service_type);
//   return (
//     <div
//       onClick={onSelect}
//       className={`grid grid-cols-12 items-center rounded-md md:px-4 py-3 border-b cursor-pointer
//         ${selected ? " bg-gray-50" : ""}`}
//     >
//       {/* Vehicle name */}
//       <div className="col-span-5 flex items-center gap-1 ">
//         <img
//           src={vehicle?.image || "img.freepik.com"}
//           alt={vehicle.name}
//           className="h-12 w-20 rounded-md object-cover "
//         />
//         <p className="block md:hidden text-xs">{vehicle.name.slice(0, 8)}...</p>

//         <p className="hidden md:block">{vehicle.name}</p>
//         <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full ml-2">
//           {vehicle.capacity} seats
//         </span>
//       </div>

//       {/* Capacity */}
//       <div className="col-span-4 text-sm text-gray-500 ml-3 md:ml-0">
//         <div className="flex items-center gap-3 md:hidden">
//           <span className="flex items-center gap-1">
//             <FiUsers className="text-base" />
//             <span className="text-xs">{vehicle.passengers}</span>
//           </span>

//           <span className="flex items-center gap-1">
//             <FiBriefcase className="text-base" />
//             <span className="text-xs">{vehicle.luggage}</span>
//           </span>
//         </div>

//         {/* MD & LG → text */}
//         <div className="hidden md:block">
//           {vehicle.passengers} passenger • {vehicle.luggage} luggage
//         </div>
//       </div>

//       {/* Price + button */}
//       <div className="col-span-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//         {/* <div>
//           <p className="font-semibold">${vehicle.total_price.toFixed(2)}</p>
//          Dynamic Pricing Label
//     {vehicle.service_type === "point_to_point" ? (
//       <span className="text-xs text-gray-500">
//         ${vehicle.rate} / km
//       </span>
//     ) :
//     <span className="text-xs text-gray-500">
//         ${vehicle.rate} / Hr
//       </span>
//     }
//         </div> */}

//         {selected ? (
//           <span className="text-xs bg-black text-white px-1 text-center  md:px-3 py-1 rounded-full">
//             Selected
//           </span>
//         ) : (
//           <button
//             onClick={onSelect}
//             className="text-xs px-3 py-1 cursor-pointer rounded-full border hover:bg-gray-100"
//           >
//             Select
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default VehicleCard;


/* eslint-disable @next/next/no-img-element */

"use client";

import { FiBriefcase, FiUsers } from "react-icons/fi";

interface Props {
  vehicle: {
    service_type: string;
    id: number;
    name: string;
    class: string;
    image: string;
    capacity: number;
    rate: number;
    base_price: number;
    total_price: number;
    passengers: number;
    luggage: number;
    recommended: boolean;
  };
  selected: boolean;
  onSelect: () => void;
}

const VehicleCard = ({ vehicle, selected, onSelect }: Props) => {
  return (
    <div
      onClick={onSelect}
      className={`
        rounded-md border-b cursor-pointer
        transition-colors
        ${selected ? "bg-gray-50" : "bg-white"}
      `}
    >
      {/* ================= MOBILE ================= */}
      <div className="flex items-center gap-2 px-2 py-3 sm:hidden">
        {/* Image */}
        <div className="shrink-0">
          <img
            src={vehicle?.image || "/placeholder-car.jpg"}
            alt={vehicle.name}
            className="h-12 w-16 rounded-md object-cover"
          />
        </div>

        {/* Vehicle Info */}
        <div className="min-w-0 flex-1">
          {/* Name */}
          <p className="truncate text-xs font-medium text-gray-800">
            {vehicle.name}
          </p>

          {/* Capacity */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            <span className="whitespace-nowrap">
              {vehicle.capacity} seats
            </span>

            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiUsers className="text-xs" />
              {vehicle.passengers}
            </span>

            <span className="flex items-center gap-1 whitespace-nowrap">
              <FiBriefcase className="text-xs" />
              {vehicle.luggage}
            </span>
          </div>
        </div>

        {/* Select Button */}
        <div className="shrink-0">
          {selected ? (
            <span className="inline-block whitespace-nowrap rounded-full bg-black px-2.5 py-1 text-[10px] text-white">
              Selected
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="whitespace-nowrap rounded-full border px-3 py-1 text-[10px] hover:bg-gray-100"
            >
              Select
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLET / DESKTOP ================= */}
      <div className="hidden sm:grid grid-cols-12 items-center px-4 py-3">
        {/* Vehicle */}
        <div className="col-span-5 flex min-w-0 items-center gap-2">
          <img
            src={vehicle?.image || "/placeholder-car.jpg"}
            alt={vehicle.name}
            className="h-12 w-20 shrink-0 rounded-md object-cover"
          />

          <p className="truncate">{vehicle.name}</p>

          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs">
            {vehicle.capacity} seats
          </span>
        </div>

        {/* Capacity */}
        <div className="col-span-4 ml-3 text-sm text-gray-500">
          {vehicle.passengers} passenger • {vehicle.luggage} luggage
        </div>

        {/* Button */}
        <div className="col-span-3 flex justify-end">
          {selected ? (
            <span className="whitespace-nowrap rounded-full bg-black px-3 py-1 text-xs text-white">
              Selected
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="whitespace-nowrap rounded-full border px-3 py-1 text-xs hover:bg-gray-100"
            >
              Select
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;