import { isDev } from "@/src/config/env";

/**
 * Lightweight analytics abstraction.
 *
 * In development: logs events to console.
 * In production: forwards to the configured provider.
 *
 * To integrate a provider (e.g. Firebase, Mixpanel, Amplitude):
 *   1. Install the SDK: `npm install @react-native-firebase/analytics`
 *   2. Replace the `send()` body below with the provider's track call.
 *   3. Add user identification in `identify()`.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

function send(event: string, properties?: EventProperties) {
  if (isDev) {
    console.debug(`[Analytics] ${event}`, properties ?? "");
    return;
  }

  // Production provider hook — replace with your SDK call:
  // firebase.analytics().logEvent(event, properties);
  // mixpanel.track(event, properties);
}

// ── Public API ──────────────────────────────────────────────

export const analytics = {
  /** Track a named event with optional properties */
  track(event: string, properties?: EventProperties) {
    send(event, properties);
  },

  /** Track a screen view */
  screen(name: string, properties?: EventProperties) {
    send("screen_view", { screen_name: name, ...properties });
  },

  /** Associate events with a user (call after login) */
  identify(userId: string, traits?: EventProperties) {
    send("identify", { user_id: userId, ...traits });
  },

  /** Clear user association (call on logout) */
  reset() {
    send("reset");
  },

  // ── Domain Events ──────────────────────────────────────────

  /** User completed onboarding */
  onboardingCompleted() {
    send("onboarding_completed");
  },

  /** User logged in */
  loginSuccess(method: "email" | "biometric") {
    send("login_success", { method });
  },

  /** User registered */
  registerSuccess() {
    send("register_success");
  },

  /** User gave LGPD consent */
  consentGranted() {
    send("consent_granted");
  },

  /** Cashback earned by consumer */
  cashbackEarned(amount: number, empresaId: string) {
    send("cashback_earned", { amount, empresa_id: empresaId });
  },

  /** Cashback redeemed by consumer */
  cashbackRedeemed(amount: number, empresaId: string) {
    send("cashback_redeemed", { amount, empresa_id: empresaId });
  },

  /** QR code scanned */
  qrCodeScanned(type: "earn" | "redeem") {
    send("qr_code_scanned", { type });
  },

  /** Merchant generated a cashback */
  merchantCashbackGenerated(amount: number) {
    send("merchant_cashback_generated", { amount });
  },

  /** Push notification received */
  notificationReceived(type: string) {
    send("notification_received", { type });
  },

  /** Push notification tapped */
  notificationTapped(type: string) {
    send("notification_tapped", { type });
  },

  /** Contestacao opened */
  contestacaoCreated(transactionId: string) {
    send("contestacao_created", { transaction_id: transactionId });
  },

  /** App went offline */
  wentOffline() {
    send("went_offline");
  },

  /** App came back online with queued items */
  cameOnlineWithQueue(queueSize: number) {
    send("came_online_with_queue", { queue_size: queueSize });
  },
} as const;
