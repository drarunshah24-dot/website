"use client";

import { useState, useEffect } from "react";

export function useScroll(threshold = 0) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Check on mount

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  return isScrolled;
}
