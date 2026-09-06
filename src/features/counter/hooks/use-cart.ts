"use client";

import { useReducer } from "react";

type CartItem = {
  productId: string;
  quantity: number;
};

type CartAction =
  | { type: "add"; productId: string }
  | { type: "decrease"; productId: string }
  | { type: "clear" }
  | { type: "remove"; productId: string };

function cartReducer(items: CartItem[], action: CartAction): CartItem[] {
  if (action.type === "clear") {
    return [];
  }

  const item = items.find((currentItem) => currentItem.productId === action.productId);

  if (action.type === "add") {
    if (!item) {
      return [...items, { productId: action.productId, quantity: 1 }];
    }

    return items.map((currentItem) =>
      currentItem.productId === action.productId
        ? { ...currentItem, quantity: currentItem.quantity + 1 }
        : currentItem,
    );
  }

  if (action.type === "remove" || (action.type === "decrease" && item?.quantity === 1)) {
    return items.filter((currentItem) => currentItem.productId !== action.productId);
  }

  if (action.type === "decrease") {
    return items.map((currentItem) =>
      currentItem.productId === action.productId
        ? { ...currentItem, quantity: currentItem.quantity - 1 }
        : currentItem,
    );
  }

  return items;
}

export function useCart() {
  const [items, dispatch] = useReducer(cartReducer, []);

  return {
    addProduct: (productId: string) => dispatch({ productId, type: "add" }),
    clear: () => dispatch({ type: "clear" }),
    decreaseProduct: (productId: string) => dispatch({ productId, type: "decrease" }),
    items,
    removeProduct: (productId: string) => dispatch({ productId, type: "remove" }),
  };
}
