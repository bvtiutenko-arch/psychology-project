          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-500" />
              Modo Noche
            </h2>
            {nightEntries.length === 0 ? (
              <p className="text-slate-500 text-center py-4 bg-white rounded-xl shadow-sm">No hay registros de Modo Noche.</p>
            ) : (
              <div className="space-y-4">
                {nightEntries.map((entry) => (
                  <div key={entry.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-xs text-slate-500 mb-2">{formatDate(entry.timestamp, true)}</p>
                    <p className="text-sm text-slate-800 mb-2"><span className="font-medium">Pensamiento:</span> {entry.thought}</p>
                    {entry.needsActionNow ? (
                      <p className="text-sm text-red-500">Marcado como urgente.</p>
                    ) : (
                      <p className="text-sm text-slate-600"><span className="font-medium">Para mañana:</span> {entry.actionForTomorrow}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
