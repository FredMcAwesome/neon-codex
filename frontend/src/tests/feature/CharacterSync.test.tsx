import { renderHook, act } from "@testing-library/react";
import { useCharacterDraft } from "../../hooks/useCharacterDraft";
import { createTestQueryClient, createTestTrpcClient } from "../test-utils";
import { trpc } from "../../utils/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { trpcMock } from "../msw/handlers";
import { server } from "../msw/server";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const trpcClient = createTestTrpcClient();
  return ({ children }: { children: React.ReactNode }) => (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </trpc.Provider>
  );
};

describe("Character Sync Logic", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should not sync to server if state is unchanged", async () => {
    const updateSpy = vi.fn(() => ({
      id: 1,
      version: 2,
    }));
    // Spy on create because initial state has no ID
    server.use(trpcMock.character.createDraftCharacter.mutation(updateSpy));

    const { result } = renderHook(() => useCharacterDraft(), {
      wrapper: createWrapper(),
    });

    // Wait for any initial effects?
    await act(async () => {
      vi.advanceTimersByTime(100);
    });

    // Trigger setState with NO changes (same object ref spread or deep same?)
    // Hook implementation uses spreading: { ...prevState, ...newState }
    // passing result.current.state spreads same properties.
    await act(async () => {
      result.current.setState(result.current.state);
    });

    // Advance 5000ms (SERVER_SAVE_DELAY)
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    // Currently this SHOULD fail (it will call create) because we lack comparison logic
    expect(updateSpy).not.toHaveBeenCalled();
  });

  it("should sync to server if state changed", async () => {
    const createSpy = vi.fn(() => ({
      id: 1,
      version: 1,
    }));
    server.use(trpcMock.character.createDraftCharacter.mutation(createSpy));

    const { result } = renderHook(() => useCharacterDraft(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.setState({ nuyen: 100 });
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(createSpy).toHaveBeenCalled();
  });

  it("should not sync if offline", async () => {
    const createSpy = vi.fn();
    server.use(trpcMock.character.createDraftCharacter.mutation(createSpy));

    // Mock Offline
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
    });

    const { result } = renderHook(() => useCharacterDraft(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      result.current.setState({ nuyen: 200 });
    });

    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    // Should fail currently (hook doesn't check offline)
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("should sync when coming online if changes pending", async () => {
    const createSpy = vi.fn(() => ({
      id: 1,
      version: 1,
    }));
    server.use(trpcMock.character.createDraftCharacter.mutation(createSpy));

    // Start offline
    Object.defineProperty(navigator, "onLine", {
      value: false,
      writable: true,
    });

    const { result } = renderHook(() => useCharacterDraft(), {
      wrapper: createWrapper(),
    });

    // Change
    await act(async () => {
      result.current.setState({ nuyen: 300 });
    });

    // Wait
    await act(async () => {
      vi.advanceTimersByTime(5000);
    });

    expect(createSpy).not.toHaveBeenCalled();

    // Go Online
    Object.defineProperty(navigator, "onLine", {
      value: true,
      writable: true,
    });

    // Trigger event
    await act(async () => {
      window.dispatchEvent(new Event("online"));
    });

    // Should sync immediately or soon?
    // Implementation will likely trigger immediately.
    // Wait a bit to be safe?
    await act(async () => {
      // Maybe minimal delay if async
      vi.runAllTicks();
    });

    // Should fail currently (hook doesn't listen to online)
    expect(createSpy).toHaveBeenCalled();
  });
});
