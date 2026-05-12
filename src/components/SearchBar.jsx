import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('name'); // 'name' | 'barcode'

  // We are not using debouncing inside SearchBar because useProducts handles it,
  // but we can optimize the input field state.
  useEffect(() => {
    // Prefix barcode with special identifier if needed, but our api.js might handle it based on length
    // For now, we'll just pass the query. The user can type.
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="w-full">
      <div className="flex gap-md mb-xs px-lg justify-start md:justify-center">
        <button 
          onClick={() => setMode('name')}
          className={`font-label-md text-label-md pb-2 transition-colors ${mode === 'name' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface border-b-2 border-transparent'}`}
        >
          By Name
        </button>
        <button 
          onClick={() => setMode('barcode')}
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
          placeholder={mode === 'barcode' ? "Enter barcode (e.g., 737628064502)..." : "Search for food products..."}
          className="w-full h-16 pl-16 pr-8 bg-surface-container border border-white/10 rounded-full font-body-md text-body-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-xl group-hover:bg-surface-container-high placeholder:text-on-surface-variant/50"
        />
      </div>
    </div>
  );
}
