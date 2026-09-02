const Chart = ({ title, matrices, metricKey, color }: { title: string; matrices: CausalMatrix[]; metricKey: keyof CausalMatrix; color: string }) => {
  const max = 100; // Metrics are 0-100
  const displayMatrices = [...matrices].slice(0, 10).reverse(); // Get newest 10, reverse for chronological order
  
  if (displayMatrices.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-700 mb-4">{title}</h3>
      <div className="flex items-end gap-2 h-40 border-b border-slate-200 overflow-x-auto pb-2">
        {displayMatrices.map((matrix, i) => {
          const val = typeof matrix[metricKey] === 'number' ? matrix[metricKey] as number : 0;
          return (
            <div key={i} className="flex flex-col items-center justify-end h-full w-12 flex-shrink-0">
              <div className="w-full bg-slate-100 rounded-t-sm relative" style={{ height: '100%' }}>
                <div className={`absolute bottom-0 w-full ${color} rounded-t-sm transition-all duration-500`} style={{ height: `${(val / max) * 100}%` }}></div>
              </div>
              <span className="text-xs text-slate-400 mt-1 whitespace-nowrap">{formatDate(matrix.timestamp)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
