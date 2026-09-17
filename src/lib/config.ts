/** Public runtime configuration, read once. */

export const config = {
  apiBaseUrl: (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, ""),
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348154471570",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@ecojindu.ng",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+234 815 447 1570",
  socialHandle: process.env.NEXT_PUBLIC_SOCIAL_HANDLE ?? "@ecojindu.ng",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://ecojindu-web-480235407496.us-central1.run.app",
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Ecojindu Shuttle",
} as const;

export function whatsappLink(message = "Hi Ecojindu Shuttle, I'd like to book a seat.") {
  return `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
