/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  useResendCustomerVerificationCodeMutation,
  useVerifyCustomerRegistrationCodeMutation,
} from "@/app/redux/features/auth/authApi";
import { shareWithCookies } from "@/app/utils/helper/shareWithCookies";
import { appConfiguration } from "@/app/utils/constant/appConfiguration";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");

  const [verifyCode, { isLoading }] =
    useVerifyCustomerRegistrationCodeMutation();
  const [resendCode, { isLoading: resendLoading }] =
    useResendCustomerVerificationCodeMutation();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (!email) return;

    try {
      const res = await resendCode({ email }).unwrap();

      toast.success(res?.message || "Verification code resent");

      setCountdown(60); // 60 seconds cooldown
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend code");
    }
  };

  // Auto focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return; // only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box
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

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter 6 digit code");
      return;
    }

    try {
      const res = await verifyCode({
        email,
        verification_code: code,
      }).unwrap();

      if (res?.token) {
        shareWithCookies(
          "set",
          `${appConfiguration.appCode}token`,
          { expires: 1440 },
          res.token,
        );
      }

      toast.success(res?.message || "Email verified successfully");

      router.replace("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "Invalid code");
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white p-8 shadow-md border rounded-sm text-center">
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>

        <p className="text-sm text-gray-500 mb-6">
          We sent a verification code to <br />
          <span className="font-medium text-black">{email}</span> <br />
          Please provide that code below.
        </p>

        <div className="mb-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || countdown > 0}
            className="text-sm text-blue-600 hover:underline disabled:text-gray-400 cursor-pointer"
          >
            {resendLoading
              ? "Sending..."
              : countdown > 0
                ? `Resend code in ${countdown}s`
                : "Resend Code"}
          </button>
        </div>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-6">
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
              className="w-12 h-12 text-center border rounded-md text-lg font-bold focus:outline-none focus:ring-2 focus:ring-black"
            />
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
