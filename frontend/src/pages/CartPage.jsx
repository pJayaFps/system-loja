import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

function CartPage() {
  const { cart, removeFromCart, updateQuantity, totals } = useCart();
  const navigate = useNavigate();

  if (!cart.length) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-soft">
        <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
        <Link to="/" className="mt-4 inline-block rounded-full bg-black px-5 py-2 text-white">
          Voltar às compras
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        {cart.map((item) => (
          <article key={`${item.id}-${item.tamanho}`} className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-4">
            <img src={item.imagem} alt={item.nome} className="h-20 w-20 rounded-lg object-cover" />
            <div className="min-w-52 flex-1">
              <p className="font-semibold">{item.nome}</p>
              <p className="text-sm text-zinc-500">Tam: {item.tamanho}</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantidade}
              onChange={(e) => updateQuantity(item.id, item.tamanho, Number(e.target.value))}
              className="w-16 rounded-lg border border-zinc-300 p-2"
            />
            <p className="w-24 text-right font-bold">R$ {formatPrice(item.preco * item.quantidade)}</p>
            <button className="text-sm font-semibold text-zinc-500 hover:text-black" onClick={() => removeFromCart(item.id, item.tamanho)}>
              Remover
            </button>
          </article>
        ))}
      </section>

      <aside className="h-fit space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h3 className="text-lg font-bold">Resumo</h3>
        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-bold">R$ {formatPrice(totals.amount)}</span>
        </div>
        <button className="w-full rounded-full bg-black py-3 text-sm font-semibold text-white" onClick={() => navigate('/checkout')}>
          Ir para checkout
        </button>
      </aside>
    </div>
  );
}

export default CartPage;
