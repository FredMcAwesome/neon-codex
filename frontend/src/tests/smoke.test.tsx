import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function HelloWorld() {
  return <h1>Hello World</h1>;
}

describe("Frontend Smoke Test", () => {
  it("should pass basic arithmetic", () => {
    expect(1 + 1).toBe(2);
  });

  it("should render a component", () => {
    render(<HelloWorld />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
