import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import "cross-fetch/polyfill";
import { BrowserRouter } from "react-router-dom";

// This type interface extends the default options for render from RTL, as well
// as allows the user to specify other things such as queryClient
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  queryClient?: QueryClient;
}

function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
  return (
    <BrowserRouter>
      <RootWrapper>{children}</RootWrapper>
    </BrowserRouter>
  );
}

function RootWrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  { ...renderOptions }: ExtendedRenderOptions = {}
) {
  // Return an object with the store and all of RTL's query functions
  return { ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export function rootRender(
  ui: React.ReactElement,
  { ...renderOptions }: ExtendedRenderOptions = {}
) {
  return { ...render(ui, { wrapper: RootWrapper, ...renderOptions }) };
}
