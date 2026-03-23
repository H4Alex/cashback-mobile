import React from "react";
import { render, act } from "@testing-library/react-native";
import { AnimatedCounter } from "@/src/components/AnimatedCounter";

// Jest timers for testing setTimeout-based animation
jest.useFakeTimers();

describe("AnimatedCounter", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("renders with initial value 0 formatted", () => {
    const { getByText } = render(<AnimatedCounter value={1000} />);
    // Initially shows formatted 0 (before animation completes)
    expect(getByText(/0,00/)).toBeTruthy();
  });

  it("renders with prefix and suffix", () => {
    const { getByText } = render(<AnimatedCounter value={100} prefix="R$ " suffix=" BRL" />);
    // Initially shows prefix + 0 formatted + suffix
    expect(getByText(/R\$ /)).toBeTruthy();
  });

  it("updates display after animation duration", () => {
    const { getByText } = render(<AnimatedCounter value={1234.56} duration={500} />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    // After duration, should show formatted value: 1.234,56
    expect(getByText("1.234,56")).toBeTruthy();
  });

  it("formats large numbers with dot separators", () => {
    const { getByText } = render(<AnimatedCounter value={1000000} duration={100} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // Default decimals=2, formats as "1.000.000,00"
    expect(getByText("1.000.000,00")).toBeTruthy();
  });

  it("formats correctly with decimals=0 (no comma)", () => {
    const { getByText } = render(<AnimatedCounter value={1500} duration={100} decimals={0} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // With decimals=0, should show "1.500" without trailing comma
    expect(getByText("1.500")).toBeTruthy();
  });

  it("respects custom decimals", () => {
    const { getByText } = render(<AnimatedCounter value={42.5} duration={100} decimals={1} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(getByText("42,5")).toBeTruthy();
  });

  it("updates when value changes", () => {
    const { getByText, rerender } = render(<AnimatedCounter value={100} duration={100} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(getByText("100,00")).toBeTruthy();

    rerender(<AnimatedCounter value={200} duration={100} />);
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(getByText("200,00")).toBeTruthy();
  });
});
