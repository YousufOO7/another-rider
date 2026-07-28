"use client"
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import Label from "@/app/utils/common/Label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetConfigQuery, useUpdateConfigMutation } from "@/app/redux/features/settings/config/configApi";

const PriceAndRules = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    currency: "usd",
    tax_rate: "",
    base_price_flat: "",
    cancellation_fee: "",
    surge_rate: "",
    wait_time_rate: "",
    platform_name: "",
    primary_brand_color: "",
    secondary_brand_color: "",
    rate_buffer: "",
    gratuity_percentage: "",
  });

  // Fetch config data
  const { data: configData, isLoading, refetch } = useGetConfigQuery([]);
  const [updateConfig, { isLoading: isUpdating }] = useUpdateConfigMutation();

  // Initialize form data when config data is loaded
  useEffect(() => {
    if (configData?.data) {
      setFormData({
        currency: configData.data.currency || "usd",
        tax_rate: configData.data.tax_rate || "",
        base_price_flat: configData.data.base_price_flat || "",
        cancellation_fee: configData.data.cancellation_fee || "",
        surge_rate: configData.data.surge_rate || "",
        wait_time_rate: configData.data.wait_time_rate || "",
        platform_name: configData.data.platform_name || "",
        primary_brand_color: configData.data.primary_brand_color || "",
        secondary_brand_color: configData.data.secondary_brand_color || "",
        rate_buffer: configData.data.rate_buffer || "",
        gratuity_percentage: configData.data.gratuity_percentage || "",
      });
    }
  }, [configData]);

  const withHash = (color: string) => {
  if (!color) return "";
  return color.startsWith("#") ? color : `#${color}`;
};


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorSelect = (color: string, type: 'primary' | 'secondary') => {
    if (isEditing) {
      setFormData(prev => ({
        ...prev,
        [type === 'primary' ? 'primary_brand_color' : 'secondary_brand_color']: withHash(color)
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Prepare the data in the format your API expects
      const updateData = {
        id: configData?.data?.id || 1,
        company_id: configData?.data?.company_id || 1,
        ...formData,
        service_zones: configData?.data?.service_zones || {}
      };

      await updateConfig({ data: updateData }).unwrap();
      setIsEditing(false);
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Failed to update config:", error);
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (configData?.data) {
      setFormData({
        currency: configData.data.currency || "usd",
        tax_rate: configData.data.tax_rate || "",
        base_price_flat: configData.data.base_price_flat || "",
        cancellation_fee: configData.data.cancellation_fee || "",
        surge_rate: configData.data.surge_rate || "",
        wait_time_rate: configData.data.wait_time_rate || "",
        platform_name: configData.data.platform_name || "",
        primary_brand_color: configData.data.primary_brand_color || "",
        secondary_brand_color: configData.data.secondary_brand_color || "",
        rate_buffer: configData.data.rate_buffer || "",
        gratuity_percentage: configData.data.gratuity_percentage || "",
      });
    }
    setIsEditing(false);
  };

  // Predefined color options for both primary and secondary
  const colorOptions = [
    { value: "000000", label: "Black", class: "bg-gray-900" },
    { value: "F54927", label: "Red-Orange", class: "bg-[#F54927]" },
    { value: "27F5B0", label: "Teal", class: "bg-[#27F5B0]" },
    { value: "3B82F6", label: "Blue", class: "bg-blue-600" },
    { value: "10B981", label: "Green", class: "bg-green-600" },
    { value: "8B5CF6", label: "Purple", class: "bg-purple-600" },
    { value: "F59E0B", label: "Amber", class: "bg-amber-500" },
    { value: "EF4444", label: "Red", class: "bg-red-500" },
    { value: "06B6D4", label: "Cyan", class: "bg-cyan-500" },
    { value: "F97316", label: "Orange", class: "bg-orange-500" },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price & Rules</h1>
            <p className="text-gray-600">Loading configuration...</p>
          </div>
          <Button disabled>Loading...</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Price & Rules</h1>
          <p className="text-gray-600">Manage your pricing and business rules</p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isUpdating}
                className="cursor-pointer"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer"
            >
              Edit Config
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md">
        <form>
          {/* General price rules */}
          <div className="bg-white p-4 rounded-md border mb-4">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              $ General Price & Rules
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Currency */}
              <div>
                <Label text="Currency" className="font-bold mb-2" required />
                {isEditing ? (
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleInputChange("currency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="bdt">BDT</SelectItem>
                      <SelectItem value="inr">INR</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.currency.toUpperCase()}
                  </div>
                )}
              </div>

              {/* Tax Rate */}
              <div>
                <Label text="Sales Tax / VAT (%)" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.tax_rate}
                    onChange={(e) => handleInputChange("tax_rate", e.target.value)}
                    placeholder="e.g., 8.50"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.tax_rate || "Not set"}
                  </div>
                )}
              </div>

              {/* Booking Fee */}
              <div>
                <Label text="Booking Fee (Flat)" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.base_price_flat}
                    onChange={(e) => handleInputChange("base_price_flat", e.target.value)}
                    placeholder="e.g., 15.00"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.base_price_flat || "Not set"}
                  </div>
                )}
              </div>

              {/* Cancellation Fee */}
              <div>
                <Label text="Cancellation Fee" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.cancellation_fee}
                    onChange={(e) => handleInputChange("cancellation_fee", e.target.value)}
                    placeholder="e.g., 25.00"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.cancellation_fee || "Not set"}
                  </div>
                )}
              </div>

              {/* Wait Time Rate */}
              <div>
                <Label text="Wait Time Rate (per min)" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.wait_time_rate}
                    onChange={(e) => handleInputChange("wait_time_rate", e.target.value)}
                    placeholder="e.g., 1.50"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.wait_time_rate || "Not set"}
                  </div>
                )}
              </div>

              {/* Surge Rate */}
              <div>
                <Label text="Night Surge (11PM - 5AM)" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.surge_rate}
                    onChange={(e) => handleInputChange("surge_rate", e.target.value)}
                    placeholder="e.g., 20"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.surge_rate || "Not set"}
                  </div>
                )}
              </div>
              {/* rate_buffer */}
              <div>
                <Label text="Rate Buffer" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.rate_buffer}
                    onChange={(e) => handleInputChange("rate_buffer", e.target.value)}
                    placeholder="e.g., 20"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.rate_buffer || "Not set"}
                  </div>
                )}
              </div>
              {/* Gratuity Percentage */}
              <div>
                <Label text="Gratuity Percentage" className="font-bold mb-2" required />
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.gratuity_percentage}
                    onChange={(e) => handleInputChange("gratuity_percentage", e.target.value)}
                    placeholder="e.g., 20"
                  />
                ) : (
                  <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                    {formData.gratuity_percentage || "Not set"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* White label branding */}
          <div className="bg-white p-4 rounded-md border space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center rounded-full border">
                🌐
              </div>
              <h3 className="text-sm font-semibold text-gray-800">
                White-Label Branding
              </h3>
            </div>

            {/* Platform Name */}
            <div className="space-y-1">
              <Label text="Platform Name" className="font-bold mb-2" required={false} />
              {isEditing ? (
                <Input
                  type="text"
                  value={formData.platform_name}
                  onChange={(e) => handleInputChange("platform_name", e.target.value)}
                  placeholder="Enter platform name"
                />
              ) : (
                <div className="px-3 py-2 text-sm border rounded-md bg-gray-50">
                  {formData.platform_name || "Not set"}
                </div>
              )}
            </div>

            {/* Primary Brand Color */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label text="Primary Brand Color" className="font-bold mb-2" required={false} />
                
                <div className="flex flex-wrap items-center gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={`primary-${color.value}`}
                      type="button"
                      onClick={() => handleColorSelect(color.value, 'primary')}
                      className={`w-8 h-8 rounded-full ${color.class} ring-2 ring-offset-2 transition-all ${
                        !isEditing 
                          ? "cursor-default"
                          : "cursor-pointer hover:scale-110"
                      } ${
                        formData.primary_brand_color === color.value 
                          ? "ring-gray-900" 
                          : "ring-transparent"
                      }`}
                      title={color.label}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
                
                {isEditing && (
                  <div className="mt-3">
                    <Label text="Custom Color (HEX)" className="font-bold mb-2" required={false} />
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-md border shadow-sm"
                        style={{ backgroundColor: formData.primary_brand_color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">#</span>
                          <Input
                            type="text"
                            value={formData.primary_brand_color}
                            onChange={(e) => handleInputChange("primary_brand_color", withHash(e.target.value))}
                            placeholder="HEX code without #"
                            className="max-w-[180px]"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter 6-character HEX code (e.g., F54927)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Color Display - Read Only Mode */}
              {!isEditing && formData.primary_brand_color && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: `${formData.primary_brand_color}` }}
                  />
                  <div>
                    <p className="text-sm font-medium">Primary Color</p>
                    <p className="text-sm text-gray-600">{formData.primary_brand_color.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Brand Color */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label text="Secondary Brand Color" className="font-bold mb-2" required={false} />
                
                <div className="flex flex-wrap items-center gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={`secondary-${color.value}`}
                      type="button"
                      onClick={() => handleColorSelect(color.value, 'secondary')}
                      className={`w-8 h-8 rounded-full ${color.class} ring-2 ring-offset-2 transition-all ${
                        !isEditing 
                          ? "cursor-default"
                          : "cursor-pointer hover:scale-110"
                      } ${
                        formData.secondary_brand_color === color.value 
                          ? "ring-gray-900" 
                          : "ring-transparent"
                      }`}
                      title={color.label}
                      disabled={!isEditing}
                    />
                  ))}
                </div>
                
                {isEditing && (
                  <div className="mt-3">
                    <Label text="Custom Color (HEX)" className="font-bold mb-2" required={false} />
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-md border shadow-sm"
                        style={{ backgroundColor: formData.secondary_brand_color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">#</span>
                          <Input
                            type="text"
                            value={formData.secondary_brand_color}
                            onChange={(e) => handleInputChange("secondary_brand_color", withHash(e.target.value))}
                            placeholder="HEX code without #"
                            className="max-w-[180px]"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter 6-character HEX code (e.g., 27F5B0)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Color Display - Read Only Mode */}
              {!isEditing && formData.secondary_brand_color && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                  <div 
                    className="w-10 h-10 rounded-md border"
                    style={{ backgroundColor: `${formData.secondary_brand_color}` }}
                  />
                  <div>
                    <p className="text-sm font-medium">Secondary Color</p>
                    <p className="text-sm text-gray-600">{formData.secondary_brand_color.toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>

           
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceAndRules;