import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import type { Id } from "../../../../../convex/_generated/dataModel";

export type MobileCartItem = {
  productId: Id<"products">;
  storeId: Id<"stores">;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

type CartContextValue = {
  items: MobileCartItem[];
  addItem: (item: Omit<MobileCartItem, "quantity">) => void;
  removeItem: (productId: Id<"products">) => void;
  updateQuantity: (productId: Id<"products">, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function MobileCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MobileCartItem[]>([]);

  function addItem(item: Omit<MobileCartItem, "quantity">) {
    setItems((current) => {
      const existing = current.find((x) => x.productId === item.productId);

      if (existing) {
        return current.map((x) =>
          x.productId === item.productId
            ? { ...x, quantity: x.quantity + 1 }
            : x,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeItem(productId: Id<"products">) {
    setItems((current) => current.filter((x) => x.productId !== productId));
  }

  function updateQuantity(productId: Id<"products">, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((current) =>
      current.map((x) => (x.productId === productId ? { ...x, quantity } : x)),
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useMobileCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useMobileCart must be used inside MobileCartProvider");
  }

  return context;
}
