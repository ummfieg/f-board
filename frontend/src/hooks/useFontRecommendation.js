import { useCallback, useEffect, useState } from "react";
import { recommendFont } from "../api/recommendations";
import {
  createRecommendationFromPost,
  createRecommendationFromResponse,
} from "../utils/recommendation";
import {
  shuffleWaitingMessages,
  waitingMessages,
} from "../utils/waitingMessages";

function useFontRecommendation({ isPreviewTab, onError }) {
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [typedRecommendation, setTypedRecommendation] = useState({
    source: "",
    text: "",
  });
  const [waitingMessageIndex, setWaitingMessageIndex] = useState(0);
  const [waitingMessageQueue, setWaitingMessageQueue] = useState(waitingMessages);
  const waitingMessage = waitingMessageQueue[waitingMessageIndex] ?? waitingMessages[0];
  const recommendationReason = recommendation?.reason ?? "";
  const typedRecommendationReason =
    isPreviewTab && typedRecommendation.source === recommendationReason
      ? typedRecommendation.text
      : "";

  const setRecommendationFromPost = useCallback((post) => {
    setRecommendation(createRecommendationFromPost(post));
  }, []);

  const requestRecommendation = useCallback(async (content, { onStart } = {}) => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      onError("게시글 내용을 입력해주세요.");
      return;
    }

    onError("");
    onStart?.();
    setWaitingMessageIndex(0);
    setWaitingMessageQueue(shuffleWaitingMessages());
    setIsRecommending(true);
    setRecommendation(null);

    try {
      const recommendationResponse = await recommendFont({
        text: trimmedContent,
      });

      setRecommendation(createRecommendationFromResponse(recommendationResponse));
    } catch (error) {
      onError(error.message);
    } finally {
      setIsRecommending(false);
    }
  }, [onError]);

  useEffect(() => {
    if (!isRecommending) {
      return undefined;
    }

    const waitingMessageTimer = setInterval(() => {
      setWaitingMessageIndex((currentIndex) => {
        return (currentIndex + 1) % waitingMessageQueue.length;
      });
    }, 4200);

    return () => {
      clearInterval(waitingMessageTimer);
    };
  }, [isRecommending, waitingMessageQueue.length]);

  useEffect(() => {
    if (!isPreviewTab || !recommendationReason) {
      return undefined;
    }

    let currentIndex = 0;

    const typingTimer = setInterval(() => {
      currentIndex += 1;
      setTypedRecommendation({
        source: recommendationReason,
        text: recommendationReason.slice(0, currentIndex),
      });

      if (currentIndex >= recommendationReason.length) {
        clearInterval(typingTimer);
      }
    }, 18);

    return () => {
      clearInterval(typingTimer);
    };
  }, [isPreviewTab, recommendationReason]);

  return {
    isRecommending,
    recommendation,
    requestRecommendation,
    setRecommendationFromPost,
    typedRecommendationReason,
    waitingMessage,
  };
}

export default useFontRecommendation;
