import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

function ProductGrid({ products }) {
  const { addToCart } = useCart();

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold">Produtos</h3>
        <span className="text-sm text-zinc-500">{products.length} itens</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const discount = Math.round((product.preco * 0.15 + Number.EPSILON) * 100) / 100;
          return (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-soft transition hover:-translate-y-1">
              <Link to={`/produto/${product.id}`}>
                <img src={product.imagem} alt={product.nome} className="h-48 w-full object-cover" />
              </Link>
              <div className="space-y-2 p-4">
                <h4 className="line-clamp-2 font-semibold">{product.nome}</h4>
                <div>
                  <p className="text-xs text-zinc-500 line-through">R$ {formatPrice(product.preco + discount)}</p>
                  <p className="text-xl font-bold">R$ {formatPrice(product.preco)}</p>
                </div>
                <button className="w-full rounded-full bg-black py-2 text-sm font-semibold text-white hover:bg-zinc-800" onClick={() => addToCart(product)}>
                  Adicionar ao carrinho
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ProductGrid;
