          {selectedMatrix && (
            <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center">
              <Node label="Disparador" value={selectedMatrix.triggerEvent} color="bg-blue-500" isLast={false} />
              <Node label="Pensamiento" value={selectedMatrix.cognitiveBias} color="bg-purple-500" isLast={false} />
              <Node label="Comportamiento" value={selectedMatrix.somaticCompulsion} color="bg-orange-500" isLast={false} />
              <Node label="Consecuencia" value={selectedMatrix.feedbackLoop} color="bg-red-500" isLast={true} />
              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">Herida Raíz: {selectedMatrix.rootWound}</p>
              </div>
            </div>
          )}
