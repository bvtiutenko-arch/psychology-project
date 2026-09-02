      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Ej: Buscar trabajo, Resolver problema..."
          className="flex-1 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
        <button onClick={handleAdd} className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700">
          <Plus className="w-6 h-6" />
        </button>
      </div>
