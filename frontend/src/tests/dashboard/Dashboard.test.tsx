import { screen } from "@testing-library/react";
import Dashboard from "../../components/dashboard/Dashboard.js";
import { renderWithProviders } from "../../utils/TestingUtils.js";

test("Dashboard page default display", async () => {
  renderWithProviders(<Dashboard />);

  expect(screen.getByText(/forum/i)).toBeInTheDocument();
});
