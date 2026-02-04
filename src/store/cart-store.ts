import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find(
            (i) => i.productId === item.productId
          );

          if (existingItem) {
            // Update quantity if item exists
            const newQuantity = Math.min(
              existingItem.quantity + (item.quantity || 1),
              item.stock
            );
            
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: newQuantity }
                  : i
              ),
              isOpen: true,
            };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                id: `${item.productId}-${Date.now()}`,
                productId: item.productId,
                name: item.name,
                slug: item.slug,
                image: item.image,
                price: item.price,
                quantity: item.quantity || 1,
                stock: item.stock,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.min(quantity, item.stock) }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.productId === productId);
        return item?.quantity || 0;
      },
    }),
    {
      name: "sabarish-metals-cart",
    }
  )
);
