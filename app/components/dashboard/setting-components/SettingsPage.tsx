"use client";
import { useEffect, useState } from "react";
import { TfiControlPlay } from "react-icons/tfi";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { shareWithLocal } from "@/app/utils/helper/shareWithLocalStorage";

const SettingsPage = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Extract active tab from URL
  const activeTab = pathname.split('/').pop() || "setting-overview";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      shareWithLocal('set', 'activeAccountTab', activeTab);
    }
  }, [activeTab]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleTabChange = (tabId: string) => {
    shareWithLocal('set', 'activeAccountTab', tabId);
    router.push(`/rider-admin-portal/setting-management/${tabId}`);
    setMobileSidebarOpen(false);
  };

  const tabs = [
    {
      id: "setting-overview",
      label: "Overview",
    
    },
    {
      id: "vehicles-management",
      label: "Vehicle Classes",
    },
    {
      id: "price-and-rules",
      label: "Price & Rules",
    }
  ];

  return (
    <div className="container mx-auto px-4 lg:px-0 mb-[37px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <Button variant={'outline'}
          onClick={toggleMobileSidebar}
          className="lg:hidden fixed top-24 left-4 z-50 bg-white p-2 rounded-md shadow-md"
        >
          <TfiControlPlay
            size={20}
            className={`transition-transform duration-300 ${mobileSidebarOpen ? "rotate-180 text-red-500" : "text-gray-700"
              }`}
          />
        </Button>

        <div
          className={`fixed dark:bg-black dark:text-white lg:static inset-y-0 left-0 w-[280px] lg:w-full z-40 border-r py-5 px-3 transition-transform duration-300 lg:translate-x-0 lg:col-span-3 h-[100vh] overflow-y-auto ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            }`}
          style={{ top: "80px" }}
        >
          <div className="mb-5">
            <h3 className="text-sm text-gray-500 px-2 dark:text-white">
              Main menu
            </h3>
          </div>
          <ul className="space-y-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <li
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center h-[42px] gap-3 py-2 px-4 rounded-md cursor-pointer text-sm font-medium transition-colors duration-200 ${isActive
                      ? "bg-white  dark:text-white border-gray-300 text-black"
                      : "text-gray-700  hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {/* {typeof tab.icon === 'function' ? tab.icon(isActive) : tab.icon} */}
                  <span>{tab.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        <div className="lg:col-span-9 w-full">
          <div className="">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;