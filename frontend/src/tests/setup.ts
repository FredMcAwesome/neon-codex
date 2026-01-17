import "@testing-library/jest-dom";
import { beforeAll, afterEach, afterAll, vi } from "vitest";
import { server } from "./msw/server";

// Polyfills
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!window.SVGPathElement) {
  // @ts-ignore
  window.SVGPathElement = window.SVGElement || function () {};
}
// @ts-ignore
window.SVGPathElement.prototype.getTotalLength = () => 0;

// Mock Arwes components to avoid animation-related act warnings.
// Native AnimatorGeneralProvider configuration doesn't work because:
// 1. The synchronous requestAnimationFrame mock causes infinite loops in @arwes/animated
// 2. The activate prop doesn't prevent low-level animation frame scheduling
// Module mocks are the only reliable way to bypass Arwes animations in jsdom.
vi.mock("@arwes/react", () => ({
  Animator: ({ children }: { children: any }) => children,
  AnimatorGeneralProvider: ({ children }: { children: any }) => children,
  Animated: ({ children }: { children: any }) => children,
  FrameCorners: () => null,
  FrameLines: () => null,
  FrameHexagon: () => null,
  FrameUnderline: () => null,
  FrameOctagon: () => null,
  Text: ({ children }: { children: any }) => children,
}));

vi.mock("@arwes/react-animator", () => ({
  Animator: ({ children }: { children: any }) => children,
  AnimatorGeneralProvider: ({ children }: { children: any }) => children,
}));

vi.mock("@arwes/react-frames", () => ({
  FrameCorners: () => null,
  FrameLines: () => null,
  FrameHexagon: () => null,
  FrameUnderline: () => null,
}));

vi.mock("@arwes/react-text", () => ({
  Text: ({ children }: { children: any }) => children,
}));

// Revert to non-synchronous requestAnimationFrame as Arwes components seem
// to rely on the async nature of it and a synchronous version causes
// them to fail or not trigger animations correctly
// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  callback(Date.now());
  return 0;
};
global.cancelAnimationFrame = () => {};
window.requestAnimationFrame = global.requestAnimationFrame;
window.cancelAnimationFrame = global.cancelAnimationFrame;

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());
afterAll(() => {
  server.close();
});
