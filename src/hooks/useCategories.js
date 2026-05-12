import { useState, useEffect, useRef, useCallback } from 'react';
import { getCategories } from '../services/api';

/**
 * Hook to fetch and cache the categories list.
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);

  const fetchCategories = useCallback(async () => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories');
      // Provide fallback popular categories
      setCategories([
        { id: 'en:beverages', name: 'Beverages', products: 0 },
        { id: 'en:dairies', name: 'Dairies', products: 0 },
        { id: 'en:snacks', name: 'Snacks', products: 0 },
        { id: 'en:cereals-and-potatoes', name: 'Cereals & Potatoes', products: 0 },
        { id: 'en:meats', name: 'Meats', products: 0 },
        { id: 'en:frozen-foods', name: 'Frozen Foods', products: 0 },
        { id: 'en:meals', name: 'Meals', products: 0 },
        { id: 'en:fruits', name: 'Fruits', products: 0 },
        { id: 'en:vegetables-based-foods', name: 'Vegetables', products: 0 },
        { id: 'en:desserts', name: 'Desserts', products: 0 },
        { id: 'en:chocolates', name: 'Chocolates', products: 0 },
        { id: 'en:breads', name: 'Breads', products: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error };
}
