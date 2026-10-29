import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for booking and travelling with Ecojindu Shuttle.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms apply when you book a seat or travel with Ecojindu Shuttle, on this website or on WhatsApp. By booking, you agree to them."
    >
      <section>
        <h2>The service</h2>
        <p>
          Ecojindu Shuttle runs scheduled electric shuttles between Umuahia, Aba and Sam Mbakwe Airport, Owerri,
          on a published timetable. We also offer ride subscriptions and private vehicle charters.
        </p>
      </section>

      <section>
        <h2>Booking and payment</h2>
        <ul>
          <li>Fares are shown in Nigerian Naira before you pay.</li>
          <li>Payments are processed securely by Paystack.</li>
          <li>Your seat is confirmed once payment succeeds, and we send your QR ticket by email and SMS.</li>
          <li>Please give a correct phone number and email so we can reach you about your trip.</li>
        </ul>
      </section>

      <section>
        <h2>Travelling</h2>
        <ul>
          <li>Arrive at least 20 minutes before departure. Boarding closes 10 minutes before departure.</li>
          <li>Show your QR ticket on your phone or printed. Each ticket is valid for the booked departure only.</li>
          <li>
            Luggage allowance is one suitcase and one piece of hand luggage per seat. Extra luggage may need an
            extra seat.
          </li>
          <li>
            We plan departures to get you to the airport in good time, but you are responsible for choosing a
            departure that leaves enough time for your flight.
          </li>
          <li>Passengers must follow the driver&apos;s safety instructions.</li>
        </ul>
      </section>

      <section>
        <h2>Cancellations and refunds</h2>
        <p>
          See our{" "}
          <Link className="font-semibold underline underline-offset-2" href="/refunds">
            Refund &amp; Cancellation Policy
          </Link>
          .
        </p>
      </section>

      <section>
        <h2>Subscriptions</h2>
        <p>
          Subscription rides must be used within the plan&apos;s validity period. Each booking uses one ride
          credit.
        </p>
      </section>

      <section>
        <h2>Changes to these terms</h2>
        <p>We may update these terms. The version on this page when you book is the one that applies.</p>
      </section>
    </LegalPage>
  );
}
