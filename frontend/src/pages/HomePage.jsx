import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import BrandsStrip from '../components/BrandsStrip';
import FiltersSidebar from '../components/FiltersSidebar';
import ProductGrid from '../components/ProductGrid';
import { getFiltros, getProdutos } from '../utils/api';

function HomePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtrosOpcoes, setFiltrosOpcoes] = useState({ marcas: [], categorias: [], subcategorias: [] });
  const [filters, setFilters] = useState({ marca: '', categoria: '', subcategoria: '', min: '', max: '' });
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const mergedFilters = useMemo(
    () => ({
      ...filters,
      categoria: searchParams.get('categoria') || filters.categoria,
      subcategoria: searchParams.get('subcategoria') || filters.subcategoria,
      busca: searchParams.get('busca') || ''
    }),
    [filters, searchParams]
  );

  useEffect(() => {
    getFiltros().then(setFiltrosOpcoes);
  }, []);

  useEffect(() => {
    getProdutos(mergedFilters).then(setProducts);
  }, [mergedFilters]);

  const applyBrand = (brand) => setFilters((prev) => ({ ...prev, marca: brand }));

  return (
    <div className="space-y-6">
      <BannerCarousel />
      <BrandsStrip onSelect={applyBrand} />

      <div className="flex justify-end lg:hidden">
        <button
          className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold"
          onClick={() => setShowFiltersMobile((prev) => !prev)}
        >
          <SlidersHorizontal className="size-4" />
          {showFiltersMobile ? 'Ocultar filtros' : 'Mostrar filtros'}
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`${showFiltersMobile ? 'block' : 'hidden'} lg:block`}>
          <FiltersSidebar
            marcas={filtrosOpcoes.marcas}
            categorias={filtrosOpcoes.categorias}
            subcategorias={filtrosOpcoes.subcategorias}
            filters={mergedFilters}
            setFilters={setFilters}
          />
        </div>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default HomePage;
