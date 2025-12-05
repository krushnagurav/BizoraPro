import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  shop_id: string;
  variant?: string;
  maxStock?: number;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
}

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon) => void;
  removeCoupon: () => void;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (data) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          const newQty = existingItem.quantity + 1;
          const limit = existingItem.maxStock || 999;
          if (newQty > limit) return;

          return set({
            items: currentItems.map((item) =>
              item.id === data.id ? { ...item, quantity: newQty } : item,
            ),
          });
        }

        set({ items: [...get().items, data] });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      updateQuantity: (id, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i.id === id);
        if (!item) return;

        const limit = item.maxStock || 999;
        if (quantity > limit) return;
        if (quantity < 1) return;

        set({
          items: currentItems.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),

      removeCoupon: () => set({ coupon: null }),

      // 👇 FIXED: Calculate Discount Logic Here
      totalPrice: () => {
        const { items, coupon } = get();
        const subtotal = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );

        if (!coupon) return subtotal;

        let discount = 0;
        if (coupon.type === "percent") {
          discount = (subtotal * coupon.value) / 100;
        } else if (coupon.type === "fixed") {
          discount = coupon.value;
        }

        // Ensure total doesn't go below 0
        return Math.max(0, subtotal - discount);
      },
    }),
    {
      name: "bizorapro-cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
