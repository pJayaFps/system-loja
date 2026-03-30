# SportVault - E-commerce de Roupas Esportivas

Projeto fullstack local com:

- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express
- Banco: SQLite local em `backend/loja.db`
- Carrinho persistido no `localStorage`
- Checkout com Pix/Cartão (simulado)
- Geração automática de link para envio do pedido via WhatsApp

## Como rodar

```bash
npm install
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend/API: http://localhost:3001

## Banco de dados local

O arquivo SQLite é criado automaticamente ao iniciar o backend:

- `backend/loja.db`

Tabelas:

- `Produtos`
- `Pedidos`
- `ItensPedido`

## Funcionalidades

- Header fixo com busca, login, favoritos e carrinho com contador.
- Menu de categorias com mega menu em hover.
- Banner principal com carrossel automático e CTA.
- Seção de marcas clicável para filtro.
- Listagem de produtos em grid responsivo com filtros laterais.
- Página de produto com galeria, tamanho e ações de compra.
- Carrinho com alteração de quantidade e remoção.
- Checkout com persistência em SQLite.
- Botão para envio do pedido no WhatsApp com mensagem formatada.

## Estrutura

- `backend/src/server.js` → rotas API
- `backend/src/db.js` → criação/seed do SQLite
- `frontend/src` → aplicação React/Tailwind
