import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import SortControls from '../components/SortControls';
import ProductGrid from '../components/ProductGrid';

export default function HomePage() {
  const {
    products,
    loading,
    initialLoading,
    error,
    hasMore,
    totalCount,
    category,
    sortBy,
    search,
    filterByCategory,
    loadMore,
    sort,
  } = useProducts();

  const { categories, loading: catLoading } = useCategories();
  const navigate = useNavigate();

  const handleSearch = useCallback((query) => {
    search(query);
  }, [search]);

  const handleBarcodeSearch = useCallback((barcode) => {
    // Navigate directly to the product detail page for the barcode
    navigate(`/product/${barcode}`);
  }, [navigate]);

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative pt-3xl pb-2xl px-margin-mobile md:px-margin-desktop overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent blur-3xl -z-10"></div>
        <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
          <h1 className="font-display-lg text-[32px] md:text-display-lg mb-md">
            Discover <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Food Products</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-[600px]">
            Explore nutrition facts, ingredients, and scores for millions of products worldwide through our high-performance clinical database.
          </p>
          
          <div className="w-full">
            <SearchBar onSearch={handleSearch} onBarcodeSearch={handleBarcodeSearch} />
          </div>
        </div>
      </section>

      {/* Controls Row */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto mb-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-md py-md border-y border-white/5">
          <div className="flex flex-wrap items-center gap-md w-full md:w-auto">
            <CategoryFilter
              categories={categories}
              selected={category}
              onSelect={filterByCategory}
              loading={catLoading}
            />
            <SortControls sortBy={sortBy} onSort={sort} />
          </div>
          <div className="font-body-sm text-body-sm text-on-surface-variant w-full md:w-auto text-left md:text-right">
            Showing <span className="text-on-surface font-bold">{products.length}</span> {totalCount > 0 && `of ${totalCount.toLocaleString()}`} products
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto pb-3xl">
        <ProductGrid
          products={products}
          loading={loading}
          initialLoading={initialLoading}
          error={error}
          hasMore={hasMore}
          onLoadMore={loadMore}
        />
      </section>
    </main>
  );
}
