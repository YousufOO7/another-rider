/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Car, Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Label from "@/app/utils/common/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { RegistrationDataProps, registrationSchema } from "@/app/schema/authSchema/RegisrationSchema";
import { useRouter } from "next/navigation";
import { useRegisterCustomerMutation } from "@/app/redux/features/auth/authApi";
import { useAppConfig } from "@/app/utils/helper/useAppConfig";
import ButtonLoader from "@/app/utils/common/ButtonLoader";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [createUser, { isLoading: isCreateLoading }] =
    useRegisterCustomerMutation();
    const {platformName, isLoading} = useAppConfig();

    const router = useRouter();

   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationDataProps>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationDataProps) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.confirmPassword,
      };

      const result = await createUser(payload).unwrap(); // RTK Query

      if (result?.customer_id) {

        toast.success(result.message || "User registered successfully");

        // redirect to home or login page
        router.replace(`/auth/verify-email?email=${data?.email}`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 shadow-md border rounded-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
            <Car size={16} />
          </div>
          <h1 className="text-2xl font-bold">{isLoading ? <ButtonLoader /> : platformName}</h1>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-1">
            <Label text="Name" className="font-bold" required />
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Enter your name"
                className="pl-10"
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label text="Email" className="font-bold" required />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label text="Phone" className="font-bold" required />
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="number"
                placeholder="Enter your phone"
                className="pl-10"
                {...register("phone")}
              />
            </div>
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label text="Password" className="font-bold" required />
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <Label text="Confirm Password" className="font-bold" required />
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-10 pr-10"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isCreateLoading}>
            {isCreateLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
