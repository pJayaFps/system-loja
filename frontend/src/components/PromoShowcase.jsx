import { useNavigate } from 'react-router-dom';

const heroCards = [
  { titulo: 'Chuteiras com até 60% OFF', subtitulo: 'Performance e preço baixo em edição limitada', categoria: 'Futebol', subcategoria: 'Chuteiras', destaque: 'Até 60% OFF' },
  { titulo: 'Corrida: leve 2 e pague menos', subtitulo: 'Tênis e roupas para correr melhor todos os dias', categoria: 'Corrida', subcategoria: 'Tênis', destaque: 'Promo da semana' }
];

const brandCards = [
  { nome: 'Aster Run', desconto: 'a partir de 20% OFF', categoria: 'Corrida' },
  { nome: 'Black Mountain', desconto: 'a partir de 25% OFF', categoria: 'Aventura' },
  { nome: 'Velocity Pro', desconto: 'a partir de 30% OFF', categoria: 'Academia e Fitness' },
  { nome: 'Urban Force', desconto: 'a partir de 15% OFF', categoria: 'Casual' },
  { nome: 'Nitro Play', desconto: 'a partir de 20% OFF', categoria: 'Basquete' },
  { nome: 'Core Club', desconto: 'a partir de 18% OFF', categoria: 'Roupas' },
  { nome: 'Fast Eleven', desconto: 'a partir de 22% OFF', categoria: 'Futebol' },
  { nome: 'Summit Gear', desconto: 'a partir de 28% OFF', categoria: 'Aventura' }
];

function PromoShowcase() {
  const navigate = useNavigate();

  const goToFilter = (categoria, subcategoria) => {
    const params = new URLSearchParams();
    if (categoria) params.set('categoria', categoria);
    if (subcategoria) params.set('subcategoria', subcategoria);
    navigate(`/?${params.toString()}`);
  };

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {heroCards.map((card) => (
          <article key={card.titulo} className="rounded-2xl bg-black p-6 text-white shadow-soft">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-300">{card.destaque}</p>
            <h3 className="mt-2 text-2xl font-bold">{card.titulo}</h3>
            <p className="mt-2 text-zinc-300">{card.subtitulo}</p>
            <button
              className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
              onClick={() => goToFilter(card.categoria, card.subcategoria)}
            >
              Clique aqui para comprar
            </button>
          </article>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {brandCards.map((brand) => (
          <article key={brand.nome} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
            <h4 className="font-bold">{brand.nome}</h4>
            <p className="mt-1 text-sm text-zinc-600">{brand.desconto}</p>
            <button
              className="mt-3 rounded-full border border-black px-3 py-1 text-xs font-semibold"
              onClick={() => goToFilter(brand.categoria)}
            >
              Comprar agora
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PromoShowcase;
