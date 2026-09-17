/**
 * Product knobs that marketing and ops may change without a code rewrite.
 * Live trip fares still come from the API (`fare_kobo` / `base_fare_kobo`).
 *
 * OWNER DECISION NEEDED — Subscription per-ride economics:
 * Tier 1 and Tier 2 effective fares are BOTH higher than the ₦15,000 single
 * seat. Do not invent new prices until the owner confirms plan amounts.
 */

export const productConfig = {
  /** Single-seat published fare used when the catalogue has not loaded yet. */
  singleFareKobo: 1_500_000,

  /** Private cab comparison (marketing only). */
  cabComparisonKobo: 4_000_000,

  /**
   * Hours before flight departure the shuttle must arrive at the airport.
   * Must match backend CHECK_IN_BUFFER_HOURS.
   */
  checkInBufferHours: 2.5,

  /** Seat hold during checkout — must match backend SEAT_HOLD_MINUTES. */
  seatHoldMinutes: 10,

  /** Reminder offsets before departure (hours). */
  reminderOffsetsHours: [24, 3, 1] as const,

  pickupCities: ["Umuahia", "Aba"] as const,

  airportKeywords: ["Sam Mbakwe", "Owerri", "Airport"],

  /** Rail product — hide booking until the backend marks a rail route live. */
  railTransfersLive: false,

  /**
   * Subscription display config. Prices mirror current seed / live plans.
   * Flagged: effective ₦/ride > single fare — owner must decide.
   */
  subscriptions: {
    pricingReviewNeeded: true,
    pricingReviewNote:
      "Tier 1 ≈ ₦16,667/ride and Tier 2 ≈ ₦20,000/ride — both above the ₦15,000 single fare. Confirm plan prices before marketing these as savings.",
    tiers: [
      {
        code: "TIER1",
        label: "Tier 1",
        rides: 12,
        validityMonths: 3,
        priceKobo: 20_000_000,
        effectivePerRideKobo: 1_666_700,
      },
      {
        code: "TIER2",
        label: "Tier 2",
        rides: 50,
        validityMonths: 12,
        priceKobo: 100_000_000,
        effectivePerRideKobo: 2_000_000,
      },
    ],
  },

  faq: [
    {
      q: "Where does the shuttle leave from?",
      a: "Umuahia departures leave from the Nnenna Otti Bus Terminal, with pickup at Umuahia Tower Junction and along the Umuahia–Owerri road. Aba departures leave from Aba Central Terminal. You arrive at the Sam Mbakwe terminal building.",
    },
    {
      q: "How far ahead should I arrive?",
      a: "Twenty minutes before departure. Boarding closes ten minutes before we leave — we run to a published timetable so the shuttle after yours also leaves on time.",
    },
    {
      q: "What if my flight is delayed or I need to cancel?",
      a: "You can cancel free of charge up to two hours before departure from Manage booking or by messaging CANCEL on WhatsApp. Refunds return to your original payment method within 3–5 working days. Inside two hours, call us and we will do what we can.",
    },
    {
      q: "Do I need an account to book?",
      a: "No. Guests book with a name and phone number. After payment we create your account from that phone number and confirm it with a one-time code on WhatsApp or SMS.",
    },
    {
      q: "How much luggage can I bring?",
      a: "One suitcase and one piece of hand luggage per seat. Travelling heavier? Book an extra seat or message us on WhatsApp first.",
    },
    {
      q: "Are the vehicles really electric?",
      a: "Yes. The fleet is 100% electric — 14-seat Wuling EV minibuses with a 300km range, charged at our Umuahia terminal.",
    },
    {
      q: "How do ride subscriptions work?",
      a: "Buy a block of rides upfront — 12 over 3 months, or 50 over a year. Each booking uses one credit and skips payment at checkout.",
    },
    {
      q: "Can I book on WhatsApp?",
      a: "Yes. Send a photo of your flight ticket or message our WhatsApp number and we will guide you through the same booking API as the website.",
    },
  ],
} as const;

export type PickupCity = (typeof productConfig.pickupCities)[number];
