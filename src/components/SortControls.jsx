export default function SortControls({ sortBy, onSort }) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">swap_vert</span>
      </div>
      <select 
        value={sortBy} 
        onChange={(e) => onSort(e.target.value)}
        className="appearance-none bg-surface-container border border-white/5 pl-9 pr-10 py-2 rounded-lg hover:bg-surface-container-high transition-colors font-label-md text-label-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-full md:w-auto"
      >
        <option value="name">Name (A-Z)</option>
        <option value="-name">Name (Z-A)</option>
        <option value="grade">Nutri-Score (Best First)</option>
        <option value="-grade">Nutri-Score (Worst First)</option>
      </select>
      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
      </div>
    </div>
  );
}
