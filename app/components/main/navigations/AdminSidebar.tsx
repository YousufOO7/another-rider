"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";
import { FiChevronsRight } from "react-icons/fi";
import { LucideLogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RiLockPasswordFill } from "react-icons/ri";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import useSidebar from "@/app/hooks/useSidebar";
import { adminNavigationLinks } from "@/app/utils/helper/adminNavigationLink";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAppConfig } from "@/app/utils/helper/useAppConfig";
import ButtonLoader from "@/app/utils/common/ButtonLoader";


const AdminSidebarNavigation = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { open, isOpen, onClose } = useSidebar();

  const handleLogout = async () => {
    shareWithCookies("remove", `${appConfiguration.appCode}token`);
    router.push('/rider-admin-auth/admin-login');
    router.refresh();
  };

  const isActive = (href: string) => pathname === href;
  const {platformName, isLoading, primaryColor, secondaryColor} = useAppConfig();

  return (
    <section
      className={`transition-all duration-700 hidden lg:block ${open ? "w-[260px]" : "w-[70px]"
        }`}
    >
      <motion.aside
        initial={{ width: 70 }}
        animate={{ width: open ? 260 : 70 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`fixed top-0 left-0 z-20 hidden lg:block  text-white dark:bg-background dark:shadow-2xl px-5 h-full overflow-hidden`}
        style={{
    backgroundColor: isLoading ? "#000000" : primaryColor,
  }}
      >
        {/* BRAND HEADER */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: open ? 1 : 0, x: open ? 0 : -20 }}
              transition={{ duration: 0.2 }}
              className={`text-2xl font-semibold ${!open && "hidden"}`}
            >
              <span>{isLoading ? <ButtonLoader /> : platformName}</span>
            </motion.h1>
          </Link>
          <button
            onClick={() => {
              if (open) {
                onClose();
              } else {
                isOpen();
              }
            }}
            className="cursor-pointer"
            aria-label="Toggle menu"
          >
            <FiChevronsRight
              className={`transition-transform duration-300 ${open ? "rotate-180" : ""
                }`}
              size={25}
            />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 text-white overflow-y-auto custom-scrollbar h-[calc(100vh-180px)] pb-4">
          <ul className="mt-2">
            {adminNavigationLinks.map((link, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="relative"
              >
                {!link.subLinks ? (
                  <Link
                    href={link.href || "#"}
                    className={cn(
                      "flex items-center px-2 py-3 gap-3  dark:text-gray-200 transition-all w-full hover:bg-primary-50",
                      isActive(link.href || "")
                        ? "bg-primary-100  font-semibold"
                        : ""
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {link.icon && <link.icon size={20} />}
                      {open && <span>{link.label.en}</span>}
                    </div>
                    {/* {!open && link.key && (
                      <span className="absolute top-1 right-1  text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {link.key}
                      </span>
                    )} */}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setActiveSubmenu(
                          activeSubmenu === link.key ? null : link.key
                        )
                      }
                      className="flex items-center px-2 py-3 gap-3  dark:text-gray-300 cursor-pointer transition-all rounded-md w-full justify-between hover:bg-primary-50"
                    >
                      <div className="flex items-center gap-3">
                        {link.icon && <link.icon size={20} />}
                        {open && <span>{link.label.en}</span>}
                      </div>
                      {/* {!open && link.key && (
                        <span className="absolute top-1 right-1  text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {link.key}
                        </span>
                      )} */}
                      {link.subLinks && open && (
                        <FiChevronDown
                          className={`transition-transform ${activeSubmenu === link.key ? "rotate-180" : ""
                            }`}
                        />
                      )}
                    </button>

                    <AnimatePresence>
                      {activeSubmenu === link.key && link.subLinks && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="ml-6 border-l border-gray-200 overflow-hidden"
                        >
                          {link.subLinks.map((subLink, subIndex) => (
                            <motion.li
                              key={subIndex}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: subIndex * 0.05 }}
                            >
                              {!subLink.subSubLinks ? (
                                <Link
                                  href={subLink.href || "#"}
                                  className={cn(
                                    "block px-6 py-2 text-sm transition-all",
                                    isActive(subLink.href || "")
                                      ? "bg-primary-100  font-semibold"
                                      : "hover:bg-primary-50"
                                  )}
                                >
                                  {subLink.label.en}
                                </Link>
                              ) : (
                                <>
                                  <button
                                    onClick={() =>
                                      setActiveSubSubmenu(
                                        activeSubSubmenu === subLink.key
                                          ? null
                                          : subLink.key
                                      )
                                    }
                                    className="flex items-center w-full cursor-pointer px-6 py-2 text-sm justify-between hover:bg-primary-50"
                                  >
                                    <span>{subLink.label.en}</span>
                                    <FiChevronDown
                                      className={`transition-transform ${activeSubSubmenu === subLink.key
                                          ? "rotate-180"
                                          : ""
                                        }`}
                                    />
                                  </button>

                                  <AnimatePresence>
                                    {activeSubSubmenu === subLink.key && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="ml-4 border-l border-gray-100"
                                      >
                                        {subLink.subSubLinks.map(
                                          (subSubLink, subSubIndex) => (
                                            <motion.li
                                              key={subSubIndex}
                                              initial={{ opacity: 0 }}
                                              animate={{ opacity: 1 }}
                                              transition={{
                                                delay: subSubIndex * 0.05,
                                              }}
                                            >
                                              <Link
                                                href={subSubLink.href || "#"}
                                                className={cn(
                                                  "block px-6 py-1 text-sm text-black dark:text-white transition-all",
                                                  isActive(
                                                    subSubLink.href || ""
                                                  )
                                                    ? "bg-primary-100  font-semibold"
                                                    : "hover:bg-primary-50"
                                                )}
                                              >
                                                {subSubLink.label.en}
                                              </Link>
                                            </motion.li>
                                          )
                                        )}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </>
                              )}
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        <Link
          href="/rider-admin-portal/admin-profile"
          className="flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <span>Admin Profile</span>
          <RiLockPasswordFill size={20} />
        </Link>

        {/* LOGOUT BUTTON */}
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                style={!isLoading ? { backgroundColor: secondaryColor } : undefined}
                size="sm"
                className={cn(
                  "cursor-pointer flex h-8 my-4 items-center justify-center text-white",
                  open
                    ? "w-full mx-auto"
                    : "rounded-full"
                )}
              >
                <LucideLogOut className="size-4 mr-1" />
                {open && <span>Logout</span>}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? Logging out will end your current session.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn-destructive-fill customer-pointer">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="cursor-pointer">
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <p
            className={cn(
              "text-center text-gray-500 text-xs opacity-75",
              !open && "hidden"
            )}
          >
            Version:{" "}
            <span className="lowercase">{appConfiguration.version}</span>
          </p>
        </div>
      </motion.aside>
    </section>
  );
};

export default AdminSidebarNavigation;