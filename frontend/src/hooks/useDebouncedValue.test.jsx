import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import useDebouncedValue from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value before the delay passes", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      {
        initialProps: {
          value: "first",
        },
      },
    );

    rerender({ value: "second" });

    expect(result.current).toBe("first");

    act(() => {
      vi.advanceTimersByTime(299);
    });

    expect(result.current).toBe("first");
  });

  it("updates to the latest value after the delay passes", () => {
    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 300),
      {
        initialProps: {
          value: "first",
        },
      },
    );

    rerender({ value: "second" });
    rerender({ value: "third" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("third");
  });
});
