/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { INavigationLinks, publicNavigationLinks } from "@/app/utils/constant/navigations/publicNavigationLinks";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
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
} from "@/components/ui/alert-dialog"; // adjust your path
import { FiLogOut } from "react-icons/fi";
import ButtonLoader from "@/app/utils/common/ButtonLoader";
import { useAppConfig } from "@/app/utils/helper/useAppConfig";

const MobileNav = () => {
  const pathname = usePathname();
   const router = useRouter();
    const [token, setToken] = useState<string | null>(null);
  
    useEffect(() => {
      const t = shareWithCookies("get", `${appConfiguration.appCode}token`);
      setToken(t || null);
    }, []);
  
    const handleLogout = () => {
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

    const {platformName, isLoading} = useAppConfig();

  return (
    <nav className="border-b bg-white md:hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold">
          <span className="">{isLoading ? <ButtonLoader /> : platformName}</span>
        </Link>

        {/* Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <button>
              <Menu size={22} />
            </button>
          </SheetTrigger>

          {/* Right Sidebar */}
          <SheetContent side="right" className="w-72 p-0">
            <div className="flex h-full flex-col">
              {/* Menu Links */}
              <div className="flex flex-col gap-5 px-6 pt-6 text-sm font-semibold">
                {linksToShow.map((link) => (
                  <SheetClose asChild key={link.key}>
                    <Link
                      href={link.href}
                      className={`uppercase border-b mt-1 ${
                        pathname === link.href ? "text-black" : "text-gray-600"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {/* Spacer pushes button down */}
              <div className="flex-1" />

              {/* Bottom Login */}
              <div className="px-6 pb-6">
                <SheetClose asChild>
                   {token ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
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
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNav;
