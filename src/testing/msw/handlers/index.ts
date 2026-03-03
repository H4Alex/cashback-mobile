/**
 * Barrel export — MSW request handlers.
 *
 * Combines all mobile consumer + merchant handler arrays into
 * a single `handlers` export for use with setupServer / setupWorker.
 */

import { mobileAuthHandlers, mobileAuthErrorHandlers } from './mobile-auth.handlers'
import { mobileCashbackHandlers, mobileCashbackErrorHandlers } from './mobile-cashback.handlers'
import { mobileContestacaoHandlers, mobileContestacaoErrorHandlers } from './mobile-contestacao.handlers'
import { mobileQRCodeHandlers, mobileQRCodeErrorHandlers } from './mobile-qrcode.handlers'
import { mobileNotificationHandlers, mobileNotificationErrorHandlers } from './mobile-notification.handlers'
import { merchantHandlers, merchantErrorHandlers } from './merchant.handlers'

// ─── Mobile consumer handlers ───────────────────────────────
export { mobileAuthHandlers, mobileAuthErrorHandlers }
export { mobileCashbackHandlers, mobileCashbackErrorHandlers }
export { mobileContestacaoHandlers, mobileContestacaoErrorHandlers }
export { mobileQRCodeHandlers, mobileQRCodeErrorHandlers }
export { mobileNotificationHandlers, mobileNotificationErrorHandlers }

// ─── Merchant handlers ──────────────────────────────────────
export { merchantHandlers, merchantErrorHandlers }

// ─── Combined handlers array ────────────────────────────────
export const handlers = [
  ...mobileAuthHandlers,
  ...mobileCashbackHandlers,
  ...mobileContestacaoHandlers,
  ...mobileQRCodeHandlers,
  ...mobileNotificationHandlers,
  ...merchantHandlers,
]
