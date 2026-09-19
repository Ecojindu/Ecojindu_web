import type { Metadata } from "next";
import Link from "next/link";

import { ManagePageClient } from "./manage-client";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Manage booking",
  description:
    "Look up an Ecojindu Shuttle booking with your reference and phone number. View QR, resend ticket, or cancel.",
};

export default function ManagePage() {
  return (
    <div>
      <div className="container max-w-lg pt-8">
        <h1 className="text-display-sm font-extrabold text-forest dark:text-cream-50">
          Manage booking
        </h1>
        <p className="mt-2 text-ink-muted dark:text-cream-100/70">
          No login needed. Use your booking reference (EJS-…) and the phone number on the ticket.
          Need help?{" "}
          <a className="font-semibold text-moss underline-offset-2 hover:underline dark:text-leaf" href={`mailto:${config.contactEmail}`}>
            {config.contactEmail}
          </a>
          {" · "}
          <Link href="/help" className="font-semibold text-moss underline-offset-2 hover:underline dark:text-leaf">
            FAQ
          </Link>
        </p>
      </div>
      <ManagePageClient />
    </div>
  );
}
