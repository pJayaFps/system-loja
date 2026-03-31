import { useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '../data/categories';

function CategoryMenu() {
  const [active, setActive] = useState(null);
  const hideTimerRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const openMenu = (nome) => {
    clearHideTimer();
    setActive(nome);
  };

  const closeMenuWithDelay = () => {
    clearHideTimer();
    hideTimerRef.current = setTimeout(() => setActive(null), 2000);
  };

  const applyCategory = (categoria) => {
    const next = new URLSearchParams(searchParams);
    next.set('categoria', categoria);
    next.delete('subcategoria');
    navigate(`/?${next.toString()}`);
  };

  const applySubcategory = (categoria, subcategoria) => {
    const next = new URLSearchParams(searchParams);
    next.set('categoria', categoria);
    next.set('subcategoria', subcategoria);
    navigate(`/?${next.toString()}`);
  };

  return (
    <nav className="fixed inset-x-0 top-16 z-30 border-b border-zinc-200 bg-zinc-50/95 backdrop-blur">
      <div className="mx-auto hidden max-w-7xl items-center gap-6 px-4 py-3 md:flex md:px-6">
        {categories.map((cat) => (
          <div
            key={cat.nome}
            className="relative"
            onMouseEnter={() => openMenu(cat.nome)}
            onMouseLeave={closeMenuWithDelay}
          >
            <button
              className="text-sm font-medium text-zinc-700 hover:text-black"
              onClick={() => applyCategory(cat.nome)}
            >
              {cat.nome}
            </button>

            {active === cat.nome && (
              <div
                className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft"
                onMouseEnter={() => openMenu(cat.nome)}
                onMouseLeave={closeMenuWithDelay}
              >
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                  Subcategorias
                </h4>
                <ul className="space-y-2">
                  {cat.subcategorias.map((sub) => (
                    <li key={sub}>
                      <button
                        className="text-sm text-zinc-700 hover:text-black"
                        onClick={() => applySubcategory(cat.nome, sub)}
                      >
                        {sub}
                      </button>
                    </li>
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
