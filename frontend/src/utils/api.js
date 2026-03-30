const API_URL = 'http://localhost:3001/api';

export async function getProdutos(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_URL}/produtos?${params}`);
  return response.json();
}

export async function getProdutoById(id) {
  const response = await fetch(`${API_URL}/produtos/${id}`);
  return response.json();
}

export async function getFiltros() {
  const response = await fetch(`${API_URL}/filtros`);
  return response.json();
}

export async function criarPedido(payload) {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
}
