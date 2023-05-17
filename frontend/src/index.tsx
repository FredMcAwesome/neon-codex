import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.js";
import "./index.css";
import { httpBatchLink } from "@trpc/client";
import { trpc } from "./utils/trpc.js";
import { getAuthHeader } from "./utils/authFetch.js";
import { SERVER } from "./utils/config.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: SERVER + "/trpc",
      headers() {
        return { Authorization: getAuthHeader() };
      },
    }),
  ],
});

root.render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);
