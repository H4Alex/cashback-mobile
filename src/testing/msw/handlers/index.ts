/**
 * Barrel export — MSW request handlers.
 *
 * Combines all mobile consumer + merchant handler arrays into
 * a single `handlers` export for use with setupServer / setupWorker.
 */

// ─── Mobile consumer handlers ───────────────────────────────
export { mobileAuthHandlers, mobileAuthErrorHandlers } from './mobile-auth.handlers'
export { mobileCashbackHandlers, mobileCashbackErrorHandlers } from './mobile-cashback.handlers'
export { mobileContestacaoHandlers, mobileContestacaoErrorHandlers } from './mobile-contestacao.handlers'
export { mobileQRCodeHandlers, mobileQRCodeErrorHandlers } from './mobile-qrcode.handlers'
export { mobileNotificationHandlers, mobileNotificationErrorHandlers } from './mobile-notification.handlers'

// ─── Merchant handlers ──────────────────────────────────────
export { merchantHandlers, merchantErrorHandlers } from './merchant.handlers'

// ─── Combined handlers array ────────────────────────────────
import { mobileAuthHandlers } from './mobile-auth.handlers'
import { mobileCashbackHandlers } from './mobile-cashback.handlers'
import { mobileContestacaoHandlers } from './mobile-contestacao.handlers'
import { mobileQRCodeHandlers } from './mobile-qrcode.handlers'
import { mobileNotificationHandlers } from './mobile-notification.handlers'
import { merchantHandlers } from './merchant.handlers'

export const handlers = [
  ...mobileAuthHandlers,
  ...mobileCashbackHandlers,
  ...mobileContestacaoHandlers,
  ...mobileQRCodeHandlers,
  ...mobileNotificationHandlers,
  ...merchantHandlers,
]
