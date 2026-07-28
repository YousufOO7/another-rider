/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import React from "react";
import { FiMapPin, FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import RequiredStar from "../common/RequiredStar";
import { usePlacesAutocomplete } from "@/app/hooks/usePlacesAutocomplete";

/* ------------------ Location Field ------------------ */

interface LocationFieldProps {
  labelIcon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rightLabel?: string;
}

const LocationField = ({
  labelIcon,
  placeholder,
  value,
  onChange,
  rightLabel,
}: LocationFieldProps) => {
  const inputRef = usePlacesAutocomplete(value, onChange);

  return (
    <div className="flex items-center gap-3">
      {/* Left Icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
        {labelIcon}
      </div>

      {/* Input */}
      <div className="relative flex-1">
        <div className="pointer-events-none md:absolute left-3 top-2 flex items-center gap-1 text-gray-400">
          <RequiredStar />
          <p className="text-sm">{placeholder.split(" ")[1]}</p>
          <FiSearch className="hidden md:block" />
        </div>

        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="md:pl-30 pr-30"
        />

        {rightLabel && (
          <span className="absolute right-3 top-2.5 text-xs font-medium text-gray-500 hidden md:block">
            {rightLabel}
          </span>
        )}
      </div>
    </div>
  );
};

/* ------------------ Extra Stop Field ------------------ */

interface ExtraStopFieldProps {
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const ExtraStopField = ({
  index,
  value,
  onChange,
  onRemove,
}: ExtraStopFieldProps) => {
  const inputRef = usePlacesAutocomplete(value, onChange);

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full border">
        <FiMapPin />
      </div>

      <div className="relative flex-1">
        <div className="pointer-events-none md:absolute left-3 top-2 flex items-center gap-1 text-gray-400">
          <RequiredStar />
          <p className="text-sm">{`Stop ${index + 1}`}</p>
          <FiSearch className="hidden md:block" />
        </div>

        <Input
          ref={inputRef}
          placeholder={`Stop ${index + 1}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="md:pl-30 pr-30"
        />
      </div>

      <button
        onClick={onRemove}
        className="text-xs text-gray-500 hover:text-black"
      >
        Remove
      </button>
    </div>
  );
};

/* ------------------ Main Component ------------------ */

type ExtraStop = {
  location: string;
};

interface PickupAndDropOffProps {
  pickup_address: string;
  dropoff_address: string;
  extraStops: ExtraStop[];
  setExtraStops: React.Dispatch<React.SetStateAction<ExtraStop[]>>;
  onPickupChange: (v: string) => void;
  onDropoffChange: (v: string) => void;
}

const PickupAndDropOff = ({
  pickup_address,
  dropoff_address,
  extraStops,
  setExtraStops,
  onPickupChange,
  onDropoffChange,
}: PickupAndDropOffProps) => {
  const updateStop = (index: number, value: string) => {
    setExtraStops((prev) =>
      prev.map((s, i) => (i === index ? { location: value } : s))
    );
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Pickup */}
      <LocationField
        labelIcon={<FiMapPin />}
        placeholder="Enter Pickup location"
        value={pickup_address}
        onChange={onPickupChange}
        rightLabel="Starting point"
      />

      {/* Extra Stops */}
      {extraStops.map((stop, index) => (
        <ExtraStopField
          key={index}
          index={index}
          value={stop.location}
          onChange={(v) => updateStop(index, v)}
          onRemove={() =>
            setExtraStops((prev) => prev.filter((_, i) => i !== index))
          }
        />
      ))}

      {/* Dropoff */}
      <LocationField
        labelIcon={<span>D</span>}
        placeholder="Enter Dropoff location"
        value={dropoff_address}
        onChange={onDropoffChange}
        rightLabel="Destination"
      />

     
    </div>
  );
};

export default PickupAndDropOff;
