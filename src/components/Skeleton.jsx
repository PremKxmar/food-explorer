export default function Skeleton() {
  return (
    <div className="bg-[#151820] border border-white/5 rounded-xl overflow-hidden h-full flex flex-col animate-pulse">
      <div className="relative aspect-square bg-surface-container-high w-full"></div>
      
      <div className="p-md flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="bg-surface-container-high h-4 w-16 rounded"></div>
          <div className="bg-surface-container-high h-4 w-20 rounded"></div>
        </div>
        
        <div className="bg-surface-container-high h-6 w-full rounded mb-1"></div>
        <div className="bg-surface-container-high h-6 w-2/3 rounded mb-4"></div>
        
        <div className="bg-surface-container-high h-4 w-full rounded mb-1 flex-grow"></div>
        <div className="bg-surface-container-high h-4 w-5/6 rounded mb-lg flex-grow"></div>
        
        <div className="w-full h-12 bg-surface-container-high rounded-lg mt-auto"></div>
      </div>
    </div>
  );
}
