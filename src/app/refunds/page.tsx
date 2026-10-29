import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";
import { config } from "@/lib/config";
import { productConfig } from "@/lib/product-config";
import { naira } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: "How to cancel an Ecojindu Shuttle booking and when you get your money back.",
};

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro="Plans change. This page explains how to cancel a seat on an Ecojindu Shuttle departure and how refunds are paid."
    >
      <section>
        <h2>Fares</h2>
        <p>
          A standard seat costs {naira(productConfig.singleFareKobo)}, shown before you pay. Payment is taken
          securely by Paystack in Nigerian Naira. Your seat is held for {productConfig.seatHoldMinutes} minutes
          while you pay and is confirmed once payment succeeds.
        </p>
      </section>

      <section>
        <h2>Free cancellation up to 2 hours before departure</h2>
        <p>You can cancel free of charge up to two hours before your shuttle&apos;s scheduled departure:</p>
        <ul>
          <li>
            online from{" "}
            <Link className="font-semibold underline underline-offset-2" href="/manage">
              Manage booking
            </Link>{" "}
            with your booking reference and phone number, or
          </li>
          <li>by messaging CANCEL to our WhatsApp number, {config.contactPhone}.</li>
        </ul>
      </section>

      <section>
        <h2>Refunds</h2>
        <p>
          When you cancel in time, the full fare is refunded to your original payment method within 3–5 working
          days. Your bank may take a little longer to show it on your statement.
        </p>
        <p>
          Rides paid for with a subscription credit are returned to your subscription as a credit instead of cash.
        </p>
      </section>

      <section>
        <h2>Inside two hours of departure</h2>
        <p>
          Online cancellation closes two hours before departure. If something has gone wrong — a delayed or
          cancelled flight, for example — call us on {config.contactPhone} and we will do what we can.
        </p>
      </section>

      <section>
        <h2>If we cancel</h2>
        <p>
          If we cancel or cannot operate your departure, we will contact you and either move you to another
          departure you choose or refund your fare in full.
        </p>
      </section>

      <section>
        <h2>Payment problems</h2>
        <p>
          If you were charged but did not receive a ticket, or were charged twice, contact us with your booking
          reference or payment receipt and we will confirm your seat or refund the extra charge.
        </p>
      </section>
    </LegalPage>
  );
}
