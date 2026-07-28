/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Input } from "@/components/ui/input";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import { Lock, Eye, EyeOff } from "lucide-react";
import Label from "@/app/utils/common/Label";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useUpdateCustomerProfileMutation } from "@/app/redux/features/auth/authApi";
import ButtonLoader from "@/app/utils/common/ButtonLoader";

interface UserData {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  customer_type: string | null;
  avatar?: string | null;
  address?: string | null;
}

const UserProfile = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [updateProfile, { isLoading }] = useUpdateCustomerProfileMutation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p className="text-center mt-10">Loading user data...</p>;

  const handleUpdate = async () => {
    if (password && password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const updatedData = {
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      };

      const res = await updateProfile(updatedData).unwrap();

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);

      toast.success("Profile updated successfully!");

      setEditMode(false);
      setPassword("");
      setPasswordConfirmation("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Update failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="rounded-md bg-white">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <FiUser className="text-2xl text-primary" />
              <h2 className="text-2xl font-bold">User Profile</h2>
            </div>

            {!editMode ? (
              <Button
                onClick={() => setEditMode(true)}
                className="text-white cursor-pointer"
              >
                Edit
              </Button>
            ) : (
              <Button
                onClick={handleUpdate}
                disabled={isLoading}
                variant="green"
                className="text-white cursor-pointer"
              >
                {isLoading && <ButtonLoader />}
                {isLoading ? "Saving..." : "Save"}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label text="Full Name" className="font-bold" />
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-gray-400" />
                <Input
                  value={user?.name || ""}
                  readOnly={!editMode}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label text="Email" className="font-bold" />
              <div className="relative">
                <FiMail className="absolute left-3 top-3 text-gray-400" />
                <Input
                  value={user?.email || ""}
                  readOnly={!editMode}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label text="Phone" className="font-bold" />
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-gray-400" />
                <Input
                  value={user?.phone || ""}
                  readOnly={!editMode}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Password Section (Only in Edit Mode) */}
          {editMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <Label text="Password" className="font-bold" required />
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label text="Confirm Password" className="font-bold" required />
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
