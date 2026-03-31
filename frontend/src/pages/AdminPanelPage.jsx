import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateBrandPromo,
  adminCreateCupom,
  adminCreateProduto,
  adminDeleteBrandPromo,
  adminDeleteCupom,
  adminDeleteProduto,
  adminGetBrandPromos,
  adminGetCupons,
  adminUpdateBrandPromo,
  adminUpdateCupom,
  adminUpdateProduto,
  getProdutos
} from '../utils/api';
import { formatPrice } from '../utils/format';

const initialProduto = { nome: '', descricao: '', preco: '', marca: '', categoria: '', subcategoria: '', imagem: '', estoque: '', tamanhos: 'P,M,G,GG' };
const initialPromo = { nome: '', descricao: '', desconto: '', categoria: '', subcategoria: '', imagem: '', ativo: true };
const initialCupom = { codigo: '', descricao: '', tipo: 'percent', valor: '', minimo: '', ativo: true };

function AdminPanelPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('sportvault_admin_token');

  const [products, setProducts] = useState([]);
  const [promos, setPromos] = useState([]);
  const [cupons, setCupons] = useState([]);

  const [editingProdutoId, setEditingProdutoId] = useState(null);
  const [editingPromoId, setEditingPromoId] = useState(null);
  const [editingCupomId, setEditingCupomId] = useState(null);

  const [produtoForm, setProdutoForm] = useState(initialProduto);
  const [promoForm, setPromoForm] = useState(initialPromo);
  const [cupomForm, setCupomForm] = useState(initialCupom);

  const [status, setStatus] = useState('');

  const produtoMode = useMemo(() => (editingProdutoId ? 'edit' : 'create'), [editingProdutoId]);
  const promoMode = useMemo(() => (editingPromoId ? 'edit' : 'create'), [editingPromoId]);
  const cupomMode = useMemo(() => (editingCupomId ? 'edit' : 'create'), [editingCupomId]);

  const loadAll = () => {
    getProdutos().then(setProducts);
    adminGetBrandPromos(token).then((data) => setPromos(Array.isArray(data) ? data : []));
    adminGetCupons(token).then((data) => setCupons(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    if (!token) return navigate('/admin/login');
    loadAll();
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem('sportvault_admin_token');
    navigate('/admin/login');
  };

  const submitProduto = async (event) => {
    event.preventDefault();
    const payload = { ...produtoForm, preco: Number(produtoForm.preco), estoque: Number(produtoForm.estoque) };
    const result = editingProdutoId
      ? await adminUpdateProduto(editingProdutoId, payload, token)
      : await adminCreateProduto(payload, token);
    setStatus(result?.error || (editingProdutoId ? 'Produto atualizado.' : 'Produto criado.'));
    if (!result?.error) {
      setProdutoForm(initialProduto);
      setEditingProdutoId(null);
      loadAll();
    }
  };

  const submitPromo = async (event) => {
    event.preventDefault();
    const result = editingPromoId
      ? await adminUpdateBrandPromo(editingPromoId, promoForm, token)
      : await adminCreateBrandPromo(promoForm, token);
    setStatus(result?.error || (editingPromoId ? 'Divulgação atualizada.' : 'Divulgação criada.'));
    if (!result?.error) {
      setPromoForm(initialPromo);
      setEditingPromoId(null);
      loadAll();
    }
  };

  const submitCupom = async (event) => {
    event.preventDefault();
    const payload = { ...cupomForm, valor: Number(cupomForm.valor), minimo: Number(cupomForm.minimo || 0) };
    const result = editingCupomId
      ? await adminUpdateCupom(editingCupomId, payload, token)
      : await adminCreateCupom(payload, token);
    setStatus(result?.error || (editingCupomId ? 'Cupom atualizado.' : 'Cupom criado.'));
    if (!result?.error) {
      setCupomForm(initialCupom);
      setEditingCupomId(null);
      loadAll();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h1 className="text-xl font-bold">Painel do Administrador</h1>
        <button className="rounded-full border border-zinc-400 px-4 py-2 text-sm" onClick={logout}>Sair</button>
      </div>

      {status && <p className="rounded-xl bg-zinc-100 p-3 text-sm">{status}</p>}

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold">Produtos</h2>
        <form className="grid gap-2 md:grid-cols-2" onSubmit={submitProduto}>
          <input className="rounded-lg border p-2" placeholder="Nome" value={produtoForm.nome} onChange={(e) => setProdutoForm((p) => ({ ...p, nome: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Marca" value={produtoForm.marca} onChange={(e) => setProdutoForm((p) => ({ ...p, marca: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Categoria" value={produtoForm.categoria} onChange={(e) => setProdutoForm((p) => ({ ...p, categoria: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Subcategoria" value={produtoForm.subcategoria} onChange={(e) => setProdutoForm((p) => ({ ...p, subcategoria: e.target.value }))} required />
          <input type="number" className="rounded-lg border p-2" placeholder="Preço" value={produtoForm.preco} onChange={(e) => setProdutoForm((p) => ({ ...p, preco: e.target.value }))} required />
          <input type="number" className="rounded-lg border p-2" placeholder="Estoque" value={produtoForm.estoque} onChange={(e) => setProdutoForm((p) => ({ ...p, estoque: e.target.value }))} required />
          <input className="rounded-lg border p-2 md:col-span-2" placeholder="Tamanhos" value={produtoForm.tamanhos} onChange={(e) => setProdutoForm((p) => ({ ...p, tamanhos: e.target.value }))} required />
          <input className="rounded-lg border p-2 md:col-span-2" placeholder="Imagem" value={produtoForm.imagem} onChange={(e) => setProdutoForm((p) => ({ ...p, imagem: e.target.value }))} required />
          <textarea className="rounded-lg border p-2 md:col-span-2" placeholder="Descrição" value={produtoForm.descricao} onChange={(e) => setProdutoForm((p) => ({ ...p, descricao: e.target.value }))} required />
          <button className="rounded-full bg-black px-4 py-2 text-sm text-white" type="submit">{produtoMode === 'edit' ? 'Atualizar produto' : 'Criar produto'}</button>
        </form>
        <div className="mt-3 space-y-2">
          {products.map((product) => (
            <div key={product.id} className="flex items-center justify-between border-b pb-2 text-sm">
              <span>{product.nome} • R$ {formatPrice(product.preco)}</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingProdutoId(product.id); setProdutoForm(product); }} className="rounded border px-3 py-1">Editar</button>
                <button onClick={async () => { await adminDeleteProduto(product.id, token); loadAll(); }} className="rounded border px-3 py-1">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold">Divulgação / Brands Cards</h2>
        <form className="grid gap-2 md:grid-cols-2" onSubmit={submitPromo}>
          <input className="rounded-lg border p-2" placeholder="Nome" value={promoForm.nome} onChange={(e) => setPromoForm((p) => ({ ...p, nome: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Desconto (ex: 20% OFF)" value={promoForm.desconto} onChange={(e) => setPromoForm((p) => ({ ...p, desconto: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Categoria" value={promoForm.categoria} onChange={(e) => setPromoForm((p) => ({ ...p, categoria: e.target.value }))} required />
          <input className="rounded-lg border p-2" placeholder="Subcategoria" value={promoForm.subcategoria} onChange={(e) => setPromoForm((p) => ({ ...p, subcategoria: e.target.value }))} />
          <input className="rounded-lg border p-2 md:col-span-2" placeholder="Descrição (a partir de X% OFF)" value={promoForm.descricao} onChange={(e) => setPromoForm((p) => ({ ...p, descricao: e.target.value }))} required />
          <input className="rounded-lg border p-2 md:col-span-2" placeholder="Imagem" value={promoForm.imagem} onChange={(e) => setPromoForm((p) => ({ ...p, imagem: e.target.value }))} required />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={promoForm.ativo} onChange={(e) => setPromoForm((p) => ({ ...p, ativo: e.target.checked }))} /> Ativo</label>
          <button className="rounded-full bg-black px-4 py-2 text-sm text-white" type="submit">{promoMode === 'edit' ? 'Atualizar card' : 'Criar card'}</button>
        </form>
        <div className="mt-3 space-y-2">
          {promos.map((promo) => (
            <div key={promo.id} className="flex items-center justify-between border-b pb-2 text-sm">
              <span>{promo.nome} • {promo.descricao}</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingPromoId(promo.id); setPromoForm({ ...promo, ativo: Boolean(promo.ativo) }); }} className="rounded border px-3 py-1">Editar</button>
                <button onClick={async () => { await adminDeleteBrandPromo(promo.id, token); loadAll(); }} className="rounded border px-3 py-1">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold">Cupons de desconto</h2>
        <form className="grid gap-2 md:grid-cols-2" onSubmit={submitCupom}>
          <input className="rounded-lg border p-2" placeholder="Código" value={cupomForm.codigo} onChange={(e) => setCupomForm((p) => ({ ...p, codigo: e.target.value.toUpperCase() }))} required />
          <input className="rounded-lg border p-2" placeholder="Descrição" value={cupomForm.descricao} onChange={(e) => setCupomForm((p) => ({ ...p, descricao: e.target.value }))} required />
          <input type="number" className="rounded-lg border p-2" placeholder="Valor (%)" value={cupomForm.valor} onChange={(e) => setCupomForm((p) => ({ ...p, valor: e.target.value }))} required />
          <input type="number" className="rounded-lg border p-2" placeholder="Mínimo da compra" value={cupomForm.minimo} onChange={(e) => setCupomForm((p) => ({ ...p, minimo: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cupomForm.ativo} onChange={(e) => setCupomForm((p) => ({ ...p, ativo: e.target.checked }))} /> Ativo</label>
          <button className="rounded-full bg-black px-4 py-2 text-sm text-white" type="submit">{cupomMode === 'edit' ? 'Atualizar cupom' : 'Criar cupom'}</button>
        </form>
        <div className="mt-3 space-y-2">
          {cupons.map((cupom) => (
            <div key={cupom.id} className="flex items-center justify-between border-b pb-2 text-sm">
              <span>{cupom.codigo} • {cupom.valor}% (mínimo R$ {formatPrice(cupom.minimo)})</span>
              <div className="flex gap-2">
                <button onClick={() => { setEditingCupomId(cupom.id); setCupomForm({ ...cupom, ativo: Boolean(cupom.ativo) }); }} className="rounded border px-3 py-1">Editar</button>
                <button onClick={async () => { await adminDeleteCupom(cupom.id, token); loadAll(); }} className="rounded border px-3 py-1">Remover</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminPanelPage;
