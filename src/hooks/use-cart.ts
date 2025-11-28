import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  shop_id: string; // Crucial: We must ensure items belong to the SAME shop
}

interface Coupon {
  code: string;
  type: "fixed" | "percent";
  value: number;
}
interface CartStore {
  items: CartItem[];
  addItem: (data: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  coupon: Coupon | null;
  applyCoupon: (c: Coupon) => void;
  removeCoupon: () => void;
}

export const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      coupon: null,
      applyCoupon: (c) => set({ coupon: c }),
      removeCoupon: () => set({ coupon: null }),
      addItem: (data: CartItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        // Guard: Don&apos;t allow mixing items from different shops
        if (currentItems.length > 0 && currentItems[0].shop_id !== data.shop_id) {
          const confirmReset = window.confirm(
            "You have items from another shop. Clear cart to add this?"
          );
          if (!confirmReset) return;
          set({ items: [] }); // Clear old shop's items
        }

        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === data.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          });
        } else {
          set({ items: [...get().items, { ...data, quantity: 1 }] });
        }
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
      },

      updateQuantity: (id: string, qty: number) => {
        if (qty < 1) return;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: qty } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalPrice: () => {
        const subtotal = get().items.reduce((total, item) => total + item.price * item.quantity, 0);
        const coupon = get().coupon;

        if (!coupon) return subtotal;

        let discountAmount = 0;
        if (coupon.type === "fixed") {
          discountAmount = coupon.value;
        } else {
          discountAmount = (subtotal * coupon.value) / 100;
        }

        return Math.max(0, subtotal - discountAmount); // Prevent negative total
      },
    }),
    {
      name: 'bizora-cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
);