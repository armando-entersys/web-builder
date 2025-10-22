"use client";

import { useState, useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function InputOTP({
  length = 6,
  value = "",
  onChange,
  onComplete,
  className,
  disabled = false,
}: InputOTPProps) {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill(""))
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    const newValue = val.slice(-1);
    if (!/^\d*$/.test(newValue)) return;

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChange?.(otpString);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue && index === length - 1) {
      onComplete?.(otpString);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData
      .split("")
      .concat(Array(length - pastedData.length).fill(""));
    setOtp(newOtp);
    onChange?.(pastedData);

    if (pastedData.length === length) {
      onComplete?.(pastedData);
      inputRefs.current[length - 1]?.focus();
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "h-12 w-12 rounded-lg border-2 border-border bg-background text-center text-lg font-semibold transition-colors",
            "focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            otp[index] && "border-primary"
          )}
        />
      ))}
    </div>
  );
}
