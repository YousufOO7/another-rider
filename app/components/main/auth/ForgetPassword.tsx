/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Label from "@/app/utils/common/Label";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import {
  useCustomerResetPasswordRequestMutation,
  useResetCustomerPasswordWithCodeMutation,
} from "@/app/redux/features/auth/authApi";

const ForgetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(queryEmail);
  const [step, setStep] = useState<"request" | "reset">("request");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [requestCode, { isLoading: requestLoading }] =
    useCustomerResetPasswordRequestMutation();

  const [resetPassword, { isLoading: resetLoading }] =
    useResetCustomerPasswordWithCodeMutation();

  // 🔹 Send reset code
  const handleSendCode = async () => {
    try {
      await requestCode({ email }).unwrap();
      toast.success("Reset code sent successfully!");
      setStep("reset");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send code");
    }
  };

  // 🔹 OTP input handler
  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 🔹 Reset password submit
  const handleResetPassword = async () => {
    const code = otp.join("");

    try {
      await resetPassword({
        email,
        reset_code: code,
        new_password: password,
        new_password_confirmation: confirmPassword,
      }).unwrap();

      toast.success("Password updated successfully!");
      router.replace("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white  shadow-md border rounded-sm ">
        <Button variant="link" onClick={() => router.push("/auth/login")} className="cursor-pointer">
          Back to Login
        </Button>

        <div className="space-y-5 p-8">
          {/* Email Input */}
          <div >
            <Label text="Email" required />
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={18}
              />
              <Input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Step 1 */}
          {step === "request" && (
            <Button
              className="w-full cursor-pointer"
              onClick={handleSendCode}
              disabled={requestLoading}
            >
              {requestLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          )}

          {/* Step 2 */}
          {step === "reset" && (
            <>
            <Label text="Input Reset Code" required ></Label>
              {/* OTP */}
              <p className="text-green-600 font-semibold text-sm">Please check your email for reset code</p>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border rounded-md text-lg font-bold"
                  />
                ))}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label text="New Password" required />
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <Label text="Confirm Password" required />
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    className="pl-10 pr-10"
                    value={confirmPassword}
                    placeholder="Enter confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className="w-full cursor-pointer"
                onClick={handleResetPassword}
                disabled={resetLoading}
              >
                {resetLoading ? "Updating..." : "Update Password"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
