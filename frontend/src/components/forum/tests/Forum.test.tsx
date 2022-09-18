import { rest } from "msw";
import { render, screen } from "@testing-library/react";
import Forum from "../Forum.js";
import { server } from "../../../utils/mocks/server.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThreadListType } from "@shadowrun/common/src/index.js";
import "cross-fetch/polyfill";
import { SERVER } from "../../../utils/config.js";

const queryClient = new QueryClient();

test("Forum page default display", async () => {
  const handlers = [
    rest.get(SERVER + "/api/forum/thread", (_req, res, ctx) => {
      const threads: ThreadListType = [
        {
          title: "example",
          user: "user1",
          id: 1,
        },
      ];
      return res(ctx.json(threads), ctx.delay(50));
    }),
  ];
  server.listen({
    onUnhandledRequest: () => {
      throw new Error(`Unhandled request`);
    },
  });
  server.use(...handlers);
  render(
    <QueryClientProvider client={queryClient}>
      <Forum />
    </QueryClientProvider>
  );
  expect(await screen.findByText(/Thread: example/i)).toBeInTheDocument();
});
