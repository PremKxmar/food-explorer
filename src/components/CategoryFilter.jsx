export default function CategoryFilter({ categories, selected, onSelect, loading }) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">filter_list</span>
      </div>
      <select 
        value={selected} 
        onChange={(e) => onSelect(e.target.value)}
        className="appearance-none bg-surface-container border border-white/5 pl-9 pr-10 py-2 rounded-lg hover:bg-surface-container-high transition-colors font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-full md:w-48 truncate"
        disabled={loading}
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
      </div>
    </div>
  );
}
