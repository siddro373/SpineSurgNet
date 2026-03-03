import { z } from "zod/v4";
import { validateNPI } from "./npi";

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  npiNumber: z.string().refine(validateNPI, "Invalid NPI number"),
  specialty: z.string().min(1, "Specialty is required"),
  subSpecialty: z.string().optional(),
  boardCertified: z.boolean().optional(),
  fellowshipTrained: z.boolean().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().optional(),
  practiceName: z.string().optional(),
  phone: z.string().optional(),
  conferences: z.array(z.object({
    conferenceId: z.string(),
    role: z.string().optional(),
  })).optional(),
});

export const updateSurgeonSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  specialty: z.string().min(1).optional(),
  subSpecialty: z.string().optional(),
  boardCertified: z.boolean().optional(),
  fellowshipTrained: z.boolean().optional(),
  yearsInPractice: z.number().int().min(0).optional(),
  practiceName: z.string().optional(),
  hospitalAffiliation: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(2).optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
  conferences: z.array(z.object({
    conferenceId: z.string(),
    role: z.string().optional(),
  })).optional(),
});

export const changeEmailSchema = z.object({
  newEmail: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required"),
  confirmText: z.literal("DELETE"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type UpdateSurgeonInput = z.infer<typeof updateSurgeonSchema>;
