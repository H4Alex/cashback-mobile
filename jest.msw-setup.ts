/**
 * Jest MSW lifecycle setup.
 *
 * This file is loaded via jest.config.js `setupFilesAfterSetup`.
 * It starts the MSW server before all tests, resets handlers between
 * tests, and closes the server after all tests complete.
 */
import { server } from "@/src/testing/msw/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
