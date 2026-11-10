import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { EquipmentSelect } from "../../components/character/creator/equipment/EquipmentSelect.js";
import { useEquipmentSearch } from "../../hooks/useEquipmentSearch.js";
import { trpc } from "../../utils/trpc.js";
import { ThemeContextProvider } from "../../context/ThemeContext.js";
import {
  createTestQueryClient,
  createTestTrpcClient,
  settle,
} from "../test-utils.js";

vi.mock("../../hooks/useEquipmentSearch", () => ({
  useEquipmentSearch: vi.fn(),
  initEquipmentWorker: vi.fn(),
  getWorker: vi.fn().mockReturnValue({
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
  waitForWorkerReady: vi.fn().mockResolvedValue(undefined),
}));

const mockSearchState = (overrides: object = {}) => ({
  search: vi.fn(),
  results: [],
  total: 0,
  details: undefined,
  isReady: true,
  isSearching: false,
  error: undefined,
  ...overrides,
});

const baseProps = {
  equipmentSelections: {
    equipmentPackList: [],
    weaponList: [],
    gearList: [],
    armourList: [],
    augmentationList: [],
    vehicleList: [],
  },
  setEquipmentSelections: vi.fn(),
  nuyen: 1000,
  setNuyen: vi.fn(),
  essencePoints: 6,
  setEssencePoints: vi.fn(),
  bonusInfo: [],
  setBonusInfo: vi.fn(),
};

// Replay full provider tree to preserve component state across rerenders
function renderEquipment() {
  const queryClient = createTestQueryClient();
  const trpcClient = createTestTrpcClient();
  // Build fresh tree per render so hooks re-run
  const buildTree = () => (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ThemeContextProvider>
            <EquipmentSelect {...baseProps} />
          </ThemeContextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
  const rendered = render(buildTree());
  return {
    ...rendered,
    queryClient,
    update: () => rendered.rerender(buildTree()),
  };
}

describe("EquipmentSelect loading states", () => {
  it("shows a full-area spinner while the first search is in flight", async () => {
    vi.mocked(useEquipmentSearch).mockReturnValue(
      mockSearchState({ isSearching: true }) as never
    );
    const { queryClient } = renderEquipment();
    await settle(queryClient);
    expect(screen.getByText("Loading equipment...")).toBeInTheDocument();
    // Results list is not shown yet (no misleading "No items found").
    expect(screen.queryByText("No items found.")).not.toBeInTheDocument();
    await settle(queryClient);
  });

  it("shows a non-blocking overlay on refetch once results have loaded", async () => {
    vi.mocked(useEquipmentSearch).mockReturnValue(
      mockSearchState({ isSearching: false }) as never
    );
    const { queryClient, update } = renderEquipment();
    await settle(queryClient);

    // First search completed with empty results -> list view, no spinners.
    expect(await screen.findByText("No items found.")).toBeInTheDocument();
    expect(screen.queryByText("Loading equipment...")).not.toBeInTheDocument();
    expect(screen.queryByText("Searching...")).not.toBeInTheDocument();

    // Refetch in flight -> overlay over the stale (empty) list.
    vi.mocked(useEquipmentSearch).mockReturnValue(
      mockSearchState({ isSearching: true }) as never
    );
    update();
    await settle(queryClient);
    expect(screen.getByText("Searching...")).toBeInTheDocument();
    expect(screen.getByText("No items found.")).toBeInTheDocument();

    // Refetch resolved -> overlay clears.
    vi.mocked(useEquipmentSearch).mockReturnValue(
      mockSearchState({ isSearching: false }) as never
    );
    update();
    await settle(queryClient);
    expect(screen.queryByText("Searching...")).not.toBeInTheDocument();
    await settle(queryClient);
  });
});
