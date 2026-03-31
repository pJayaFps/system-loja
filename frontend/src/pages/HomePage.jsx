import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import BrandsStrip from '../components/BrandsStrip';
import FiltersSidebar from '../components/FiltersSidebar';
import ProductGrid from '../components/ProductGrid';
import PromoShowcase from '../components/PromoShowcase';
import { getFiltros, getProdutos } from '../utils/api';

const initialFilters = { marca: '', categoria: '', subcategoria: '', min: '', max: '' };

function HomePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtrosOpcoes, setFiltrosOpcoes] = useState({ marcas: [], categorias: [], subcategorias: [] });
  const [filters, setFilters] = useState(initialFilters);
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

  const hasActiveFilters = useMemo(
    () => Boolean(
      mergedFilters.marca ||
      mergedFilters.categoria ||
      mergedFilters.subcategoria ||
      mergedFilters.min ||
      mergedFilters.max ||
      mergedFilters.busca
    ),
    [mergedFilters]
  );

  useEffect(() => {
    getFiltros().then(setFiltrosOpcoes);
  }, []);

  useEffect(() => {
    if (!hasActiveFilters) {
      setProducts([]);
      return;
    }
    getProdutos(mergedFilters).then(setProducts);
  }, [mergedFilters, hasActiveFilters]);

  const applyBrand = (brand) => setFilters((prev) => ({ ...prev, marca: brand }));

  const clearFilters = () => {
    setFilters(initialFilters);
    navigate('/');
  };

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
            onClearFilters={clearFilters}
          />
        </div>

        {hasActiveFilters ? (
          <ProductGrid products={products} />
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-600 shadow-soft">
              Use a busca, categorias ou subcategorias para abrir os produtos. Enquanto isso, confira as promoções abaixo.
            </div>
            <PromoShowcase />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
