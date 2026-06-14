import { useEffect, useMemo, useState } from "react";
import {
  PRODUCT_SEARCH_PLACEHOLDER_INTERVAL_MS,
  productSearchPlaceholder,
} from "@my-bahrain/utils";

const FADE_MS = 280;

export function useRotatingCategoryPlaceholder(categoryNames: string[]) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const namesKey = useMemo(() => categoryNames.join("|"), [categoryNames]);

  useEffect(() => {
    setIndex(0);
    setVisible(true);
  }, [namesKey]);

  useEffect(() => {
    if (categoryNames.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setVisible(false);

      window.setTimeout(() => {
        setIndex((current) => (current + 1) % categoryNames.length);
        setVisible(true);
      }, FADE_MS);
    }, PRODUCT_SEARCH_PLACEHOLDER_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
    };
  }, [categoryNames.length, namesKey]);

  const placeholder =
    categoryNames.length > 0
      ? productSearchPlaceholder(categoryNames[index] ?? categoryNames[0]!)
      : "Search products…";

  return { placeholder, visible };
}
