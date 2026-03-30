function FiltersSidebar({ marcas, categorias, subcategorias, filters, setFilters }) {
  const update = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Filtros</h3>

      <div>
        <p className="mb-2 text-sm font-semibold">Marca</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={filters.marca} onChange={(e) => update('marca', e.target.value)}>
          <option value="">Todas</option>
          {marcas.map((marca) => <option key={marca}>{marca}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Categoria</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={filters.categoria} onChange={(e) => update('categoria', e.target.value)}>
          <option value="">Todas</option>
          {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Subcategoria</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={filters.subcategoria} onChange={(e) => update('subcategoria', e.target.value)}>
          <option value="">Todas</option>
          {subcategorias.map((subcategoria) => <option key={subcategoria}>{subcategoria}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Preço min</p>
          <input className="w-full rounded-lg border border-zinc-300 p-2" type="number" value={filters.min} onChange={(e) => update('min', e.target.value)} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Preço max</p>
          <input className="w-full rounded-lg border border-zinc-300 p-2" type="number" value={filters.max} onChange={(e) => update('max', e.target.value)} />
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Tamanho</p>
        <div className="flex gap-2">
          {['P', 'M', 'G', 'GG'].map((size) => (
            <button key={size} className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-bold">{size}</button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default FiltersSidebar;
