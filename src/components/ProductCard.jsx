import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#1C1F28"/>
    <text x="200" y="200" text-anchor="middle" font-family="Inter,sans-serif" font-size="64" fill="#3d3f49">🍽️</text>
  </svg>
`);

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const grade = product.nutritionGrade || 'unknown';
  const category = product.categories ? product.categories.split(',')[0].trim() : 'Food';

  return (
    <div className="bg-[#151820] border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 hover:bg-[#1C1F28] transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product.code}`} className="relative aspect-square block overflow-hidden">
        <img 
          src={product.image || PLACEHOLDER_IMG} 
          alt={product.name}
          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-white"
        />
        {grade !== 'unknown' && (
          <div className="absolute top-3 right-3">
            <div className="nutriscore-badge">
              {['a', 'b', 'c', 'd', 'e'].map(g => (
                <span key={g} className={`grade-chip grade-${g} ${grade === g ? 'active' : ''}`}>
                  {g.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        )}
      </Link>
      
      <div className="p-md flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <span className="font-label-md text-label-md text-primary-container bg-primary-container/10 px-2 py-0.5 rounded truncate shrink-0 max-w-[60%]">
            {category}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
            {product.brands || 'Unknown'}
          </span>
        </div>
        
        <Link to={`/product/${product.code}`}>
          <h3 className="font-headline-sm text-headline-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-lg flex-grow">
          {product.ingredients || 'No ingredients listed.'}
        </p>
        
        <button 
          onClick={() => addToCart(product)}
          className="w-full h-12 flex items-center justify-center gap-2 border border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-300 mt-auto"
        >
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default memo(ProductCard);
