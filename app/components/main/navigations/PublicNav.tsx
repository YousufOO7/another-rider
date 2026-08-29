/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { INavigationLinks, publicNavigationLinks } from "@/app/utils/constant/navigations/publicNavigationLinks";
import { usePathname, useRouter } from "next/navigation";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { useEffect, useState } from "react";
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
import { useAppConfig } from "@/app/utils/helper/useAppConfig";
import ButtonLoader from "@/app/utils/common/ButtonLoader";
import { useCustomerLogoutMutation } from "@/app/redux/features/auth/authApi";

const PublicNav = ({ onBookOnline }: { onBookOnline: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [customerLogout] = useCustomerLogoutMutation();

  useEffect(() => {
    const t = shareWithCookies("get", `${appConfiguration.appCode}token`);
    setToken(t || null);
  }, []);

  const handleLogout = async () => {
     const res = await customerLogout({}).unwrap();
     console.log(res)
    // Clear token from cookies
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    // Optionally clear user data from localStorage
    localStorage.removeItem("user");
    setToken(null);
    router.push("/auth/login"); // redirect to login
  };

    const linksToShow: INavigationLinks[] = publicNavigationLinks.filter((link) => {
    if (token) {
      return true;
    } else {
      // Not logged in: hide "Customer Profile"
      return link.key !== "/profile/my-profile";
    }
  });

  const { isLoading, platformLogo} = useAppConfig();

  return (
    <nav className="bg-white border-b hidden md:block">
      <div className="container mx-auto flex items-center justify-between  px-4">
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium  text-gray-600">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900"
            onClick={onBookOnline}
          >
            {/* <span className="">{isLoading ? <ButtonLoader /> : platformName}</span> */}
             <span className="flex items-center gap-2">
                {isLoading ? (
                  <ButtonLoader />
                ) : (
                  <>
                    {platformLogo && (
                      <img
                        src={platformLogo}
                        alt="Platform Logo"
                        className=" h-8 bg-cover rounded"
                      />
                    )}

                    {/* <span>{platformName || "Add Name"}</span> */}
                  </>
                )}
              </span>
          </Link>
         {linksToShow.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={`text-[12px] font-bold py-4 uppercase ${
                pathname === link.href ? "border-b-2 border-black" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Login Button */}
        {/* Login / Logout Button */}
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
    </nav>
  );
};

export default PublicNav;
