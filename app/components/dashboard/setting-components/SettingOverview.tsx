"use client"
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FiDollarSign, FiUserPlus } from "react-icons/fi";

const SettingOverview = () => {
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600">Manage your System Overview</p>
      </div>
      <hr className="my-3" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border rounded-md shadow-sm bg-white">
          <h2 className="text-sm font-semibold text-gray-700">Subscribes Plan</h2>
          <p className="text-2xl font-bold  mt-2">1,234</p>
          <span className="text-xs text-gray-500">Renews on Nov 1 2025</span>
        </div>
      </div>

    <div className="space-y-6">
      {/* ================= Usage Metrics ================= */}
      <div className="bg-white border rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Usage Metrics (This Month)
          </h2>

          <Button
            variant="outline"
            className="text-sm px-4 py-1 h-8 rounded-md"
          >
            View Details
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SMS Notifications */}
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>SMS Notifications</span>
              <span>2,405 / 5,000</span>
            </div>

            <Progress value={48} className="h-2 bg-gray-200" />

            <p className="text-xs text-gray-500 mt-2">
              Resets in 12 days
            </p>
          </div>

          {/* Google Maps API */}
          <div>
            <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
              <span>Google Maps API Calls</span>
              <span>45,210 / 100,000</span>
            </div>

            <Progress value={45} className="h-2 bg-gray-200" />

            <p className="text-xs text-gray-500 mt-2">
              Resets in 12 days
            </p>
          </div>
        </div>
      </div>

      {/* ================= Recent Administrative Activity ================= */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Recent Administrative Activity
        </h2>

        <div className="space-y-6">
          {/* Item 1 */}
          <div className="flex items-start justify-between border-b pb-4">
            <div className="flex items-start gap-4">
              <div className="bg-gray-900 text-white p-3 rounded-full">
                <FiDollarSign size={16} />
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  Pricing Rules Updated
                </p>
                <p className="text-sm text-gray-500">
                  Admin Sarah J. changed SUV base rate to $85.00
                </p>
              </div>
            </div>

            <span className="text-xs text-gray-500 whitespace-nowrap">
              2 hours ago
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-gray-900 text-white p-3 rounded-full">
                <FiUserPlus size={16} />
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  New Driver Added
                </p>
                <p className="text-sm text-gray-500">
                  Dispatcher Mike R. added driver Profile #204
                </p>
              </div>
            </div>

            <span className="text-xs text-gray-500 whitespace-nowrap">
              5 hours ago
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SettingOverview;
