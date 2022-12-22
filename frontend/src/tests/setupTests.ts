import "@testing-library/jest-dom";
import { server } from "./mocks/server.js";
import "./mocks/LibraryMocks.js";

// Enable API mocking before tests.
beforeAll(() => {
  server.listen({
    onUnhandledRequest: () => {
      throw new Error(`Unhandled request`);
    },
  });
});

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());
