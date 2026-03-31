import { useEffect, useState } from 'react';

const banners = [
  {
    titulo: 'Coleção Performance 2026',
    texto: 'Itens de alta performance em tons minimalistas.',
    imagem: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600'
  },
  {
    titulo: 'Corrida sem limites',
    texto: 'Tênis e roupas técnicas com até 35% OFF.',
    imagem: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1600'
  },
  {
    titulo: 'Treino urbano premium',
    texto: 'Conforto, estilo e tecnologia em cada detalhe.',
    imagem: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600'
  }
];

function BannerCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-72 overflow-hidden rounded-3xl md:h-96">
      {banners.map((banner, index) => (
        <div
          key={banner.titulo}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${index === active ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `linear-gradient(to right, rgba(0,0,0,.75), rgba(0,0,0,.2)), url(${banner.imagem})` }}
        >
          <div className="flex h-full max-w-lg flex-col justify-center gap-3 px-8 text-white">
            <p className="text-sm uppercase tracking-[0.24em] text-zinc-300">SportVault</p>
            <h2 className="text-3xl font-bold md:text-4xl">{banner.titulo}</h2>
            <p className="text-zinc-200">{banner.texto}</p>
            <button className="mt-2 w-fit rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200">
              Comprar
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default BannerCarousel;
