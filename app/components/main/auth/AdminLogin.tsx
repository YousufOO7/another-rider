/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Car, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Label from "@/app/utils/common/Label";
import { useDispatch } from "react-redux";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { useRouter } from "next/navigation";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import { loadUserFromToken } from "@/app/utils/helper/loadUserFromToken";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginDataProps,
  loginUserSchema,
} from "@/app/schema/authSchema/LoginSchema";
import { useLoginAdminMutation } from "@/app/redux/features/auth/authApi";
import { useAppConfig } from "@/app/utils/helper/useAppConfig";
import ButtonLoader from "@/app/utils/common/ButtonLoader";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading: loginLoading }] = useLoginAdminMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const {platformName, isLoading} = useAppConfig();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataProps>({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginDataProps) => {
    try {
      const result = await login(data).unwrap();

      if (result?.token) {
        toast.success(result?.message || "Login successful");

        shareWithCookies(
          "set",
          `${appConfiguration.appCode}token`,
          { expires: 1440 }, // 1 day
          result.token,
        );

        loadUserFromToken(dispatch);

        // Redirect
        router.replace("/rider-admin-portal");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid email or password");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 shadow-md border rounded-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-black text-white">
            <Car size={16} />
          </div>
          <h1 className="text-2xl font-bold">{isLoading ? <ButtonLoader /> : platformName} - Admin</h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <Label text="Email" className="font-bold" required />
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <Label text="Password" className="font-bold" required />
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
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
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Button */}
          <Button type="submit" className="w-full cursor-pointer" disabled={loginLoading}>
            {loginLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;