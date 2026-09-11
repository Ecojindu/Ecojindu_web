import { z } from "zod";

/**
 * Accepts every way a Nigerian number gets typed and normalises to E.164,
 * matching the backend's own rule so the two never disagree.
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Please enter your phone number")
  .transform((value) => value.replace(/[\s\-().]/g, ""))
  .refine(
    (value) =>
      /^\+234[7-9][01]\d{8}$/.test(value) ||
      /^234[7-9][01]\d{8}$/.test(value) ||
      /^0[7-9][01]\d{8}$/.test(value) ||
      /^[7-9][01]\d{8}$/.test(value),
    "That doesn't look like a Nigerian phone number",
  )
  .transform((value) => {
    if (value.startsWith("+234")) return value;
    if (value.startsWith("234")) return `+${value}`;
    if (value.startsWith("0")) return `+234${value.slice(1)}`;
    return `+234${value}`;
  });

export const passengerSchema = z.object({
  passenger_name: z
    .string()
    .trim()
    .min(2, "Please enter the passenger's full name")
    .max(160, "That name is too long")
    .refine((v) => v.includes(" "), "Please include both first and last name"),
  passenger_phone: phoneSchema,
  passenger_email: z
    .union([z.string().trim().email("That email doesn't look right"), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
});

export type PassengerInput = z.input<typeof passengerSchema>;
export type PassengerOutput = z.output<typeof passengerSchema>;

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Enter your email or phone number"),
  password: z.string().min(1, "Enter your password"),
});

export const registerSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .refine((v) => v.includes(" "), "Please include both first and last name"),
  phone: phoneSchema,
  email: z
    .union([z.string().trim().email("That email doesn't look right"), z.literal("")])
    .optional()
    .transform((v) => (v === "" ? undefined : v)),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(128, "That password is too long"),
});

export const lookupSchema = z.object({
  booking_ref: z
    .string()
    .trim()
    .min(4, "Enter your booking reference")
    .transform((v) => {
      const upper = v.toUpperCase().replace(/\s/g, "");
      return upper.startsWith("EJS-") ? upper : `EJS-${upper.replace(/^EJS/, "")}`;
    }),
  phone: phoneSchema,
});

export const subscriptionSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .refine((v) => v.includes(" "), "Please include both first and last name"),
  phone: phoneSchema,
  email: z.string().trim().email("We need a valid email for your receipt and credits"),
});

export const forgotSchema = z.object({
  email: z.string().trim().email("That email doesn't look right"),
});

export const resetSchema = z
  .object({
    new_password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((data) => data.new_password === data.confirm, {
    message: "Those passwords don't match",
    path: ["confirm"],
  });
