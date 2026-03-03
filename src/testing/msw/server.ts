/**
 * MSW Server — Node.js (for Jest / React Native testing).
 *
 * Usage in tests:
 *   import { server } from '@/src/testing/msw/server';
 *
 * The server lifecycle (listen/resetHandlers/close) is wired
 * automatically in jest.msw-setup.ts via setupFilesAfterSetup.
 */
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
