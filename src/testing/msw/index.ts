/**
 * Barrel export — MSW testing layer.
 *
 * Consumers can import everything from '@/src/testing/msw':
 *
 *   import { server } from '@/src/testing/msw';
 *   import { createMockClienteResource } from '@/src/testing/msw';
 *   import { authErrorHandlers } from '@/src/testing/msw';
 */

// Server
export { server } from "./server";

// All fixtures
export * from "./fixtures";

// All handlers
export {
  handlers,
  authHandlers,
  authErrorHandlers,
  cashbackHandlers,
  cashbackErrorHandlers,
  contestacaoHandlers,
  contestacaoErrorHandlers,
  notificacaoHandlers,
  notificacaoErrorHandlers,
  merchantHandlers,
  merchantErrorHandlers,
} from "./handlers";
