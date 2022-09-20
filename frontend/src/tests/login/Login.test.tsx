import { rest } from "msw";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { server } from "../mocks/server.js";
import Login from "../../components/login/Login.js";
import { renderWithProviders } from "../../utils/TestingUtils.js";
import { JwtTokenType } from "@shadowrun/common";
import { postLogin } from "../../utils/api.js";
import { clearUserSession } from "../../components/login/loginHelper.js";

const token: JwtTokenType = {
  token: "tokenValue",
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  __esModule: true,
  ...(jest.requireActual("react-router-dom") as any),
  useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => jest.clearAllMocks());

afterEach(() => {
  clearUserSession();
});

test("Login page default display", () => {
  renderWithProviders(<Login />);

  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test("login page with correct credentials", async () => {
  const handlers = [
    rest.post(postLogin, (_req, res, ctx) => {
      return res(ctx.json(token), ctx.delay(50));
    }),
  ];
  server.use(...handlers);

  renderWithProviders(<Login />);
  const usernameInput: HTMLInputElement = screen.getByLabelText(/Username/i);
  const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
  fireEvent.input(usernameInput, { target: { value: "User1" } });
  fireEvent.input(passwordInput, { target: { value: "Password1" } });
  const button = screen.getByRole("button");
  fireEvent.click(button);
  await waitFor(() => expect(mockedUsedNavigate).toHaveBeenCalled());
});

test("login page with incorrect credentials", async () => {
  const handlers = [
    rest.post(postLogin, (_req, res, ctx) => {
      return res(ctx.status(401), ctx.delay(50));
    }),
  ];
  server.use(...handlers);
  jest.mock("@tanstack/react-query", () => ({
    useQuery: jest.fn().mockReturnValue({ error: "failed", isError: true }),
  }));

  renderWithProviders(<Login />);
  const usernameInput: HTMLInputElement = screen.getByLabelText(/Username/i);
  const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
  fireEvent.input(usernameInput, { target: { value: "User1" } });
  fireEvent.input(passwordInput, { target: { value: "Password1" } });
  const button = screen.getByRole("button");
  fireEvent.click(button);
  jest.useFakeTimers();
  await Promise.resolve().then(() => jest.advanceTimersByTime(100));
  expect(mockedUsedNavigate).not.toHaveBeenCalled();
  // ToDo: get below passing
  // expect(await screen.findByText(/Error/i)).toBeInTheDocument();
});
