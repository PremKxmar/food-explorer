import { useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import Skeleton from './Skeleton';

export default function ProductGrid({ products, loading, initialLoading, error, hasMore, onLoadMore }) {
  const observer = useRef();
  
  const lastProductRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { rootMargin: '200px' });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  if (initialLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {Array(8).fill(0).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="text-center py-3xl px-md max-w-lg mx-auto bg-error-container/10 border border-error/20 rounded-xl">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="font-headline-sm text-on-surface mb-2">Failed to load products</h2>
        <p className="font-body-md text-on-surface-variant mb-lg">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-error text-on-error px-lg py-2 rounded-lg font-label-md hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-3xl">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant/50 mb-4">search_off</span>
        <h2 className="font-headline-md text-on-surface mb-2">No products found</h2>
        <p className="font-body-md text-on-surface-variant">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {products.map((product, index) => {
          if (products.length === index + 1) {
            return (
              <div ref={lastProductRef} key={`${product.id}-${index}`}>
                <ProductCard product={product} />
              </div>
            );
          } else {
            return <ProductCard key={`${product.id}-${index}`} product={product} />;
          }
        })}
      </div>
      
      {loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mt-gutter">
          {Array(4).fill(0).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} />
          ))}
        </div>
      )}
    </>
  );
}
