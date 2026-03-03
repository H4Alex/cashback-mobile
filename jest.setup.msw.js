/**
 * MSW setup for Jest — lifecycle hooks for mock server.
 *
 * This file is loaded via jest.config.js setupFilesAfterFramework.
 * It starts the MSW server before all tests, resets handlers after each,
 * and closes the server after all tests complete.
 */
const { server } = require('./src/testing/msw/server');

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
