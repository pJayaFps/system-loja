import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '../data/categories';

function CategoryMenu() {
  const [active, setActive] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const applyFilter = (nome) => {
    const next = new URLSearchParams(searchParams);
    next.set('categoria', nome);
    navigate(`/?${next.toString()}`);
  };

  return (
    <nav className="sticky top-[73px] z-20 border-b border-zinc-200 bg-zinc-50">
      <div className="mx-auto hidden max-w-7xl gap-4 overflow-x-auto px-4 py-3 md:flex md:px-6">
        {categories.map((cat) => (
          <div key={cat.nome} className="relative" onMouseEnter={() => setActive(cat.nome)} onMouseLeave={() => setActive(null)}>
            <button className="text-sm font-medium text-zinc-700 hover:text-black" onClick={() => applyFilter(cat.nome)}>
              {cat.nome}
            </button>
            {active === cat.nome && (
              <div className="absolute left-0 top-8 w-56 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">Subcategorias</h4>
                <ul className="space-y-2">
                  {cat.subcategorias.map((sub) => (
                    <li key={sub} className="text-sm text-zinc-700 hover:text-black">{sub}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default CategoryMenu;
