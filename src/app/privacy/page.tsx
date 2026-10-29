import type { Metadata } from "next";

import { LegalPage } from "@/components/legal-page";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What personal data Ecojindu Shuttle collects, why, and who we share it with.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Ecojindu Shuttle collects only what it needs to sell you a seat, get you to the airport and keep you informed about your trip. We handle personal data in line with the Nigeria Data Protection Act 2023."
    >
      <section>
        <h2>What we collect</h2>
        <ul>
          <li>Your name, phone number and email address when you book or create an account.</li>
          <li>Booking details: route, departure, seats and, if you give it, your flight details.</li>
          <li>
            Flight ticket images you upload so we can read your flight details. The image is used only to read
            the ticket and is not stored afterwards.
          </li>
          <li>Payment records from Paystack, such as the amount, date and payment reference.</li>
          <li>Basic technical data such as your browser type and pages visited, used to keep the site working.</li>
        </ul>
        <p>We never see or store your full card details — card payments are handled entirely by Paystack.</p>
      </section>

      <section>
        <h2>How we use it</h2>
        <ul>
          <li>To hold and confirm your seat and issue your QR boarding ticket.</li>
          <li>To send booking confirmations, trip reminders and service updates by email, SMS or WhatsApp.</li>
          <li>To process payments and refunds.</li>
          <li>To answer your questions and resolve problems with a booking.</li>
          <li>To prevent fraud and keep our systems secure.</li>
        </ul>
        <p>We do not sell your personal data, and we do not send you marketing without your consent.</p>
      </section>

      <section>
        <h2>Who we share it with</h2>
        <p>We share data only with service providers who help us run the shuttle, and only what they need:</p>
        <ul>
          <li>Paystack, to take payments and issue refunds.</li>
          <li>Email, SMS and WhatsApp providers, to deliver your tickets and reminders.</li>
          <li>An AI document-reading service, to read the flight details from a ticket you upload.</li>
          <li>Google Cloud, which hosts our website and booking system.</li>
        </ul>
        <p>We may also disclose data where the law requires it.</p>
      </section>

      <section>
        <h2>How long we keep it</h2>
        <p>
          We keep booking and payment records for as long as we need them to provide the service and to meet our
          legal, tax and accounting obligations, then delete or anonymise them.
        </p>
      </section>

      <section>
        <h2>Your rights</h2>
        <p>
          You can ask to see, correct or delete the personal data we hold about you, or object to how we use it.
          Email {config.contactEmail} and we will respond within 30 days. You may also complain to the Nigeria
          Data Protection Commission.
        </p>
      </section>

      <section>
        <h2>Security</h2>
        <p>
          Data is sent over encrypted connections, and access to booking records is limited to staff who need it
          to operate the service.
        </p>
      </section>
    </LegalPage>
  );
}
