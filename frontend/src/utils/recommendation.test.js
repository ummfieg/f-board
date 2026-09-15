import { describe, expect, it } from "vitest";

import {
  createRecommendationFromPost,
  createRecommendationFromResponse,
} from "./recommendation";

describe("recommendation normalizers", () => {
  it("normalizes persisted post font fields from snake_case data", () => {
    const recommendation = createRecommendationFromPost({
      recommend_reason: "차분한 문장이라 단정한 글꼴이 어울립니다.",
      font: {
        category: "serif",
        download_url: "https://example.com/download",
        id: "font-1",
        is_paid: false,
        license: "free",
        license_summary: ["personal", "commercial"],
        name: "Example Serif",
        source: "noonnu",
        source_url: "https://example.com/font",
        tags: ["calm"],
        webfonts: [
          {
            url: "https://example.com/font.woff2",
            weight: 400,
          },
        ],
      },
    });

    expect(recommendation).toMatchObject({
      downloadUrl: "https://example.com/download",
      id: "font-1",
      isDefaultFontApplied: false,
      isPaid: false,
      license: "free",
      licenseSummary: ["personal", "commercial"],
      name: "Example Serif",
      reason: "차분한 문장이라 단정한 글꼴이 어울립니다.",
      source: "noonnu",
      sourceUrl: "https://example.com/font",
      tags: ["calm"],
      usage: "serif",
    });
    expect(recommendation.previewFontStyle.fontFamily).toContain("fboard");
  });

  it("falls back to default font values when font data is missing", () => {
    const recommendation = createRecommendationFromResponse({
      selection: {
        display_reason: "기본 서체로도 충분히 읽기 좋습니다.",
        font_id: "fallback-id",
      },
    });

    expect(recommendation).toMatchObject({
      downloadUrl: "",
      id: "fallback-id",
      isDefaultFontApplied: true,
      license: "",
      licenseSummary: [],
      name: "",
      reason: "기본 서체로도 충분히 읽기 좋습니다.",
      source: "",
      tags: [],
      usage: "",
      webfonts: [],
    });
    expect(recommendation.previewFontStyle).toEqual({
      fontFamily: "\"Pretendard\", sans-serif",
    });
  });
});
