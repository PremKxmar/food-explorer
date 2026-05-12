import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cartCount, toggleCart } = useCart();
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('food-explorer-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('food-explorer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <header className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-white/5 h-20 transition-colors duration-300">
      <div className="flex justify-between items-center h-full px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🥗</span>
          <span className="font-headline-md text-headline-md font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            FoodExplorer
          </span>
        </Link>

        <div className="flex items-center gap-md md:gap-lg">
          <button
            onClick={toggleTheme}
            className="text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center p-2"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span className="material-symbols-outlined">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          <button
            onClick={toggleCart}
            className="relative text-on-surface-variant hover:text-primary transition-colors duration-200 flex items-center justify-center p-2"
            aria-label="Open cart"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-secondary-container text-on-secondary-container text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-pulse-once">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
