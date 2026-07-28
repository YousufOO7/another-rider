"use client";
import { FiCalendar, FiClock } from "react-icons/fi";
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
  time: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
};

export default function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Date Picker */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none " />
            <span className="absolute left-3 top-3 text-gray-400 pointer-events-none ">
              <RequiredStar />
            </span>
            <Input
              className="pl-8"
              placeholder="Pickup Date"
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

      {/* Time Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative cursor-pointer">
            <FiClock className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            <span className="absolute left-3 top-3 text-gray-400 pointer-events-none ">
              <RequiredStar />
            </span>
            <Input
              type="time"
              step="1"
              value={time}
              onChange={(e) => onTimeChange(e.target.value)}
              className="bg-background pl-7 appearance-none
    [&::-webkit-calendar-picker-indicator]:hidden
    [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </PopoverTrigger>
      </Popover>
    </div>
  );
}
