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

export async function getBrandPromos() {
  const response = await fetch(`${API_URL}/brand-promos`);
  return response.json();
}

export async function validarCupom(codigo, subtotal) {
  const response = await fetch(`${API_URL}/cupons/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ codigo, subtotal })
  });
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

export async function adminLogin(usuario, senha) {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, senha })
  });
  return response.json();
}

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

export async function adminCreateProduto(payload, token) {
  const response = await fetch(`${API_URL}/admin/produtos`, {
    method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminUpdateProduto(id, payload, token) {
  const response = await fetch(`${API_URL}/admin/produtos/${id}`, {
    method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminDeleteProduto(id, token) {
  const response = await fetch(`${API_URL}/admin/produtos/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}

export async function adminGetBrandPromos(token) {
  const response = await fetch(`${API_URL}/admin/brand-promos`, { headers: { Authorization: `Bearer ${token}` } });
  return response.json();
}

export async function adminCreateBrandPromo(payload, token) {
  const response = await fetch(`${API_URL}/admin/brand-promos`, {
    method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminUpdateBrandPromo(id, payload, token) {
  const response = await fetch(`${API_URL}/admin/brand-promos/${id}`, {
    method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminDeleteBrandPromo(id, token) {
  const response = await fetch(`${API_URL}/admin/brand-promos/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}

export async function adminGetCupons(token) {
  const response = await fetch(`${API_URL}/admin/cupons`, { headers: { Authorization: `Bearer ${token}` } });
  return response.json();
}

export async function adminCreateCupom(payload, token) {
  const response = await fetch(`${API_URL}/admin/cupons`, {
    method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminUpdateCupom(id, payload, token) {
  const response = await fetch(`${API_URL}/admin/cupons/${id}`, {
    method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload)
  });
  return response.json();
}

export async function adminDeleteCupom(id, token) {
  const response = await fetch(`${API_URL}/admin/cupons/${id}`, {
    method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
}
