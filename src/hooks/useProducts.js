import { useState, useEffect, useRef, useCallback } from 'react';
import { searchProducts, getProductsByCategory } from '../services/api';

const PAGE_SIZE = 24;

/**
 * Hook for managing the product list with search, category filter, pagination, and sort.
 */
export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const abortControllerRef = useRef(null);
  const isFirstLoad = useRef(true);

  /**
   * Fetch products (new search or category — resets the list).
   */
  const fetchProducts = useCallback(async (query, cat, pageNum = 1, append = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    if (!append) {
      setLoading(true);
    }
    setError(null);

    try {
      let result;

      if (cat) {
        // Category-based fetch
        result = await getProductsByCategory(cat, pageNum, PAGE_SIZE, signal);
      } else {
        // Search-based fetch (empty query returns popular products)
        result = await searchProducts(query || '', pageNum, PAGE_SIZE, signal);
      }

      const newProducts = result.products.filter((p) => p.name && p.name !== 'Unknown Product');

      if (append) {
        setProducts((prev) => [...prev, ...newProducts]);
      } else {
        setProducts(newProducts);
      }

      setTotalCount(result.count);
      setHasMore(pageNum * PAGE_SIZE < result.count && newProducts.length > 0);
      setPage(pageNum);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. The server might be busy — please try again.');
      if (!append) setProducts([]);
    } finally {
      setLoading(false);
      if (isFirstLoad.current) {
        setInitialLoading(false);
        isFirstLoad.current = false;
      }
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts('', '', 1, false);
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [fetchProducts]);

  /**
   * Search handler — called when debounced search query changes.
   */
  const search = useCallback((query) => {
    setSearchQuery(query);
    setCategory('');
    setSortBy('default');
    fetchProducts(query, '', 1, false);
  }, [fetchProducts]);

  /**
   * Category filter handler.
   */
  const filterByCategory = useCallback((cat) => {
    setCategory(cat);
    setSearchQuery('');
    setSortBy('default');
    fetchProducts('', cat, 1, false);
  }, [fetchProducts]);

  /**
   * Load next page (infinite scroll trigger).
   */
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    fetchProducts(searchQuery, category, page + 1, true);
  }, [loading, hasMore, searchQuery, category, page, fetchProducts]);

  /**
   * Sort the currently loaded products client-side.
   */
  const sort = useCallback((sortKey) => {
    setSortBy(sortKey);
    setProducts((prev) => {
      const sorted = [...prev];
      switch (sortKey) {
        case 'name-asc':
          sorted.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          sorted.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'grade-asc':
          sorted.sort((a, b) => gradeValue(a.nutritionGrade) - gradeValue(b.nutritionGrade));
          break;
        case 'grade-desc':
          sorted.sort((a, b) => gradeValue(b.nutritionGrade) - gradeValue(a.nutritionGrade));
          break;
        default:
          break;
      }
      return sorted;
    });
  }, []);

  return {
    products,
    loading,
    initialLoading,
    error,
    hasMore,
    totalCount,
    searchQuery,
    category,
    sortBy,
    search,
    filterByCategory,
    loadMore,
    sort,
  };
}

function gradeValue(grade) {
  const map = { a: 1, b: 2, c: 3, d: 4, e: 5 };
  return map[grade] || 6;
}
