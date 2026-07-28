"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { MdLogout } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import * as Avatar from "@radix-ui/react-avatar";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);

    window.location.reload();
    router.refresh();
  };


  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode);
  // };

  return (
    <header className="w-screen md:w-full bg-white dark:bg-background dark:shadow-2xl overflow-hidden py-1 sticky left-0 top-0 z-50 transition-all duration-500 backdrop-blur-sm border-b">
      <div className="w-full mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <Button
              className="md:hidden p-2 rounded-md text-white hover:bg-orange-600 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>

            {/* Logo */}
            <div className="text-lg font-semibold md:ml-0 mx-auto md:mx-0">
              <p className="font-bold">Welcome To Rider Dashboard</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Desktop Icons */}
              <div className="flex items-center gap-4">
                {/* <ThemeSwitcher></ThemeSwitcher>
                <LocaleSwitcher></LocaleSwitcher> */}

                {/* Avatar Dropdown */}
                <div className="relative inline-block mt-1">
      <button
        className="rounded-full border-2 border-white cursor-pointer overflow-hidden w-8 h-8 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Avatar.Root className="w-full h-full">
          <Avatar.Image
            src={""}
            alt="User"
            className="object-cover w-full h-full"
          />
          <Avatar.Fallback delayMs={600}>AD</Avatar.Fallback>
        </Avatar.Root>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white text-black shadow-md p-4 rounded-lg z-50 dark:bg-gray-800 dark:text-white">
          <div className="absolute -top-2 right-3 w-4 h-4 bg-white dark:bg-gray-800 transform rotate-45"></div>
          
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex cursor-pointer items-center gap-2 py-1 transition-colors hover:text-orange-500 dark:hover:text-orange-300">
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? Logging
                      out will end your current session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <MdLogout className="text-lg" />
            </div>
          </div>
        </div>
      )}
    </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
