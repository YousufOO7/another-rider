"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car } from "lucide-react";
import { LuCalendarPlus } from "react-icons/lu";
import { useRouter } from "next/navigation";

const BookingOnlineForm = () => {
    const router = useRouter();
  return (
    
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="md:max-w-3xl  bg-white p-10 text-center shadow-md border rounded-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
            <Car size={16} />
          </div>
          <h1 className="sm:text-lg md:text-2xl font-bold">RideSystem</h1>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-2">
          Welcome to booking portal
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Book your ride instantly, manage your reservations, or get quick
          receipt in just few click!
        </p>

        <p className="text-sm font-medium mb-6">Select an option below</p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Link href="/book-a-ride">
            <button className="w-full py-2 md:w-32 md:h-24 text-white bg-black rounded-md cursor-pointer flex md:flex-col items-center justify-center text-center gap-1">
              <LuCalendarPlus className=" md:text-lg" />
              <p className="text-xs font-bold mt-1">Book Online</p>
            </button>
          </Link>
          <div className="w-full py-2 md:w-32 md:h-24 text-white bg-black rounded-md cursor-pointer flex md:flex-col items-center justify-center text-center gap-1">
            <LuCalendarPlus className="text-lg" />
            <p className="text-xs font-bold mt-1">Price Quote</p>
          </div>
          <Link href="/quick-receipt">
           <div className="w-full py-2 md:w-32 md:h-24 text-white bg-black rounded-md cursor-pointer flex md:flex-col items-center justify-center text-center gap-1">
            <LuCalendarPlus className="text-lg" />
            <p className="text-xs font-bold mt-1"  >Quick Receipt</p>
          </div>
          </Link>
          {/* href={"/manage-reservation"} */}
           <div className="w-full py-2 md:w-32 md:h-24 text-white bg-black rounded-md cursor-pointer flex md:flex-col items-center justify-center text-center gap-1">
            <LuCalendarPlus className="text-lg" />
            <p className="text-xs font-bold mt-1"  >Manage Reservations</p>
          </div>
        </div>

        {/* Login */}
        <p className="text-sm text-gray-500 mb-3">Have an account with us?</p>
        
          <Button onClick={() => router.push("/auth/login")} variant="default" className="w-full md:w-28 cursor-pointer">
            Login
          </Button>
      </div>
    </div>
  );
};

export default BookingOnlineForm;
