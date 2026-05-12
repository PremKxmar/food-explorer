import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ onSearch, onBarcodeSearch }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('name'); // 'name' | 'barcode'
  const debouncedQuery = useDebounce(query, 400);

  // Debounced name search
  useEffect(() => {
    if (mode === 'name') {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, mode, onSearch]);

  // Barcode search: trigger on Enter key or when a full barcode is typed (8+ digits)
  const handleKeyDown = useCallback((e) => {
    if (mode === 'barcode' && e.key === 'Enter' && query.trim()) {
      onBarcodeSearch(query.trim());
    }
  }, [mode, query, onBarcodeSearch]);

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setQuery('');
    if (newMode === 'name') {
      onSearch('');
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-md mb-xs px-lg justify-start md:justify-center">
        <button 
          onClick={() => handleModeSwitch('name')}
          className={`font-label-md text-label-md pb-2 transition-colors ${mode === 'name' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'}`}
        >
          By Name
        </button>
        <button 
          onClick={() => handleModeSwitch('barcode')}
          className={`font-label-md text-label-md pb-2 transition-colors ${mode === 'barcode' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'}`}
        >
          By Barcode
        </button>
      </div>
      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-primary">
            {mode === 'barcode' ? 'barcode_scanner' : 'search'}
          </span>
        </div>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'barcode' ? "Enter barcode and press Enter (e.g., 737628064502)..." : "Search for food products..."}
          className="w-full h-16 pl-16 pr-8 bg-surface-container border border-white/10 rounded-full font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-xl group-hover:bg-surface-container-high placeholder:text-on-surface-variant/50"
        />
      </div>
    </div>
  );
}
