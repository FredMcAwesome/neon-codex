import { setupServer } from "msw/node";
import type { SetupServerApi } from "msw/node";

// have server in a separate file so we can call
// use function to add handler to specific tests
export const server: SetupServerApi = setupServer();
