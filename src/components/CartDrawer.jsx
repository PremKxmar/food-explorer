import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, clearCart, cartCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]" 
        onClick={closeCart} 
        aria-hidden="true" 
      />
      <aside 
        className="fixed top-0 right-0 w-[400px] max-w-[90vw] h-screen bg-surface border-l border-white/5 shadow-2xl z-[201] flex flex-col"
        role="dialog" 
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between p-lg border-b border-white/5">
          <h2 className="flex items-center gap-2 font-headline-sm text-headline-sm text-on-surface">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            Cart ({cartCount})
          </h2>
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
            onClick={closeCart} 
            aria-label="Close cart"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-lg">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-3xl text-center gap-2 text-on-surface-variant">
              <span className="text-[3rem]">🛒</span>
              <p className="font-body-lg text-on-surface">Your cart is empty</p>
              <p className="font-body-sm text-on-surface-variant">Add products from the explorer</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-md">
              {items.map(({ product, quantity }) => (
                <li key={product.code} className="flex items-center gap-md p-md rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors">
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-white shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xl">🍽️</span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-body-sm font-medium text-on-surface line-clamp-2">{product.name}</p>
                    {product.quantity && (
                      <p className="font-label-md text-on-surface-variant mt-1">{product.quantity}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 bg-surface border border-white/5 rounded-lg p-1">
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded text-on-surface hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => updateQuantity(product.code, -1)}
                      aria-label="Decrease quantity"
                    >
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="w-6 text-center font-label-md text-on-surface">{quantity}</span>
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded text-on-surface hover:text-primary hover:bg-primary/10 transition-colors"
                      onClick={() => updateQuantity(product.code, 1)}
                      aria-label="Increase quantity"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                  </div>
                  
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors shrink-0 ml-2"
                    onClick={() => removeFromCart(product.code)}
                    aria-label={`Remove ${product.name}`}
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-lg border-t border-white/5 flex flex-col gap-md bg-surface-container-lowest">
            <div className="flex justify-between items-center text-on-surface">
              <span className="font-body-md">Total Items</span>
              <strong className="font-headline-sm">{cartCount}</strong>
            </div>
            <button 
              className="w-full py-3 rounded-lg font-label-md text-error bg-error-container/10 border border-error/20 hover:bg-error-container/20 transition-colors" 
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
