/**
 * Barrel export — MSW Handlers.
 *
 * `handlers` = all happy-path handlers combined (default server config).
 * Individual error handler objects are also exported for per-test overrides.
 */
import { authHandlers, authErrorHandlers } from "./auth.handlers";
import { cashbackHandlers, cashbackErrorHandlers } from "./cashback.handlers";
import {
  contestacaoHandlers,
  contestacaoErrorHandlers,
} from "./contestacao.handlers";
import {
  notificacaoHandlers,
  notificacaoErrorHandlers,
} from "./notificacao.handlers";
import {
  merchantHandlers,
  merchantErrorHandlers,
} from "./merchant.handlers";

/** All happy-path handlers — used as default server configuration. */
export const handlers = [
  ...authHandlers,
  ...cashbackHandlers,
  ...contestacaoHandlers,
  ...notificacaoHandlers,
  ...merchantHandlers,
];

// Re-export individual handler arrays for granular composition
export { authHandlers, authErrorHandlers };
export { cashbackHandlers, cashbackErrorHandlers };
export { contestacaoHandlers, contestacaoErrorHandlers };
export { notificacaoHandlers, notificacaoErrorHandlers };
export { merchantHandlers, merchantErrorHandlers };
