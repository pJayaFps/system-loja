import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProdutoById } from '../utils/api';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('M');

  useEffect(() => {
    getProdutoById(id).then(setProduct);
  }, [id]);

  const availableSizes = useMemo(() => {
    if (!product?.tamanhos) return ['P', 'M', 'G', 'GG'];
    return product.tamanhos.split(',').map((item) => item.trim()).filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (availableSizes.length) setSize(availableSizes[0]);
  }, [availableSizes]);

  if (!product) {
    return <p>Carregando...</p>;
  }

  const handleBuyNow = () => {
    addToCart(product, 1, size);
    navigate('/checkout');
  };

  return (
    <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft md:grid-cols-2">
      <div className="space-y-3">
        <img src={product.imagem} alt={product.nome} className="h-96 w-full rounded-2xl object-cover" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((thumb) => (
            <img key={thumb} src={product.imagem} alt={`${product.nome} ${thumb}`} className="h-24 w-full rounded-xl object-cover opacity-80" />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-xs uppercase tracking-[.2em] text-zinc-500">{product.marca}</p>
        <h1 className="text-3xl font-bold">{product.nome}</h1>
        <p className="text-sm text-zinc-500">{product.categoria} • {product.subcategoria}</p>
        <p className="text-2xl font-bold">R$ {product.preco.toFixed(2)}</p>
        <p className="text-zinc-600">{product.descricao}</p>

        <div>
          <p className="mb-2 text-sm font-semibold">Tamanho</p>
          <div className="flex gap-2">
            {availableSizes.map((s) => (
              <button
                key={s}
                className={`rounded-md border px-4 py-2 text-sm ${size === s ? 'border-black bg-black text-white' : 'border-zinc-300'}`}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white" onClick={handleBuyNow}>
            Comprar agora
          </button>
          <button className="rounded-full border border-zinc-400 px-6 py-3 text-sm font-semibold" onClick={() => addToCart(product, 1, size)}>
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
