import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  adminCreateProduto,
  adminDeleteProduto,
  adminUpdateProduto,
  getProdutos
} from '../utils/api';

const initialForm = {
  nome: '',
  descricao: '',
  preco: '',
  marca: '',
  categoria: '',
  subcategoria: '',
  imagem: '',
  estoque: '',
  tamanhos: 'P,M,G,GG'
};

function AdminPanelPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('sportvault_admin_token');
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');

  const mode = useMemo(() => (editingId ? 'edit' : 'create'), [editingId]);

  const loadProducts = () => {
    getProdutos().then(setProducts);
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadProducts();
  }, [token, navigate]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      preco: Number(form.preco),
      estoque: Number(form.estoque)
    };

    const result = editingId
      ? await adminUpdateProduto(editingId, payload, token)
      : await adminCreateProduto(payload, token);

    if (result?.error) {
      setStatus(result.error);
      return;
    }

    setStatus(editingId ? 'Produto atualizado.' : 'Produto criado.');
    setForm(initialForm);
    setEditingId(null);
    loadProducts();
  };

  const onEdit = (product) => {
    setEditingId(product.id);
    setForm({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco,
      marca: product.marca,
      categoria: product.categoria,
      subcategoria: product.subcategoria || '',
      imagem: product.imagem,
      estoque: product.estoque,
      tamanhos: product.tamanhos || 'P,M,G,GG'
    });
  };

  const onDelete = async (id) => {
    await adminDeleteProduto(id, token);
    loadProducts();
  };

  const logout = () => {
    localStorage.removeItem('sportvault_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h1 className="text-xl font-bold">Painel do Administrador</h1>
        <button className="rounded-full border border-zinc-400 px-4 py-2 text-sm" onClick={logout}>Sair</button>
      </div>

      <form className="grid gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft md:grid-cols-2" onSubmit={onSubmit}>
        <input className="rounded-lg border border-zinc-300 p-3" placeholder="Nome" value={form.nome} onChange={(e) => setField('nome', e.target.value)} required />
        <input className="rounded-lg border border-zinc-300 p-3" placeholder="Marca" value={form.marca} onChange={(e) => setField('marca', e.target.value)} required />
        <input className="rounded-lg border border-zinc-300 p-3" placeholder="Categoria" value={form.categoria} onChange={(e) => setField('categoria', e.target.value)} required />
        <input className="rounded-lg border border-zinc-300 p-3" placeholder="Subcategoria" value={form.subcategoria} onChange={(e) => setField('subcategoria', e.target.value)} required />
        <input type="number" className="rounded-lg border border-zinc-300 p-3" placeholder="Preço" value={form.preco} onChange={(e) => setField('preco', e.target.value)} required />
        <input type="number" className="rounded-lg border border-zinc-300 p-3" placeholder="Estoque" value={form.estoque} onChange={(e) => setField('estoque', e.target.value)} required />
        <input className="rounded-lg border border-zinc-300 p-3 md:col-span-2" placeholder="Tamanhos (ex: P,M,G,GG)" value={form.tamanhos} onChange={(e) => setField('tamanhos', e.target.value)} required />
        <input className="rounded-lg border border-zinc-300 p-3 md:col-span-2" placeholder="URL da imagem" value={form.imagem} onChange={(e) => setField('imagem', e.target.value)} required />
        <textarea className="h-28 rounded-lg border border-zinc-300 p-3 md:col-span-2" placeholder="Descrição" value={form.descricao} onChange={(e) => setField('descricao', e.target.value)} required />

        <div className="flex gap-3 md:col-span-2">
          <button className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white" type="submit">
            {mode === 'edit' ? 'Atualizar produto' : 'Adicionar produto'}
          </button>
          {editingId && (
            <button type="button" className="rounded-full border border-zinc-400 px-5 py-2 text-sm" onClick={() => { setEditingId(null); setForm(initialForm); }}>
              Cancelar edição
            </button>
          )}
        </div>

        {status && <p className="md:col-span-2 text-sm font-medium text-zinc-700">{status}</p>}
      </form>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-soft">
        <h2 className="mb-3 text-lg font-bold">Produtos cadastrados</h2>
        <div className="space-y-3">
          {products.map((product) => (
            <article key={product.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3">
              <div>
                <p className="font-semibold">{product.nome}</p>
                <p className="text-sm text-zinc-500">{product.categoria} • {product.subcategoria} • R$ {Number(product.preco).toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-full border border-zinc-400 px-4 py-1 text-sm" onClick={() => onEdit(product)}>Editar</button>
                <button className="rounded-full bg-black px-4 py-1 text-sm text-white" onClick={() => onDelete(product.id)}>Remover</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminPanelPage;
