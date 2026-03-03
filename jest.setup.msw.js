/* global beforeAll, afterEach, afterAll */
/**
 * MSW setup for Jest — lifecycle hooks for mock server.
 *
 * Import this file in tests that need the MSW server, or add it
 * to jest.config.js setupFiles when the test framework globals
 * are available.
 */
const { server } = require('./src/testing/msw/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
