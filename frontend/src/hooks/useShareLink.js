import { useEffect, useRef, useState } from "react";

function getConfiguredShareOrigin() {
  const configuredSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();

  if (!configuredSiteUrl) {
    return "";
  }

  return configuredSiteUrl.replace(/\/+$/, "");
}

function buildShareUrl() {
  const configuredShareOrigin = getConfiguredShareOrigin();
  const currentPath = [
    window.location.pathname,
    window.location.search,
    window.location.hash,
  ].join("");

  if (!configuredShareOrigin) {
    return window.location.href;
  }

  try {
    return new URL(currentPath, `${configuredShareOrigin}/`).toString();
  } catch {
    return window.location.href;
  }
}

function copyTextWithTextarea(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();

  const isCopySuccessful = document.execCommand("copy");

  document.body.removeChild(textarea);

  if (!isCopySuccessful) {
    throw new Error("텍스트 복사에 실패했습니다.");
  }
}

async function copyShareUrl() {
  const shareUrl = buildShareUrl();

  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(shareUrl);
      return;
    } catch {
      copyTextWithTextarea(shareUrl);
      return;
    }
  }

  copyTextWithTextarea(shareUrl);
}

function useShareLink({
  failureMessage = "복사하지 못했어요",
  messageDuration = 1600,
  successMessage = "링크가 복사되었습니다.",
} = {}) {
  const [shareMessage, setShareMessage] = useState("");
  const shareMessageTimerRef = useRef(null);

  const showShareMessage = (message) => {
    setShareMessage(message);

    if (shareMessageTimerRef.current) {
      clearTimeout(shareMessageTimerRef.current);
    }

    shareMessageTimerRef.current = setTimeout(() => {
      setShareMessage("");
    }, messageDuration);
  };

  const copyShareLink = async () => {
    try {
      await copyShareUrl();
      showShareMessage(successMessage);
    } catch {
      showShareMessage(failureMessage);
    }
  };

  useEffect(() => {
    return () => {
      if (shareMessageTimerRef.current) {
        clearTimeout(shareMessageTimerRef.current);
      }
    };
  }, []);

  return {
    copyShareLink,
    shareMessage,
  };
}

export default useShareLink;
