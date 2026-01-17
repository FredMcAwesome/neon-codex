import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import App from "../../App";
import { saveUserSession } from "../../components/login/loginHelper";
import { describe, it, expect, beforeEach, vi } from "vitest";

describe("Logout Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("redirects to login page after logout", async () => {
    // Setup authenticated state
    saveUserSession("fake-token", "user");

    // Render App at dashboard (protected route)
    // dashboardPath is "/"
    const { user } = renderWithProviders(<App />, { initialEntries: ["/"] });

    // Verify Dashboard loaded (check for Logout button which is in Nav)
    await waitFor(() => {
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    // Click Logout
    const logoutBtn = screen.getByText("Logout");
    await user.click(logoutBtn);

    // Expect Redirect to Login
    // Login page has label "Username"
    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    });

    // Verify token is gone (clearUserSession sets to empty string)
    expect(localStorage.getItem("token")).toBe("");
  });
});
