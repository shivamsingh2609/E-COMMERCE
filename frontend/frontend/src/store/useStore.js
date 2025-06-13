// src/store/useStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAuthSlice } from './auth/auth-slice';

export const useStore = create(
  persist(
    (set, get) => ({
      products: [],
      cart: [],
      isLoading: false,
      selectedCategory: 'all',

      ...createAuthSlice(set, get),

      setSelectedCategory: (category) => set({ selectedCategory: category }),

      fetchProducts: async () => {
        set({ isLoading: true });
        try {
          let url = 'https://dummyjson.com/products';
          if (get().selectedCategory !== 'all') {
            url = `https://dummyjson.com/products/category/${get().selectedCategory}`;
          }
          const res = await fetch(url);
          const data = await res.json();
          set({ products: data.products || data });
        } catch (err) {
          console.error('Failed to fetch products:', err);
          set({ products: [] });
        } finally {
          set({ isLoading: false });
        }
      },

      syncCartToBackend: async () => {
        const { cart, userInfo } = get();
        const token = userInfo?.token;
        console.log('🔍 userInfo in syncCart:', userInfo);
        console.log('🔍 token in syncCart:', token);

        if (!token) {
          console.warn('🟡 Cart not synced: no user token found');
          return;
        }

        const formattedCart = cart.map((item) => ({
          productId: item.productId || item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity ?? 1,
        }));

        console.log('🛒 Cart payload being sent:', formattedCart);

        try {
          const res = await fetch('https://e-commerce-0ong.onrender.com/api/cart/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
            body: JSON.stringify({ items: formattedCart }),
          });

          const contentType = res.headers.get('Content-Type') || '';
          let responseBody;

          if (contentType.includes('application/json')) {
            responseBody = await res.json();
          } else {
            const text = await res.text();
            throw new Error(`Unexpected response format: ${text.slice(0, 100)}...`);
          }

          if (!res.ok) {
            throw new Error(responseBody.message || 'Failed to sync cart');
          }

          console.log('✅ Cart synced successfully');
        } catch (err) {
          console.error('❌ Cart sync failed:', err.message);
        }
      },

      loadCartFromBackend: async () => {
        const { userInfo } = get();
        if (!userInfo) return;

        try {
          const res = await fetch('https://e-commerce-0ong.onrender.com/api/cart', {
            credentials: 'include',
          });

          if (!res.ok) {
            throw new Error(`Failed to load cart: ${res.status}`);
          }

          const data = await res.json();
          const patchedCart = (data.cart || []).map((item) => ({
            ...item,
            quantity: item.quantity ?? 1,
            totalPrice: item.price * (item.quantity ?? 1),
          }));

          set({ cart: patchedCart });
        } catch (err) {
          console.error('Failed to load cart from backend:', err.message);
        }
      },

      addToCart: (product) => {
        const { cart, userInfo, syncCartToBackend } = get();
        const productId = product._id || product.id;
        if (!productId) {
          console.error("❌ Cannot add product without a valid productId:", product);
          return;
        }

        const existing = cart.find((item) => item.productId === productId);

        let updatedCart;
        if (existing) {
          updatedCart = cart.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: (item.quantity + 1) * item.price,
                }
              : item
          );
        } else {
          updatedCart = [
            ...cart,
            {
              productId,
              name: product.title || product.name,
              image: product.thumbnail || product.image,
              price: product.price,
              quantity: 1,
              totalPrice: product.price,
            },
          ];
        }

        set({ cart: updatedCart });

        if (userInfo) syncCartToBackend();
      },

      removeFromCart: (productId) => {
        const { userInfo, syncCartToBackend } = get();
        const updatedCart = get().cart.filter((item) => item.productId !== productId);
        set({ cart: updatedCart });
        if (userInfo) syncCartToBackend();
      },

      updateCartItemQuantity: (productId, quantity) => {
        const { userInfo, syncCartToBackend } = get();
        const updatedCart = get().cart.map((item) =>
          item.productId === productId
            ? { ...item, quantity, totalPrice: item.price * quantity }
            : item
        );
        set({ cart: updatedCart });
        if (userInfo) syncCartToBackend();
      },

      clearCart: (options = {}) => {
        const { userInfo, syncCartToBackend } = get();
        const { skipSync = false } = options;

        if (userInfo && !skipSync) {
          syncCartToBackend();
        }

        set({ cart: [] });
      },
    }),
    {
      name: 'ecommerce-store',
      partialize: (state) => ({
        cart: state.cart,
        userInfo: state.userInfo,
      }),
    }
  )
);
