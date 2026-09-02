        {step === 2 && (
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">¿Esto necesita una acción ahora?</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setNeedsActionNow(true)}
                className={`p-6 rounded-lg border-2 transition-colors ${needsActionNow === true ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
              >
                <span className="text-lg font-bold">Sí</span>
              </button>
              <button
                onClick={() => setNeedsActionNow(false)}
                className={`p-6 rounded-lg border-2 transition-colors ${needsActionNow === false ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-600'}`}
              >
                <span className="text-lg font-bold">No</span>
              </button>
            </div>
