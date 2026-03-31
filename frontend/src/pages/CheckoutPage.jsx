import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { criarPedido } from '../utils/api';
import { formatPrice } from '../utils/format';

const WHATSAPP_NUMBER = '5511999999999';

function CheckoutPage() {
  const { cart, totals, clearCart, coupon } = useCart();
  const [form, setForm] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    complemento: '',
    pagamento: 'Pix'
  });
  const [status, setStatus] = useState(null);
  const [whatsUrl, setWhatsUrl] = useState('');

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const finalizar = async (event) => {
    event.preventDefault();

    const enderecoCompleto = `Rua: ${form.rua}, Nº: ${form.numero}, Bairro: ${form.bairro}, Cidade: ${form.cidade}${form.complemento ? `, Complemento: ${form.complemento}` : ''}`;

    const payload = {
      nome: `${form.nome} ${form.sobrenome}`.trim(),
      telefone: form.telefone,
      endereco: enderecoCompleto,
      pagamento: form.pagamento,
      itens: cart.map((item) => ({ id: item.id, quantidade: item.quantidade, preco: item.preco, nome: item.nome, tamanho: item.tamanho })),
      cupomCodigo: coupon?.codigo || '',
      descontoCupom: totals.desconto
    };

    const response = await criarPedido(payload);

    if (response?.pedidoId) {
      const itens = cart
        .map((item) => `- ${item.nome} | Tam: ${item.tamanho} | ${item.quantidade}x | R$ ${formatPrice(item.preco * item.quantidade)}`)
        .join('%0A');
      const mensagem = `Novo Pedido SportVault%0ACliente: ${payload.nome}%0ATelefone: ${payload.telefone}%0AEndereço: ${payload.endereco}%0AItens:%0A${itens}%0ADesconto: R$ ${formatPrice(totals.desconto)}%0ATotal: R$ ${formatPrice(totals.finalAmount)}%0ACupom: ${payload.cupomCodigo || '-'}%0APagamento: ${payload.pagamento}`;

      setWhatsUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`);
      setStatus(`Pedido #${response.pedidoId} criado com sucesso!`);
      clearCart();
      return;
    }

    setStatus('Erro ao finalizar pedido.');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <form className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft" onSubmit={finalizar}>
        <h2 className="text-2xl font-bold">Checkout</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Nome" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('nome', e.target.value)} />
          <input required placeholder="Sobrenome" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('sobrenome', e.target.value)} />
        </div>

        <input required placeholder="Telefone" className="w-full rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('telefone', e.target.value)} />

        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Nome da rua" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('rua', e.target.value)} />
          <input required placeholder="Número" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('numero', e.target.value)} />
          <input required placeholder="Bairro" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('bairro', e.target.value)} />
          <input required placeholder="Cidade" className="rounded-lg border border-zinc-300 p-3" onChange={(e) => setField('cidade', e.target.value)} />
          <input placeholder="Complemento (opcional)" className="rounded-lg border border-zinc-300 p-3 sm:col-span-2" onChange={(e) => setField('complemento', e.target.value)} />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Pagamento</p>
          <div className="flex gap-4 text-sm">
            {['Pix', 'Cartão (simulado)'].map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input type="radio" checked={form.pagamento === option} onChange={() => setField('pagamento', option)} />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">Finalizar pedido</button>

        {status && <p className="font-medium text-zinc-700">{status}</p>}
        {whatsUrl && (
          <a className="inline-block rounded-full border border-black px-6 py-2 text-sm font-semibold" href={whatsUrl} target="_blank" rel="noreferrer">
            Enviar pedido no WhatsApp
          </a>
        )}
      </form>

      <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-5 shadow-soft">
        <h3 className="mb-3 text-lg font-bold">Resumo do pedido</h3>
        <div className="space-y-2 text-sm">
          {cart.map((item) => (
            <div key={`${item.id}-${item.tamanho}`} className="flex justify-between text-zinc-700">
              <span>{item.nome} x{item.quantidade}</span>
              <span>R$ {formatPrice(item.preco * item.quantidade)}</span>
            </div>
          ))}
          <div className="flex justify-between"><span>Desconto</span><span>- R$ {formatPrice(totals.desconto)}</span></div>
          <hr className="my-2" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span>R$ {formatPrice(totals.finalAmount)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default CheckoutPage;
