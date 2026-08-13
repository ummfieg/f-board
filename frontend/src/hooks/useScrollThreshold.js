import { useEffect, useState } from "react";

function useScrollThreshold(threshold = 480) {
  const [isPastThreshold, setIsPastThreshold] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsPastThreshold(window.scrollY > threshold);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, [threshold]);

  return isPastThreshold;
}

export default useScrollThreshold;
