import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import App from "./App.js";
import "./index.css";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { trpc } from "./utils/trpc.js";
import { getAuthHeader } from "./utils/authFetch.js";
import { SERVER } from "./utils/config.js";
import { clearUserSession } from "./components/login/loginHelper.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // this occurs on any query error (but error is still passed on)
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        console.log(error.data.code);
        if (error.data.code == "UNAUTHORIZED") {
          console.log("User JWT cleared");
          clearUserSession();
          // it was difficult to redirect from here so just refresh page
          window.location.reload();
        }
      }
    },
  }),
});
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
  <StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </StrictMode>
);
