const Node = ({ label, value, color, isLast }: { label: string; value: string; color: string; isLast: boolean }) => (
  <div className="flex flex-col items-center mb-8 relative">
    <div className={`w-16 h-16 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold p-2 text-center shadow-md`}>
      {label}
    </div>
    <p className="mt-2 text-sm text-slate-700 text-center max-w-[120px]">{value}</p>
    {!isLast && <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-slate-300"></div>}
  </div>
);
