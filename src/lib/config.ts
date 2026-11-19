/** Public runtime configuration, read once. */

export const config = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, ""),
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348128000082",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@eshuttle.ng",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+234 812 800 0082",
  socialHandle: process.env.NEXT_PUBLIC_SOCIAL_HANDLE ?? "@ecojindu.ng",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://eshuttle.ng",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Ecojindu Shuttle",
} as const;

export function whatsappLink(message = "Hi Ecojindu Shuttle, I'd like to book a seat.") {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
