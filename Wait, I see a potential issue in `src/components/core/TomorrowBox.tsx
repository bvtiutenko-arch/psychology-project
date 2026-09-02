      {loading ? (
        <p className="text-slate-500">Cargando...</p>
      ) : tasks.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No hay tareas pendientes. ¡Añade una!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task.id} className={`flex items-center justify-between p-4 rounded-lg shadow-sm border ${task.completed ? 'bg-slate-100 border-slate-200' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <button onClick={() => handleToggle(task)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                  {task.completed && <Check className="w-4 h-4" />}
                </button>
                <span className={`${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{task.text}</span>
              </div>
              <button onClick={() => handleDelete(task.id!)} className="text-slate-400 hover:text-red-500">
                <Trash2 className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
