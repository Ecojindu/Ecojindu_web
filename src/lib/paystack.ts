"use client";

import { config } from "./config";
import type { PaymentInit } from "./types";

/**
 * Paystack inline checkout.
 *
 * The script is loaded lazily and only once, on the checkout step — never on the
 * landing page — so it costs nothing on the critical path.
 *
 * When the backend is in mock mode (`PAYSTACK_MOCK=true`) it hands back an
 * `authorization_url` pointing at its own local checkout page. There is no
 * publishable key to open a popup with, so we redirect there instead. That keeps
 * the whole flow testable end to end with no Paystack account.
 */

const SCRIPT_ID = "paystack-inline-js";
const SCRIPT_SRC = "https://js.paystack.co/v2/inline.js";

declare global {
  interface Window {
    PaystackPop?: {
      new (): {
        newTransaction(options: {
          key: string;
          email: string;
          amount: number;
          reference?: string;
          accessCode?: string;
          currency?: string;
          onSuccess?: (transaction: { reference: string }) => void;
          onCancel?: () => void;
          onError?: (error: { message?: string }) => void;
        }): void;
      };
    };
  }
}

let loader: Promise<boolean> | null = null;

function loadScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.PaystackPop) return Promise.resolve(true);
  if (loader) return loader;

  loader = new Promise<boolean>((resolve) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(Boolean(window.PaystackPop));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  return loader;
}

/** Warm the script while the passenger is still filling in their details. */
export function preloadPaystack() {
  if (config.paystackPublicKey) void loadScript();
}

export interface CheckoutHandlers {
  onSuccess: (reference: string) => void;
  onCancel?: () => void;
  onError?: (message: string) => void;
}

export async function openCheckout(payment: PaymentInit, handlers: CheckoutHandlers) {
  const key = payment.public_key || config.paystackPublicKey;
  const isMock = !key || key.includes("placeholder") || payment.authorization_url.includes("/mock-pay/");

  if (isMock) {
    // Mock mode: the backend hosts the checkout page and redirects back to
    // PAYSTACK_CALLBACK_URL, which is /booking/callback.
    window.location.href = payment.authorization_url;
    return;
  }

  const ready = await loadScript();

  if (!ready || !window.PaystackPop) {
    // Popup blocked or the script failed — the hosted page always works.
    if (payment.authorization_url) {
      window.location.href = payment.authorization_url;
      return;
    }
    handlers.onError?.("We couldn't open the payment window. Please try again.");
    return;
  }

  try {
    const popup = new window.PaystackPop();
    popup.newTransaction({
      key,
      email: payment.email,
      amount: payment.amount_kobo,
      reference: payment.reference,
      accessCode: payment.access_code || undefined,
      currency: "NGN",
      onSuccess: (transaction) => handlers.onSuccess(transaction.reference || payment.reference),
      onCancel: () => handlers.onCancel?.(),
      onError: (error) =>
        handlers.onError?.(error?.message ?? "The payment could not be completed."),
    });
  } catch {
    if (payment.authorization_url) {
      window.location.href = payment.authorization_url;
      return;
    }
    handlers.onError?.("We couldn't open the payment window. Please try again.");
  }
}
