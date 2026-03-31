import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categories } from '../data/categories';

function Header() {
  const { totals } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const hasMenu = useMemo(() => categories.length > 0, []);

  const onSearch = (event) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value.trim();
      const next = new URLSearchParams(searchParams);
      if (value) next.set('busca', value);
      else next.delete('busca');
      navigate(`/?${next.toString()}`);
    }
  };

  const filterByCategory = (categoria) => {
    const next = new URLSearchParams(searchParams);
    next.set('categoria', categoria);
    next.delete('subcategoria');
    navigate(`/?${next.toString()}`);
    setMobileMenuOpen(false);
  };

  const filterBySubcategory = (categoria, subcategoria) => {
    const next = new URLSearchParams(searchParams);
    next.set('categoria', categoria);
    next.set('subcategoria', subcategoria);
    navigate(`/?${next.toString()}`);
    setMobileMenuOpen(false);
  };

  const mobileDrawer = mobileMenuOpen && hasMenu && typeof document !== 'undefined'
    ? createPortal(
      <div className="fixed inset-0 z-[2147483647] md:hidden">
        <button className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar" />
        <aside className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Categorias</h3>
            <button className="rounded-full border border-zinc-300 p-2" onClick={() => setMobileMenuOpen(false)}>
              <X className="size-4" />
            </button>
          </div>

          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.nome} className="rounded-xl border border-zinc-200 p-2">
                <button className="flex w-full items-center justify-between font-semibold" onClick={() => setOpenCategory((prev) => (prev === cat.nome ? null : cat.nome))}>
                  {cat.nome}
                  <span className="text-xs text-zinc-500">{openCategory === cat.nome ? '−' : '+'}</span>
                </button>

                {openCategory === cat.nome && (
                  <div className="mt-2 space-y-1 pl-2">
                    <button className="block text-sm font-medium text-zinc-800" onClick={() => filterByCategory(cat.nome)}>
                      Ver tudo em {cat.nome}
                    </button>
                    {cat.subcategorias.map((sub) => (
                      <button key={sub} className="block text-sm text-zinc-600" onClick={() => filterBySubcategory(cat.nome, sub)}>
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[120] border-b border-zinc-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:gap-4 md:px-6">
          <button className="rounded-full border border-zinc-300 p-2 md:hidden" onClick={() => setMobileMenuOpen(true)} aria-label="Abrir categorias">
            <Menu className="size-4" />
          </button>

          <Link to="/" className="text-lg font-extrabold tracking-tight text-black md:text-xl">SportVault</Link>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
            <input className="w-full rounded-full border border-zinc-300 bg-zinc-100 py-2 pl-10 pr-4 text-sm outline-none ring-black transition focus:ring-1" placeholder="O que você procura?" onKeyDown={onSearch} />
          </div>

          <div className="flex items-center gap-2 text-zinc-700 md:gap-3">
            <button className="hidden rounded-full border border-zinc-300 p-2 hover:bg-zinc-100 md:inline-flex" aria-label="Login"><User className="size-4" /></button>
            <button className="hidden rounded-full border border-zinc-300 p-2 hover:bg-zinc-100 md:inline-flex" aria-label="Favoritos"><Heart className="size-4" /></button>
            <Link to="/carrinho" className="relative rounded-full border border-zinc-300 p-2 hover:bg-zinc-100" aria-label="Carrinho">
              <ShoppingCart className="size-4" />
              {totals.items > 0 && <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">{totals.items}</span>}
            </Link>
          </div>
        </div>
      </header>
      {mobileDrawer}
    </>
  );
}

export default Header;
