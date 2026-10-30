import { Font, WebFont } from "../types/font";

const fallbackFontFamily = '"Pretendard", sans-serif';

function createWebFontFamilyName(font: Font) {
  const fontId = font?.id ?? "unknown";
  const fontName = font?.name ?? "font";

  return `fboard-${fontId}-${fontName}`.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function hasValidWebFontUrl(webfont: WebFont) {
  return typeof webfont.url === "string" && webfont.url.trim() !== "";
}

function getRegularWebFont(font: Font) {
  const webfonts = Array.isArray(font?.webfonts) ? font.webfonts : [];
  const regularWebFont = webfonts.find((webfont) => {
    return hasValidWebFontUrl(webfont) && Number(webfont.weight) === 400;
  });

  if (regularWebFont) {
    return regularWebFont;
  }

  return webfonts.find((webfont) => hasValidWebFontUrl(webfont));
}

function getWebFontUrl(font: Font) {
  const firstWebFont = getRegularWebFont(font);

  return firstWebFont?.url.trim() ?? null;
}

export function hasWebFontUrl(font: Font) {
  return Boolean(getWebFontUrl(font));
}

function getWebFontWeight(font: Font) {
  const firstWebFont = getRegularWebFont(font);

  return firstWebFont?.weight ?? 400;
}

export function registerWebFont(font: Font) {
  const fontUrl = getWebFontUrl(font);

  if (!fontUrl || typeof document === "undefined") {
    return null;
  }

  const fontFamily = createWebFontFamilyName(font);
  const styleId = `webfont-${fontFamily}`;

  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = `
@font-face {
  font-family: "${fontFamily}";
  src: url("${fontUrl}");
  font-weight: ${getWebFontWeight(font)};
  font-style: normal;
  font-display: swap;
}
`;

    document.head.appendChild(styleElement);
  }

  return fontFamily;
}

export function createWebFontStyle(font: Font) {
  const fontFamily = registerWebFont(font);

  if (!fontFamily) {
    return {
      fontFamily: fallbackFontFamily,
    };
  }

  return {
    fontFamily: `"${fontFamily}", "Pretendard", sans-serif`,
    fontWeight: 400,
  };
}
