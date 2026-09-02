            {needsActionNow === false && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 text-slate-300">¿Qué harás mañana?</h3>
                <textarea
                  value={actionForTomorrow}
                  onChange={(e) => setActionForTomorrow(e.target.value)}
                  className="w-full bg-slate-800 text-white rounded-lg p-4 min-h-[100px] resize-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: Buscar trabajo mañana, Resolver problema financiero..."
                />
                <p className="text-sm text-slate-400 mt-2">Guárdalo para mañana. Ahora es momento de descansar.</p>
              </div>
            )}
