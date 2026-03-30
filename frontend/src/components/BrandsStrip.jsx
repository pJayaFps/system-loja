const brands = ['SprintX', 'Move', 'GoalPro', 'NutriCore', 'Vita', 'Mono'];

function BrandsStrip({ onSelect }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">Marcas em destaque</h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {brands.map((brand) => (
          <button
            key={brand}
            className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-3 text-sm font-semibold text-zinc-700 hover:bg-black hover:text-white"
            onClick={() => onSelect(brand)}
          >
            {brand}
          </button>
        ))}
      </div>
    </section>
  );
}

export default BrandsStrip;
