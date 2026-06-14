import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { extractBrandFromProductName } from "@my-bahrain/utils";
import { formatPrice } from "../../lib/format-price";

const CARD_WIDTH = 56;
const CARD_HEIGHT = 68;
const ANIMATION_DURATION_MS = 700;

type FlyToCartPayload = {
  imageUrl?: string;
  name: string;
  price: number;
};

type FlyAnimationItem = FlyToCartPayload & {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
};

type LayoutRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type FlyToCartContextValue = {
  registerCartTarget: (ref: RefObject<HTMLElement> | null) => void;
  flyToCartFromElement: (
    sourceRef: RefObject<HTMLElement>,
    payload: FlyToCartPayload,
  ) => void;
};

const FlyToCartContext = createContext<FlyToCartContextValue | null>(null);

function measureElement(ref: RefObject<HTMLElement>): LayoutRect | null {
  if (!ref.current) {
    return null;
  }

  const rect = ref.current.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

function centerOf(rect: LayoutRect) {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
  };
}

function MiniFlyingProductCard({
  imageUrl,
  name,
  price,
}: FlyToCartPayload) {
  const brand = extractBrandFromProductName(name);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg">
      <div className="flex h-10 items-center justify-center overflow-hidden bg-[#F5F5F5]">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-lg">⌚</span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center px-1 py-1">
        <p className="truncate text-[8px] font-bold text-gray-900">{brand}</p>
        <p className="truncate text-[7px] font-semibold text-gray-500">{formatPrice(price)}</p>
      </div>
    </div>
  );
}

function FlyingItem({
  item,
  onComplete,
}: {
  item: FlyAnimationItem;
  onComplete: () => void;
}) {
  const [transform, setTransform] = useState({
    x: item.startX,
    y: item.startY,
    scale: 1,
    opacity: 1,
  });

  useEffect(() => {
    const start = performance.now();
    let frameId = 0;

    function frame(now: number) {
      const progress = Math.min((now - start) / ANIMATION_DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;

      setTransform({
        x: item.startX + (item.endX - item.startX) * eased,
        y: item.startY + (item.endY - item.startY) * eased,
        scale: 1 - eased * 0.78,
        opacity: progress > 0.85 ? 1 - (progress - 0.85) / 0.15 : 1,
      });

      if (progress < 1) {
        frameId = requestAnimationFrame(frame);
        return;
      }

      onComplete();
    }

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [item, onComplete]);

  return (
    <div
      className="absolute will-change-transform"
      style={{
        left: 0,
        top: 0,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
        opacity: transform.opacity,
      }}
    >
      <MiniFlyingProductCard
        imageUrl={item.imageUrl}
        name={item.name}
        price={item.price}
      />
    </div>
  );
}

function FlyingProductOverlay({
  items,
  onItemComplete,
}: {
  items: FlyAnimationItem[];
  onItemComplete: (id: string) => void;
}) {
  if (items.length === 0 || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      {items.map((item) => (
        <FlyingItem
          key={item.id}
          item={item}
          onComplete={() => onItemComplete(item.id)}
        />
      ))}
    </div>,
    document.body,
  );
}

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const cartTargetRef = useRef<RefObject<HTMLElement> | null>(null);
  const [items, setItems] = useState<FlyAnimationItem[]>([]);

  const registerCartTarget = useCallback((ref: RefObject<HTMLElement> | null) => {
    cartTargetRef.current = ref;
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const flyToCartFromElement = useCallback(
    (sourceRef: RefObject<HTMLElement>, payload: FlyToCartPayload) => {
      const sourceLayout = measureElement(sourceRef);

      let startX = window.innerWidth / 2 - CARD_WIDTH / 2;
      let startY = window.innerHeight - 140;

      if (sourceLayout) {
        const sourceCenter = centerOf(sourceLayout);
        startX = sourceCenter.x - CARD_WIDTH / 2;
        startY = sourceCenter.y - CARD_HEIGHT / 2;
      }

      let endCenterX = window.innerWidth - 28;
      let endCenterY = 28;

      const cartRef = cartTargetRef.current;
      const cartLayout = cartRef ? measureElement(cartRef) : null;
      if (cartLayout) {
        const cartCenter = centerOf(cartLayout);
        endCenterX = cartCenter.x;
        endCenterY = cartCenter.y;
      }

      const endX = endCenterX - CARD_WIDTH / 2;
      const endY = endCenterY - CARD_HEIGHT / 2;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setItems((current) => [
        ...current,
        {
          id,
          startX,
          startY,
          endX,
          endY,
          ...payload,
        },
      ]);
    },
    [],
  );

  const value = useMemo(
    () => ({
      registerCartTarget,
      flyToCartFromElement,
    }),
    [registerCartTarget, flyToCartFromElement],
  );

  return (
    <FlyToCartContext.Provider value={value}>
      {children}
      <FlyingProductOverlay items={items} onItemComplete={removeItem} />
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const context = useContext(FlyToCartContext);

  if (!context) {
    throw new Error("useFlyToCart must be used inside FlyToCartProvider");
  }

  return context;
}
