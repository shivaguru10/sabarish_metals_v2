import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
  
  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  
  // Computed
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          // Check if already in wishlist
          if (state.items.some((i) => i.productId === item.productId)) {
            return state;
          }
          
          return {
            items: [...state.items, item],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "sabarish-metals-wishlist",
    }
  )
);
