import {
  fireEvent,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import { JwtTokenType } from "@neon-codex/common";
import App from "../App.js";
import { rootRender } from "../utils/TestingUtils.js";
import { getLoginStatus, postLogin } from "../utils/api.js";
import {
  clearUserSession,
  saveUserSession,
} from "../components/login/loginHelper.js";
import { server } from "./mocks/server.js";

const token: JwtTokenType = {
  token: "tokenValue",
};

afterEach(() => {
  clearUserSession();
});

test("Default page is login", async () => {
  rootRender(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );

  // findBy as there is a delay where
  const linkElement = await screen.findByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});

test("Login to website", async () => {
  const handlers = [
    rest.post(postLogin, (_req, res, ctx) => {
      return res(ctx.json(token), ctx.delay(50));
    }),
  ];
  server.use(...handlers);

  rootRender(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const content = await screen.findByText(/login/i);

  const usernameInput: HTMLInputElement = screen.getByLabelText(/Username/i);
  const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
  fireEvent.change(usernameInput, { target: { value: "admin" } });
  fireEvent.change(passwordInput, { target: { value: "admin" } });
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitForElementToBeRemoved(content);
});

test("Don't show login page when already logged in", () => {
  const handlers = [
    rest.get(getLoginStatus, (_req, res, ctx) => {
      return res(ctx.status(200), ctx.delay(50));
    }),
  ];
  server.use(...handlers);
  saveUserSession("tokenValue", "usernameValue");
  rootRender(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  // TODO: fix, this will immediately see the element not rendered...
  const linkElement = screen.queryByText(/Login/i);
  expect(linkElement).not.toBeInTheDocument();
});

test("Redirect to login page if not logged in", async () => {
  rootRender(
    <MemoryRouter initialEntries={["/"]}>
      <App />
    </MemoryRouter>
  );
  const linkElement = await screen.findByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
