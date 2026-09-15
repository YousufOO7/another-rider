/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiMapPin, FiSearch, FiChevronDown } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import RequiredStar from "../common/RequiredStar";
import { usePlacesAutocomplete } from "@/app/hooks/usePlacesAutocomplete";

/* ------------------ Types ------------------ */

export type SelectedAirport = {
  id: number | string;
  name: string;
  code: string;
  displayValue: string;
} | null;

interface AirportDropdownProps {
  airports: any[];
  value: string;
  onChange: (value: string) => void;
  onAirportSelect?: (airport: SelectedAirport) => void;
  onManualChange?: () => void; // ✅ NEW
  placeholder: string;
}

/* ------------------ Airport Dropdown Field ------------------ */

const AirportDropdown = ({
  airports,
  value,
  onChange,
  onAirportSelect,
  onManualChange,
  placeholder,
}: AirportDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ usePlacesAutocomplete callback — manual change detect
  const inputRef = usePlacesAutocomplete(searchTerm, (address) => {
    setSearchTerm(address);
    onChange(address);
    onManualChange?.(); // ✅ শুধু manual change এ clear
  });

  // Sync external value changes
  useEffect(() => {
    setSearchTerm(value || "");
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filter by name, code
  const filteredAirports = airports.filter((airport: any) => {
    const name = (airport?.name || "").toLowerCase();
    const code = (airport?.code || "").toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || code.includes(term);
  });

  // ✅ Airport select — শুধু এখানেই onAirportSelect কল হবে
  const handleSelectAirport = (airport: any) => {
    const displayValue = `${airport.name} (${airport.code})`;

    setSearchTerm(displayValue);
    onChange(displayValue);

    onAirportSelect?.({
      id: airport.id,
      name: airport.name,
      code: airport.code,
      displayValue,
    });

    setIsOpen(false);
  };

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <div className="pointer-events-none md:absolute left-3 top-2 flex items-center gap-1 text-gray-400 z-10">
        <RequiredStar />
        <p className="text-sm">{placeholder.split(" ")[1]}</p>
        <FiSearch className="hidden md:block" />
      </div>

      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          onManualChange?.(); // ✅ manual change → airport_id clear
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="md:pl-30 pr-10"
      />

      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
      >
        <FiChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg">
          {filteredAirports.length > 0 ? (
            filteredAirports.map((airport: any) => (
              <button
                key={airport.id}
                type="button"
                onClick={() => handleSelectAirport(airport)}
                className="flex w-full items-start gap-2 border-b px-3 py-2 text-left text-sm hover:bg-gray-50 last:border-b-0"
              >
                <FiMapPin className="mt-0.5 text-gray-400 shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    {airport.name}{" "}
                    <span className="text-gray-500">({airport.code})</span>
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-xs text-gray-500">
              No airport found. Type to search address manually.
            </div>
          )}
        </div>
      )}
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

interface AirportPickupAndDropOffProps {
  pickup_address: string;
  dropoff_address: string;
  extraStops: ExtraStop[];
  setExtraStops: React.Dispatch<React.SetStateAction<ExtraStop[]>>;
  onPickupChange: (v: string) => void;
  onDropoffChange: (v: string) => void;
  onPickupAirportSelect?: (airport: SelectedAirport) => void;
  onDropoffAirportSelect?: (airport: SelectedAirport) => void;
  // ✅ NEW: manual change callbacks
  onPickupManualChange?: () => void;
  onDropoffManualChange?: () => void;
  airports: any[];
}

const AirportPickupAndDropOff = ({
  pickup_address,
  dropoff_address,
  extraStops,
  setExtraStops,
  onPickupChange,
  onDropoffChange,
  onPickupAirportSelect,
  onDropoffAirportSelect,
  onPickupManualChange,
  onDropoffManualChange,
  airports = [],
}: AirportPickupAndDropOffProps) => {
  const updateStop = (index: number, value: string) => {
    setExtraStops((prev) =>
      prev.map((s, i) => (i === index ? { location: value } : s))
    );
  };

  return (
    <div className="space-y-4 mb-4">
      {/* Pickup */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border shrink-0">
          <FiMapPin />
        </div>

        <AirportDropdown
          airports={airports}
          value={pickup_address}
          onChange={onPickupChange}
          onAirportSelect={onPickupAirportSelect}
          onManualChange={onPickupManualChange}
          placeholder="Enter Pickup location or airport"
        />
      </div>

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
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border shrink-0">
          <span>D</span>
        </div>

        <AirportDropdown
          airports={airports}
          value={dropoff_address}
          onChange={onDropoffChange}
          onAirportSelect={onDropoffAirportSelect}
          onManualChange={onDropoffManualChange}
          placeholder="Enter Dropoff location or airport"
        />
      </div>
    </div>
  );
};

export default AirportPickupAndDropOff;