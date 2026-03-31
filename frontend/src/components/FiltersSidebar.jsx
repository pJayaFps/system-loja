import { useEffect, useState } from 'react';

function FiltersSidebar({ marcas, categorias, subcategorias, filters, onApplyFilters, onClearFilters }) {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const update = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <aside className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-500">Filtros</h3>
        <button className="text-xs font-semibold text-zinc-600 underline-offset-2 hover:text-black hover:underline" onClick={onClearFilters}>
          Limpar filtros
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Marca</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={draft.marca} onChange={(e) => update('marca', e.target.value)}>
          <option value="">Todas</option>
          {marcas.map((marca) => <option key={marca}>{marca}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Categoria</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={draft.categoria} onChange={(e) => update('categoria', e.target.value)}>
          <option value="">Todas</option>
          {categorias.map((categoria) => <option key={categoria}>{categoria}</option>)}
        </select>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold">Subcategoria</p>
        <select className="w-full rounded-lg border border-zinc-300 p-2" value={draft.subcategoria} onChange={(e) => update('subcategoria', e.target.value)}>
          <option value="">Todas</option>
          {subcategorias.map((subcategoria) => <option key={subcategoria}>{subcategoria}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-2 text-sm font-semibold">Preço min</p>
          <input className="w-full rounded-lg border border-zinc-300 p-2" type="number" value={draft.min} onChange={(e) => update('min', e.target.value)} />
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Preço max</p>
          <input className="w-full rounded-lg border border-zinc-300 p-2" type="number" value={draft.max} onChange={(e) => update('max', e.target.value)} />
        </div>
      </div>

      <button className="w-full rounded-full bg-black py-2 text-sm font-semibold text-white" onClick={() => onApplyFilters(draft)}>
        Filtrar
      </button>
    </aside>
  );
}

export default FiltersSidebar;
