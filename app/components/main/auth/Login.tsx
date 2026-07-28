/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Mail, Lock, EyeOff, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Label from "@/app/utils/common/Label";
import { useDispatch } from "react-redux";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { useRouter } from "next/navigation";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginDataProps,
  loginUserSchema,
} from "@/app/schema/authSchema/LoginSchema";
import {
  useLoginCustomerMutation,
  useResendCustomerVerificationCodeMutation,
} from "@/app/redux/features/auth/authApi";
import { setUser } from "@/app/redux/features/user/userSlice";
import { useAppConfig } from "@/app/utils/helper/useAppConfig";
import ButtonLoader from "@/app/utils/common/ButtonLoader";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrorEmail, setLoginErrorEmail] = useState<string | null>(null);
  const [login, { isLoading: loginLoading }] = useLoginCustomerMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { platformName, isLoading, platformLogo } = useAppConfig();

  const {
    register,
    handleSubmit,
    getValues,
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
        const userData = {
          id: result.customer.id?.toString() || null,
          email: result.customer.email || null,
          address: null,
          name: result.customer.name || null,
          avatar: null,
          phone: result.customer.phone || null,
          customer_type: result.customer.customer_type || null,
        };

        // Dispatch to Redux
        dispatch(setUser(userData));

        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect
        router.replace("/book-a-ride");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Login failed");
      if (error?.data?.message === "Email is not verified") {
        setLoginErrorEmail(data?.email);
      } else {
        setLoginErrorEmail(null);
      }
    }
  };

  const [resendCode, { isLoading: resendLoading }] =
    useResendCustomerVerificationCodeMutation();

  const handleVerifyAndResend = async () => {
    if (!loginErrorEmail) return;

    try {
      // Resend the verification code
      await resendCode({ email: loginErrorEmail }).unwrap();
      toast.success("Verification code sent!");

      // Redirect to verify page
      router.replace(`/auth/verify-email?email=${loginErrorEmail}`);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 shadow-md border rounded-sm">
        {/* Logo */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-6">
          <div className="flex h-8 w-32 items-center justify-center rounded-md bg-black text-white">
            {platformLogo && (
              <img
                src={platformLogo}
                alt="Platform Logo"
                className="w-32 h-8 object-cover rounded"
              />
            )}
          </div>
          <h1 className="text-2xl font-bold">
            {isLoading ? <ButtonLoader /> : platformName}
          </h1>
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

          {/* if error show a button click to redirect  */}
          {loginErrorEmail && (
            <div className="text-center my-2">
              <Button
                onClick={handleVerifyAndResend}
                disabled={resendLoading}
                variant="outline"
                className="w-full cursor-pointer text-red-600"
              >
                Verify Email
              </Button>
            </div>
          )}

          <p
            className="text-sm text-blue-600 cursor-pointer"
            onClick={() => {
              const emailValue = getValues("email");
              router.push(`/auth/forget-password?email=${emailValue || ""}`);
            }}
          >
            Forget Password?
          </p>

          {/* Button */}
          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={loginLoading}
          >
            {loginLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm font-bold text-center  mt-3">
          Don&apos;t have account{" "}
          <span
            className="underline cursor-pointer hover:text-gray-400"
            onClick={() => router.push("/auth/registration")}
          >
            register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
