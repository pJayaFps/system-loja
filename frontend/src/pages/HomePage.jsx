import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BannerCarousel from '../components/BannerCarousel';
import BrandsStrip from '../components/BrandsStrip';
import FiltersSidebar from '../components/FiltersSidebar';
import ProductGrid from '../components/ProductGrid';
import { getFiltros, getProdutos } from '../utils/api';

function HomePage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filtrosOpcoes, setFiltrosOpcoes] = useState({ marcas: [], categorias: [] });
  const [filters, setFilters] = useState({ marca: '', categoria: '', min: '', max: '' });

  const mergedFilters = useMemo(
    () => ({
      ...filters,
      categoria: searchParams.get('categoria') || filters.categoria,
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

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <FiltersSidebar
          marcas={filtrosOpcoes.marcas}
          categorias={filtrosOpcoes.categorias}
          filters={mergedFilters}
          setFilters={setFilters}
        />
        <ProductGrid products={products} />
      </div>
    </div>
  );
}

export default HomePage;
