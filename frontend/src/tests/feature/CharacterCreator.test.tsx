import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import CharacterCreator from "../../components/character/creator/CharacterCreator";
import { renderWithProviders, settle } from "../test-utils.js";
import { act } from "react";

// Mock the external hook
vi.mock("../../hooks/useEquipmentSearch", () => ({
  useEquipmentSearch: vi.fn().mockReturnValue({
    results: [],
    total: 0,
    isReady: true,
    isSearching: false,
    search: vi.fn(),
  }),
  initEquipmentWorker: vi.fn(),
  getWorker: vi.fn().mockReturnValue({
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
  waitForWorkerReady: vi.fn().mockResolvedValue(undefined),
}));

describe("CharacterCreator", () => {
  it("renders the character creator navigation and first step", async () => {
    const { queryClient } = renderWithProviders(<CharacterCreator />);

    // Wait for initial queries to settle
    await settle(queryClient);

    // Check for navigation items
    expect(screen.getByText(/Priority List Select/i)).toBeInTheDocument();
    expect(screen.getByText(/Karma Remaining: 25/i)).toBeInTheDocument();

    // Check we are on the first step (Priority List Select)
    // Priority select table headers
    expect(await screen.findByText("Heritage")).toBeInTheDocument();
    expect(await screen.findByText("Human")).toBeInTheDocument();
    expect(screen.getByText("Attributes")).toBeInTheDocument();
    expect(screen.getByText("Talent")).toBeInTheDocument();

    // Check for "Next" button
    expect(
      await screen.findByRole("button", { name: /next/i })
    ).toBeInTheDocument();

    await settle(queryClient);
  });

  it("navigates to the next step when Next is clicked", async () => {
    const { user, queryClient } = renderWithProviders(<CharacterCreator />);

    // Wait for initial queries to settle
    await settle(queryClient);

    const nextButton = await screen.findByRole("button", { name: /next/i });
    await act(async () => {
      await user.click(nextButton);
    });
    await settle(queryClient);

    // Should now be on Attribute List Select
    // Check for active class on nav or specific element of Attributes page
    // Using string matching for class might be brittle, let's look for unique content.
    // AttributeListSelect likely has "Body", "Agility" inputs or similar.
    await waitFor(() => {
      expect(screen.getByText(/Attribute List Select/i)).toBeInTheDocument();
    });
    expect(await screen.findByText("Body")).toBeInTheDocument();
    expect(await screen.findByText("Agility")).toBeInTheDocument();

    await settle(queryClient);
  });
  it("allows selecting a heritage", async () => {
    const { user, queryClient } = renderWithProviders(<CharacterCreator />);

    // Wait for initial queries to settle
    await settle(queryClient);

    await screen.findByText("Heritage");

    // Find Heritage Options select. It should initially have value "Human"
    // We can find it by display value or by the options it contains.
    const humanOption = await screen.findByRole("option", { name: "Human" });
    const selectElement = humanOption.closest("select");

    if (!selectElement) throw new Error("Heritage select not found");

    await act(async () => {
      await user.selectOptions(selectElement, "Elf");
    });

    // Check if value updated
    expect(selectElement).toHaveValue("Elf");

    // Navigate to next
    const nextButton = await screen.findByRole("button", { name: /next/i });
    await act(async () => {
      await user.click(nextButton);
    });
    await settle(queryClient);

    // Verify Heritage header in Attribute step shows "Elf"
    // In AttributesSelect.tsx: Heritage: <span id="heritage">{props.heritageInfo.heritage}</span>
    // We can look for text "Heritage: Elf" or just "Elf" (assuming "Elf" is unique enough or we expect it)
    expect(await screen.findByText("Elf")).toBeInTheDocument();

    await settle(queryClient);
  });

  it("updates attribute points when attribute is changed", async () => {
    const { user, queryClient } = renderWithProviders(<CharacterCreator />);

    // Wait for initial queries to settle
    await settle(queryClient);

    await screen.findByText("Heritage");
    const nextButton = await screen.findByRole("button", { name: /next/i });
    await act(async () => {
      await user.click(nextButton);
    });
    await settle(queryClient);

    expect(
      await screen.findByText("Attribute Points Remaining:")
    ).toBeInTheDocument();

    // Check initial points (mock has 24 for all priorities)
    // We expect text "24" inside the span.
    // However, findByText("24") finds the element containing 24.
    expect(await screen.findByText("24")).toBeInTheDocument();

    const bodyLabel = screen.getByText("Body");
    const bodyCard = bodyLabel.closest(".attribute-card");
    if (!bodyCard) throw new Error("Body card not found");

    const bodySelect = bodyCard.querySelector("select");
    if (!bodySelect) throw new Error("Body select not found");

    // Change body to 2. Attribute cost is 1 point per level increase?
    // Wait, body starts at what?
    // In CharacterCreator: const [attributeInfo, setAttributeInfo] = useState<AttributesType>({ body: 1, ... });
    // So starts at 1. Change to 2. Difference is 1.
    // Points remaining 24 - 1 = 23.
    await act(async () => {
      await user.selectOptions(bodySelect, "2");
    });

    // Verify points updated to 23
    expect(await screen.findByText("23")).toBeInTheDocument();

    await settle(queryClient);
  });
});
