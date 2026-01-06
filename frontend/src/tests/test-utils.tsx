import { render, type RenderResult, waitFor } from "@testing-library/react";
import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { httpLink } from "@trpc/client";
import { MemoryRouter } from "react-router-dom";
import { type ReactElement } from "react";
import userEvent from "@testing-library/user-event";
import { SERVER } from "../utils/config";

// Create a new QueryClient for each test
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        gcTime: Infinity,
      },
    },
  });

export const createTestTrpcClient = () =>
  trpc.createClient({
    links: [
      httpLink({
        url: SERVER + "/trpc",
      }),
    ],
  });

export function renderWithProviders(ui: ReactElement): RenderResult & {
  user: ReturnType<typeof userEvent.setup>;
  queryClient: QueryClient;
} {
  const queryClient = createTestQueryClient();
  const trpcClient = createTestTrpcClient();

  return {
    ...render(
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>{ui}</MemoryRouter>
        </QueryClientProvider>
      </trpc.Provider>
    ),
    user: userEvent.setup(),
    queryClient,
  };
}

export async function settle(queryClient: QueryClient) {
  await waitFor(
    () => {
      expect(queryClient.isFetching()).toBe(0);
      expect(queryClient.isMutating()).toBe(0);
    },
    { timeout: 2000 }
  );
  // Flush any pending React updates and Query observations
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
  });
}
