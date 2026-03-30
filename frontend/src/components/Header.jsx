import { Heart, Search, ShoppingCart, User } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Header() {
  const { totals } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onSearch = (event) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value.trim();
      const next = new URLSearchParams(searchParams);
      if (value) next.set('busca', value);
      else next.delete('busca');
      navigate(`/?${next.toString()}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="text-xl font-extrabold tracking-tight text-black">
          SportVault
        </Link>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            className="w-full rounded-full border border-zinc-300 bg-zinc-100 py-2 pl-10 pr-4 text-sm outline-none ring-black transition focus:ring-1"
            placeholder="O que você procura?"
            onKeyDown={onSearch}
          />
        </div>

        <div className="flex items-center gap-3 text-zinc-700">
          <button className="rounded-full border border-zinc-300 p-2 hover:bg-zinc-100" aria-label="Login">
            <User className="size-4" />
          </button>
          <button className="rounded-full border border-zinc-300 p-2 hover:bg-zinc-100" aria-label="Favoritos">
            <Heart className="size-4" />
          </button>
          <Link to="/carrinho" className="relative rounded-full border border-zinc-300 p-2 hover:bg-zinc-100" aria-label="Carrinho">
            <ShoppingCart className="size-4" />
            {totals.items > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                {totals.items}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
