import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
// https://github.com/trpc/trpc/issues/6554
import App from "./App.js";
import "./index.css";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { trpc } from "./utils/trpc.js";
import { getAuthHeader } from "./utils/authFetch.js";
import { SERVER } from "./utils/config.js";
import { clearUserSession } from "./components/login/loginHelper.js";
import { ThemeContextProvider } from "./context/ThemeContext.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (
          error instanceof TRPCClientError &&
          error.data?.code === "UNAUTHORIZED"
        ) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
  queryCache: new QueryCache({
    // this occurs on any query error (but error is still passed on)
    onError: (error) => {
      if (error instanceof TRPCClientError) {
        console.log(error.data.code);
        if (error.data.code == "UNAUTHORIZED") {
          console.log("User JWT cleared");
          clearUserSession();
          // Force app to re-evaluate authentication status -> redirects via PrivateRoute
          queryClient.invalidateQueries({ queryKey: ["authenticationStatus"] });
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
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </trpc.Provider>
);
