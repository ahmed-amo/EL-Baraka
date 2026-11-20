import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  company: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(200),
  city: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(5000),
  service: z.string().trim().max(160).optional().default(""),
  companyWebsite: z.string().max(200).optional().default(""),
  turnstileToken: z.string().max(2000).optional().default(""),
});

export const applicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(40),
  position: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  companyWebsite: z.string().max(200).optional().default(""),
  turnstileToken: z.string().max(2000).optional().default(""),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

export const settingsSchema = z.object({
  phone: z.string().trim().min(6).max(40),
  phoneHref: z.string().trim().min(6).max(40),
  fax: z.string().trim().min(6).max(40),
  address: z.string().trim().min(3).max(240),
  email: z.string().trim().email().max(200),
  whatsappNumber: z.string().trim().max(20),
  whatsappMessage: z.string().trim().min(5).max(400),
  years: z.coerce.number().int().min(0).max(200),
  employees: z.coerce.number().int().min(0).max(100000),
  partners: z.coerce.number().int().min(0).max(100000),
  servicesCount: z.coerce.number().int().min(0).max(100),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  hours: z.string().trim().max(160),
  capital: z.string().trim().max(80),
  facebookUrl: z.string().trim().max(300),
  linkedinUrl: z.string().trim().max(300),
  instagramUrl: z.string().trim().max(300),
  metaTitle: z.string().trim().min(5).max(160),
  metaDescription: z.string().trim().min(10).max(320),
  heroVideoUrl: z.string().trim().max(500),
  heroVideoWebmUrl: z.string().trim().max(500),
  heroPosterUrl: z.string().trim().max(500),
  aboutImageUrl: z.string().trim().max(500),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z.string().min(10).max(200),
});

export const newAdminSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(200),
  password: z.string().min(10).max(200),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  shortDescription: z.string().trim().min(10).max(600),
  content: z.string().trim().min(10).max(8000),
  imageUrl: z.string().trim().min(1).max(500),
  icon: z.string().trim().min(2).max(40),
  order: z.coerce.number().int().min(0).max(999),
  isActive: z.boolean(),
});

export const consentSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean(),
});

export const trackSchema = z.object({
  type: z.enum(["pageview", "duration", "event"]),
  path: z.string().trim().min(1).max(300),
  referrer: z.string().max(500).optional().default(""),
  utmSource: z.string().max(120).optional().default(""),
  utmMedium: z.string().max(120).optional().default(""),
  utmCampaign: z.string().max(120).optional().default(""),
  consent: z.boolean().optional().default(false),
  duration: z.number().int().min(0).max(60 * 60).optional(),
  name: z.string().max(40).optional(),
  meta: z.record(z.string().max(200)).optional(),
});

export const POLICY_VERSION = "2026-10-29";
