"use client";
import { FiCalendar } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import RequiredStar from "../common/RequiredStar";
import { useState } from "react";

type Props = {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export default function DatePickerOnly({
  date,
  onDateChange,
  required = true,
  placeholder = "Pickup Date",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`mb-6 ${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            {required && (
              <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                <RequiredStar />
              </span>
            )}
            <Input
              className={required ? "pl-8" : "pl-4"}
              placeholder={placeholder}
              value={date ? date.toLocaleDateString() : ""}
              readOnly
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => {
              onDateChange(selectedDate);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}