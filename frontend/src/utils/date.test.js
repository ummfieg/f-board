import { describe, expect, it } from "vitest";

import {
  formatBoardPostDate,
  formatCommentDateTime,
  formatPostDetailDateTime,
} from "./date";

describe("date format utilities", () => {
  it("returns an empty value for invalid board post dates", () => {
    expect(formatBoardPostDate("invalid-date")).toBe("");
  });

  it("formats board post dates for list cards", () => {
    expect(formatBoardPostDate("2026-09-15T03:04:00.000Z")).toBe(
      "Sep 15, 2026",
    );
  });

  it("returns empty date parts for invalid detail dates", () => {
    expect(formatPostDetailDateTime("invalid-date")).toEqual({
      date: "",
      dateTime: "",
      time: "",
    });
  });

  it("formats comment dates with fixed-width date and time parts", () => {
    const result = formatCommentDateTime("2026-09-15T03:04:00.000Z");

    expect(result.dateTime).toBe("2026-09-15T03:04:00.000Z");
    expect(result.date).toMatch(/^\d{4}\.\d{2}\.\d{2}$/);
    expect(result.time).toMatch(/^\d{2}:\d{2}$/);
  });
});
