import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductByBarcode } from '../services/api';
import { useCart } from '../context/CartContext';
import Skeleton from '../components/Skeleton';

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#1C1F28"/>
    <text x="200" y="200" text-anchor="middle" font-family="Inter,sans-serif" font-size="64" fill="#3d3f49">🍽️</text>
  </svg>
`);

export default function ProductPage() {
  const { barcode } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function fetchProduct() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductByBarcode(barcode, controller.signal);
        if (!cancelled) {
          if (data) setProduct(data);
          else setError('Product not found');
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError('Failed to load product. Please try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProduct();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [barcode]);

  if (loading) {
    return (
      <main className="pt-32 pb-2xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-screen">
        <div className="grid grid-cols-1 gap-xl max-w-2xl mx-auto h-[400px]">
          <Skeleton />
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="pt-32 pb-2xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-screen text-center">
        <div className="bg-error-container/10 border border-error/20 p-3xl rounded-xl inline-block mt-3xl">
          <span className="material-symbols-outlined text-[64px] text-error mb-4">error</span>
          <h2 className="font-display-lg text-headline-lg text-on-surface mb-2">{error || 'Product not found'}</h2>
          <p className="font-body-lg text-on-surface-variant mb-lg">The product with barcode <strong className="text-on-surface">{barcode}</strong> could not be found.</p>
          <Link to="/" className="inline-flex items-center gap-xs text-primary hover:underline font-label-md">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Explorer
          </Link>
        </div>
      </main>
    );
  }

  const nutriments = product.nutriments || {};
  const nutritionRows = [
    { label: 'Energy', value: nutriments['energy-kcal_100g'], unit: 'kcal' },
    { label: 'Fat', value: nutriments['fat_100g'], unit: 'g' },
    { label: 'Saturated Fat', value: nutriments['saturated-fat_100g'], unit: 'g' },
    { label: 'Carbohydrates', value: nutriments['carbohydrates_100g'], unit: 'g' },
    { label: 'Sugars', value: nutriments['sugars_100g'], unit: 'g' },
    { label: 'Fiber', value: nutriments['fiber_100g'], unit: 'g' },
    { label: 'Proteins', value: nutriments['proteins_100g'], unit: 'g' },
    { label: 'Salt', value: nutriments['salt_100g'], unit: 'g' },
    { label: 'Sodium', value: nutriments['sodium_100g'], unit: 'g' },
  ].filter((r) => r.value !== undefined && r.value !== null);

  const labels = product.labelTags || [];
  const allergens = product.allergenTags || [];
  const categoriesList = product.categories ? product.categories.split(',').map(c => c.trim()) : [];
  const grade = product.nutritionGrade || 'unknown';

  return (
    <main className="pt-32 pb-2xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-screen">
      {/* Breadcrumb */}
      <nav className="mb-lg">
        <Link to="/" className="flex items-center gap-xs text-primary font-label-md hover:underline w-fit">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Explorer
        </Link>
      </nav>

      {/* Two-Column Hero */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-xl mb-3xl">
        {/* Left: Product Image */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="glass-card rounded-xl overflow-hidden aspect-square flex items-center justify-center bg-white">
            <img 
              alt={product.name} 
              className="w-full h-full object-cover rounded-lg" 
              src={product.image || PLACEHOLDER_IMG}
              onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center">
          <div className="mb-sm">
            <span className="text-[10px] tracking-[0.2em] font-bold text-primary uppercase">
              {product.brands || 'UNKNOWN BRAND'}
            </span>
          </div>
          <h1 className="font-display-lg text-headline-lg md:text-display-lg mb-xs leading-tight text-on-surface">
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-md mb-lg">
            {product.genericName && (
              <span className="text-on-surface-variant font-body-sm italic">{product.genericName}</span>
            )}
            {product.quantity && (
              <span className="bg-surface-container-high text-on-surface px-md py-1 rounded-full font-label-md">{product.quantity}</span>
            )}
            <span className="text-on-surface-variant text-[10px] font-mono">#{barcode}</span>
          </div>

          {/* Scores Section */}
          <div className="flex flex-wrap gap-xl mb-xl">
            {grade !== 'unknown' && (
              <div className="flex flex-col gap-sm">
                <span className="font-label-md text-on-surface-variant tracking-wider">NUTRI-SCORE</span>
                <div className="flex gap-xs bg-surface-container-high p-1 rounded-md">
                  {['a','b','c','d','e'].map(g => {
                    const isActive = grade === g;
                    const colors = {
                      'a': 'bg-[#008b4c]', 'b': 'bg-[#80c342]', 'c': 'bg-[#feca0b]', 'd': 'bg-[#f58220]', 'e': 'bg-[#ef4223]'
                    };
                    return (
                      <div key={g} className={`nutri-grade ${colors[g]} text-white transition-all ${isActive ? 'ring-2 ring-white text-lg font-black' : 'opacity-30 text-xs font-bold'}`}>
                        {g.toUpperCase()}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {product.novaGroup && (
              <div className="flex flex-col gap-sm">
                <span className="font-label-md text-on-surface-variant tracking-wider">NOVA GROUP</span>
                <div className="bg-error-container text-on-error-container w-10 h-10 flex items-center justify-center rounded-md font-bold text-xl">
                  {product.novaGroup}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            onClick={() => addToCart(product)}
            className="w-full md:w-fit px-3xl py-lg bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-headline-sm rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_shopping_cart</span>
            Add to Cart
          </button>
        </div>
      </div>

      {/* Details Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Categories Card */}
        {categoriesList.length > 0 && (
          <div className="glass-card p-xl rounded-xl lg:col-span-1">
            <div className="flex items-center gap-md mb-lg text-primary">
              <span className="material-symbols-outlined">category</span>
              <h3 className="font-headline-sm">Categories</h3>
            </div>
            <div className="flex flex-wrap gap-sm">
              {categoriesList.map(cat => (
                <span key={cat} className="bg-surface-container-high border border-outline-variant px-md py-sm rounded-lg text-body-sm text-on-surface">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients Card */}
        {product.ingredients && (
          <div className={`glass-card p-xl rounded-xl ${categoriesList.length > 0 ? 'md:col-span-2 lg:col-span-2' : 'md:col-span-2 lg:col-span-3'}`}>
            <div className="flex items-center gap-md mb-lg text-primary">
              <span className="material-symbols-outlined">energy_savings_leaf</span>
              <h3 className="font-headline-sm">Ingredients</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed font-body-md">
              {product.ingredients}
            </p>
          </div>
        )}

        {/* Nutritional Values Card */}
        {nutritionRows.length > 0 && (
          <div className="glass-card p-xl rounded-xl md:col-span-2 lg:col-span-2 lg:row-span-2">
            <div className="flex justify-between items-center mb-lg">
              <div className="flex items-center gap-md text-primary">
                <span className="material-symbols-outlined">pie_chart</span>
                <h3 className="font-headline-sm">Nutritional Values</h3>
              </div>
              <span className="text-on-surface-variant font-label-md bg-surface-container px-md py-1 rounded-full">per 100g</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="py-md font-label-md text-on-surface-variant uppercase tracking-widest">Nutrient</th>
                    <th className="py-md text-right font-label-md text-on-surface-variant uppercase tracking-widest">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {nutritionRows.map(row => (
                    <tr key={row.label}>
                      <td className={`py-md ${['Saturated Fat', 'Sugars', 'Sodium'].includes(row.label) ? 'text-on-surface-variant pl-lg' : 'text-on-surface font-medium'}`}>
                        {row.label}
                      </td>
                      <td className="py-md text-right text-on-surface">
                        {typeof row.value === 'number' ? row.value.toFixed(1) : row.value}{row.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Labels & Dietary Card */}
        {labels.length > 0 && (
          <div className="glass-card p-xl rounded-xl">
            <div className="flex items-center gap-md mb-lg text-primary">
              <span className="material-symbols-outlined">layers</span>
              <h3 className="font-headline-sm">Labels</h3>
            </div>
            <div className="flex flex-wrap gap-sm">
              {labels.map(label => (
                <span key={label} className="bg-primary-container/10 text-primary border border-primary/20 px-md py-sm rounded-lg text-body-sm font-medium">
                  {formatTag(label)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Allergens Card */}
        {allergens.length > 0 && (
          <div className="glass-card p-xl rounded-xl">
            <div className="flex items-center gap-md mb-lg text-secondary">
              <span className="material-symbols-outlined">warning</span>
              <h3 className="font-headline-sm">Allergens</h3>
            </div>
            <div className="flex flex-wrap gap-sm">
              {allergens.map(a => (
                <span key={a} className="bg-error-container/20 text-error border border-error/20 px-md py-sm rounded-lg text-body-sm font-medium">
                  {formatTag(a)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function formatTag(tag) {
  return tag
    .replace(/^en:/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
