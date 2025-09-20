import { z } from "zod";

// German federal states
const germanStates = [
  "baden-wuerttemberg",
  "bayern",
  "berlin",
  "brandenburg",
  "bremen",
  "hamburg",
  "hessen",
  "mecklenburg-vorpommern",
  "niedersachsen",
  "nordrhein-westfalen",
  "rheinland-pfalz",
  "saarland",
  "sachsen",
  "sachsen-anhalt",
  "schleswig-holstein",
  "thueringen",
] as const;

// Email validation regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// German phone number validation regex
// Accepts: +49xxx, 0049xxx, 0xxx formats
const phoneRegex = /^(\+49|0049|0)?[1-9]\d{1,14}$/;

// Facebook URL validation
const facebookUrlRegex = /^https?:\/\/(www\.)?facebook\.com\/.+$/;

export const profileSchema = z
  .object({
    displayName: z.string().min(2).max(50),
    birthdate: z.string().transform((str) => new Date(str)),
    gender: z.enum(["male", "female", "other"]),
    lookingFor: z.enum(["male", "female", "both"]),
    lookingForAgeMin: z.number().int().min(18).max(99),
    lookingForAgeMax: z.number().int().min(18).max(99),
    city: z.string().min(2).max(100),
    federalState: z.enum(germanStates),
    phoneNumber: z
      .string()
      .regex(phoneRegex, {
        message: "Please enter a valid German phone number",
      })
      .transform((phone) => {
        // Normalize phone number
        let normalized = phone.replace(/\s/g, ""); // Remove spaces
        if (normalized.startsWith("00")) {
          normalized = "+" + normalized.slice(2);
        } else if (normalized.startsWith("0") && !normalized.startsWith("+")) {
          normalized = "+49" + normalized.slice(1);
        }
        return normalized;
      }),
    facebookProfile: z
      .string()
      .regex(facebookUrlRegex, {
        message: "Please enter a valid Facebook profile URL",
      })
      .optional()
      .or(z.literal("")),
    interests: z.array(z.string()).min(1).max(10),
    bio: z.string().max(500).optional(),
    email: z
      .string()
      .regex(emailRegex, {
        message: "Please enter a valid email address",
      })
      .email(),
  })
  .refine((data) => data.lookingForAgeMin <= data.lookingForAgeMax, {
    message: "Minimum age must be less than or equal to maximum age",
    path: ["lookingForAgeMax"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
