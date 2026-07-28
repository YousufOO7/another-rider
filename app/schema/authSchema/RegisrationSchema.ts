import { z } from "zod";

// Registration Schema
export const registrationSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
     phone: z
      .string()
      .min(1, "Phone number is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });


// Types
export type RegistrationDataProps = z.infer<typeof registrationSchema>;
