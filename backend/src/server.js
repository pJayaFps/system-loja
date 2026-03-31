import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { db, initDb } from './db.js';

const app = express();
const PORT = 3001;
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';
const adminTokens = new Set();

initDb();

app.use(cors());
app.use(express.json());

function ensureAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();
  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  return next();
}

app.post('/api/admin/login', (req, res) => {
  const { usuario, senha } = req.body;
  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    const token = crypto.randomBytes(24).toString('hex');
    adminTokens.add(token);
    return res.json({ token });
  }
  return res.status(401).json({ error: 'Credenciais inválidas' });
});

app.get('/api/produtos', (req, res) => {
  const { categoria, subcategoria, marca, busca, min, max } = req.query;
  const filters = [];
  const params = [];

  if (categoria) { filters.push('categoria = ?'); params.push(categoria); }
  if (subcategoria) { filters.push('subcategoria = ?'); params.push(subcategoria); }
  if (marca) { filters.push('marca = ?'); params.push(marca); }
  if (busca) {
    filters.push('(nome LIKE ? OR descricao LIKE ? OR subcategoria LIKE ?)');
    params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }
  if (min) { filters.push('preco >= ?'); params.push(Number(min)); }
  if (max) { filters.push('preco <= ?'); params.push(Number(max)); }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  db.all(`SELECT * FROM Produtos ${whereClause} ORDER BY id DESC`, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar produtos' });
    res.json(rows);
  });
});

app.get('/api/produtos/:id', (req, res) => {
  db.get('SELECT * FROM Produtos WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar produto' });
    if (!row) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(row);
  });
});

app.get('/api/filtros', (_req, res) => {
  db.all('SELECT DISTINCT marca FROM Produtos ORDER BY marca', (errM, marcas) => {
    if (errM) return res.status(500).json({ error: 'Erro ao buscar marcas' });
    db.all('SELECT DISTINCT categoria FROM Produtos ORDER BY categoria', (errC, categorias) => {
      if (errC) return res.status(500).json({ error: 'Erro ao buscar categorias' });
      db.all('SELECT DISTINCT subcategoria FROM Produtos WHERE subcategoria != "" ORDER BY subcategoria', (errS, subcategorias) => {
        if (errS) return res.status(500).json({ error: 'Erro ao buscar subcategorias' });
        res.json({
          marcas: marcas.map((m) => m.marca),
          categorias: categorias.map((c) => c.categoria),
          subcategorias: subcategorias.map((s) => s.subcategoria)
        });
      });
    });
  });
});

app.get('/api/brand-promos', (_req, res) => {
  db.all('SELECT * FROM BrandPromos WHERE ativo = 1 ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao carregar divulgações' });
    res.json(rows);
  });
});

app.post('/api/cupons/validar', (req, res) => {
  const { codigo, subtotal } = req.body;
  if (!codigo) return res.status(400).json({ error: 'Informe um cupom' });

  db.get('SELECT * FROM Cupons WHERE UPPER(codigo) = UPPER(?) AND ativo = 1', [codigo], (err, cupom) => {
    if (err) return res.status(500).json({ error: 'Erro ao validar cupom' });
    if (!cupom) return res.status(404).json({ error: 'Cupom inválido' });

    const total = Number(subtotal || 0);
    if (total < Number(cupom.minimo || 0)) {
      return res.status(400).json({ error: `Cupom disponível para compras acima de R$ ${cupom.minimo}` });
    }

    const desconto = cupom.tipo === 'percent'
      ? (total * Number(cupom.valor || 0)) / 100
      : Number(cupom.valor || 0);

    return res.json({
      codigo: cupom.codigo,
      descricao: cupom.descricao,
      desconto: Number(desconto.toFixed(2)),
      totalComDesconto: Math.max(0, Number((total - desconto).toFixed(2)))
    });
  });
});

app.post('/api/pedidos', (req, res) => {
  const { nome, telefone, endereco, pagamento, itens, cupomCodigo, descontoCupom } = req.body;
  if (!nome || !telefone || !endereco || !pagamento || !Array.isArray(itens) || !itens.length) {
    return res.status(400).json({ error: 'Dados de pedido incompletos' });
  }

  const subtotal = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);
  const desconto = Number(descontoCupom || 0);
  const total = Math.max(0, subtotal - desconto);

  db.run(
    'INSERT INTO Pedidos (nome_cliente, telefone, endereco, total, pagamento, cupom_codigo, desconto_cupom) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nome, telefone, endereco, total, pagamento, cupomCodigo || '', desconto],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Erro ao salvar pedido' });
      const pedidoId = this.lastID;
      const stmt = db.prepare('INSERT INTO ItensPedido (pedido_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)');
      itens.forEach((item) => stmt.run([pedidoId, item.id, item.quantidade, item.preco]));
      stmt.finalize((finalErr) => {
        if (finalErr) return res.status(500).json({ error: 'Erro ao salvar itens do pedido' });
        res.status(201).json({ pedidoId, total });
      });
    }
  );
});

// Admin produtos
app.post('/api/admin/produtos', ensureAdmin, (req, res) => {
  const { nome, descricao, preco, marca, categoria, subcategoria, imagem, estoque, tamanhos } = req.body;
  db.run(
    'INSERT INTO Produtos (nome, descricao, preco, marca, categoria, subcategoria, imagem, estoque, tamanhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [nome, descricao, Number(preco), marca, categoria, subcategoria || '', imagem, Number(estoque), tamanhos || 'P,M,G,GG'],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Erro ao criar produto' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/admin/produtos/:id', ensureAdmin, (req, res) => {
  const { nome, descricao, preco, marca, categoria, subcategoria, imagem, estoque, tamanhos } = req.body;
  db.run(
    `UPDATE Produtos
     SET nome = ?, descricao = ?, preco = ?, marca = ?, categoria = ?, subcategoria = ?, imagem = ?, estoque = ?, tamanhos = ?
     WHERE id = ?`,
    [nome, descricao, Number(preco), marca, categoria, subcategoria || '', imagem, Number(estoque), tamanhos || 'P,M,G,GG', req.params.id],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar produto' });
      res.json({ updated: this.changes > 0 });
    }
  );
});

app.delete('/api/admin/produtos/:id', ensureAdmin, (req, res) => {
  db.run('DELETE FROM Produtos WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: 'Erro ao remover produto' });
    res.json({ deleted: this.changes > 0 });
  });
});

// Admin brand promos
app.get('/api/admin/brand-promos', ensureAdmin, (_req, res) => {
  db.all('SELECT * FROM BrandPromos ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar divulgações' });
    res.json(rows);
  });
});

app.post('/api/admin/brand-promos', ensureAdmin, (req, res) => {
  const { nome, descricao, desconto, categoria, subcategoria, imagem, ativo } = req.body;
  db.run(
    'INSERT INTO BrandPromos (nome, descricao, desconto, categoria, subcategoria, imagem, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nome, descricao, desconto, categoria, subcategoria || '', imagem, ativo ? 1 : 0],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Erro ao criar divulgação' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/admin/brand-promos/:id', ensureAdmin, (req, res) => {
  const { nome, descricao, desconto, categoria, subcategoria, imagem, ativo } = req.body;
  db.run(
    'UPDATE BrandPromos SET nome = ?, descricao = ?, desconto = ?, categoria = ?, subcategoria = ?, imagem = ?, ativo = ? WHERE id = ?',
    [nome, descricao, desconto, categoria, subcategoria || '', imagem, ativo ? 1 : 0, req.params.id],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar divulgação' });
      res.json({ updated: this.changes > 0 });
    }
  );
});

app.delete('/api/admin/brand-promos/:id', ensureAdmin, (req, res) => {
  db.run('DELETE FROM BrandPromos WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: 'Erro ao remover divulgação' });
    res.json({ deleted: this.changes > 0 });
  });
});

// Admin cupons
app.get('/api/admin/cupons', ensureAdmin, (_req, res) => {
  db.all('SELECT * FROM Cupons ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao listar cupons' });
    res.json(rows);
  });
});

app.post('/api/admin/cupons', ensureAdmin, (req, res) => {
  const { codigo, descricao, tipo, valor, minimo, ativo } = req.body;
  db.run(
    'INSERT INTO Cupons (codigo, descricao, tipo, valor, minimo, ativo) VALUES (?, ?, ?, ?, ?, ?)',
    [String(codigo || '').toUpperCase(), descricao, tipo || 'percent', Number(valor), Number(minimo || 0), ativo ? 1 : 0],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Erro ao criar cupom (código duplicado?)' });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.put('/api/admin/cupons/:id', ensureAdmin, (req, res) => {
  const { codigo, descricao, tipo, valor, minimo, ativo } = req.body;
  db.run(
    'UPDATE Cupons SET codigo = ?, descricao = ?, tipo = ?, valor = ?, minimo = ?, ativo = ? WHERE id = ?',
    [String(codigo || '').toUpperCase(), descricao, tipo || 'percent', Number(valor), Number(minimo || 0), ativo ? 1 : 0, req.params.id],
    function onUpdate(err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar cupom' });
      res.json({ updated: this.changes > 0 });
    }
  );
});

app.delete('/api/admin/cupons/:id', ensureAdmin, (req, res) => {
  db.run('DELETE FROM Cupons WHERE id = ?', [req.params.id], function onDelete(err) {
    if (err) return res.status(500).json({ error: 'Erro ao remover cupom' });
    res.json({ deleted: this.changes > 0 });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend ativo em http://localhost:${PORT}`);
});
