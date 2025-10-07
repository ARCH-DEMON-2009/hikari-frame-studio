import { useEffect } from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  slug: string;
}

export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product: Product) => {
    const recent = getRecentlyViewed();
    const filtered = recent.filter(p => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, 10);
    localStorage.setItem('hikari-recently-viewed', JSON.stringify(updated));
  };

  const getRecentlyViewed = (): Product[] => {
    try {
      const stored = localStorage.getItem('hikari-recently-viewed');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  return { addToRecentlyViewed, getRecentlyViewed };
};
