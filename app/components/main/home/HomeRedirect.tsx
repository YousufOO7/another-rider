/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useAppConfig } from "@/app/utils/helper/useAppConfig";
// import ButtonLoader from "@/app/utils/common/ButtonLoader";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useState } from "react";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { useCustomerLogoutMutation } from "@/app/redux/features/auth/authApi";

const HomeRedirect = ({ onBookOnline }: { onBookOnline: () => void }) => {
  const router = useRouter();
  console.log(onBookOnline);
  // const { platformName, isLoading, platformLogo } = useAppConfig();
  const [token, setToken] = useState<string | null>(null);
  const [customerLogout] = useCustomerLogoutMutation();

  useEffect(() => {
    const t = shareWithCookies("get", `${appConfiguration.appCode}token`);
    setToken(t || null);
  }, []);

  const handleLogout = async () => {
     const res = await customerLogout({}).unwrap();
     console.log(res)
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    localStorage.removeItem("user");
    setToken(null);
    router.push("/auth/login"); 
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white ">
      <div className="md:max-w-3xl  bg-white p-10 text-center shadow-md border rounded-sm -mt-10 md:mt-0">
        {/* Logo */}
        {/* <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-32 items-center justify-center rounded-md bg-black text-white">
            {platformLogo && (
              <img
                src={platformLogo}
                alt="Platform Logo"
                className="w-32 h-8 object-cover rounded"
              />
            )}
          </div>
          <h1 className="sm:text-lg md:text-2xl font-bold">
            {isLoading ? <ButtonLoader /> : platformName}
          </h1>
        </div> */}

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-2">
          Welcome to online booking system
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Book your ride online in a minute!
        </p>

        <p className="text-sm font-medium mb-6">
          Please select an option below
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          <Button
            // onClick={onBookOnline}
            onClick={() => router.push("/book-a-ride")}
            className="rounded-md px-6 cursor-pointer"
          >
            Book Online
          </Button>

          <Button className="rounded-md px-6 cursor-pointer">
            Price Quote
          </Button>
          <Button className="rounded-md px-6 cursor-pointer">
            Quick Receipt
          </Button>
          <Button
            onClick={() => router.push("/manage-reservation")}
            className="rounded-md px-6 cursor-pointer"
          >
            Manage Reservations
          </Button>
        </div>

        {/* Login */}
        <p className="text-sm text-gray-500 mb-3">Have an account with us?</p>

        <div className="flex justify-center">
        {token ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="red"
                size="sm"
                className="cursor-pointer flex items-center gap-2"
              >
                <FiLogOut /> Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to logout? You will need to login again
                  to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-destructive-fill cursor-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={handleLogout}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Link href={"/auth/login"}>
            <Button variant="default" size="sm" className="cursor-pointer">
              Login
            </Button>
          </Link>
        )}
        </div>
      </div>
    </div>
  );
};

export default HomeRedirect;
