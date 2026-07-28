/* eslint-disable react-hooks/set-state-in-effect */
"use client"
import { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
import { Product } from "../types/product";

// Define the shape of your context
interface WishContextType {
  wish: Product[];
  addToWish: (product: Product) => void;
  removeFromWish: (productId: number) => void;
  isProductInWishList: (productId: number) => boolean;
}

// Create Context with default value
const WishListContext = createContext<WishContextType | undefined>(undefined);

// Define props for WishListProvider
interface WishListProviderProps {
  children: ReactNode;
}

export const WishListProvider = ({ children }: WishListProviderProps) => {
  const [wish, setWish] = useState<Product[]>([]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const wishData = localStorage.getItem("addToWish");
        if (wishData) {
          setWish(JSON.parse(wishData));
        }
      }
    } catch (error) {
      console.error("Error parsing wishlist data", error);
    }
  }, []);

  const addToWish = useCallback((product: Product) => {
    const existingProduct = wish.find((item) => item.id === product.id);

    if (existingProduct) {
      toast.error("This item is already in your wishlist");
      return;
    }

    const updatedWish = [...wish, product];
    setWish(updatedWish);
    if (typeof window !== "undefined") {
      localStorage.setItem("addToWish", JSON.stringify(updatedWish));
    }
    toast.success(`${product.title || 'Item'} has been added to your wishlist`);
  }, [wish]);

  const removeFromWish = useCallback((productId: number) => {
    const updatedWish = wish.filter((item) => item.id !== productId);
    setWish(updatedWish);
    if (typeof window !== "undefined") {
      localStorage.setItem("addToWish", JSON.stringify(updatedWish));
    }
    toast.success("Item has been removed from your wishlist");
  }, [wish]);

  const isProductInWishList = useCallback((productId: number): boolean => {
    return wish.some((item) => item.id === productId);
  }, [wish]);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ wish, addToWish, removeFromWish, isProductInWishList }),
    [wish, addToWish, removeFromWish, isProductInWishList]
  );

  return (
    <WishListContext.Provider value={value}>
      {children}
    </WishListContext.Provider>
  );
};

// Custom hook to access the wish context
export const useWishList = (): WishContextType => {
  const context = useContext(WishListContext);
  if (context === undefined) {
    throw new Error("useWishList must be used within a WishListProvider");
  }
  return context;
};