import express from 'express';
import cors from 'cors';
import { db, initDb } from './db.js';

const app = express();
const PORT = 3001;

initDb();

app.use(cors());
app.use(express.json());

app.get('/api/produtos', (req, res) => {
  const { categoria, marca, busca, min, max } = req.query;

  const filters = [];
  const params = [];

  if (categoria) {
    filters.push('categoria = ?');
    params.push(categoria);
  }
  if (marca) {
    filters.push('marca = ?');
    params.push(marca);
  }
  if (busca) {
    filters.push('(nome LIKE ? OR descricao LIKE ?)');
    params.push(`%${busca}%`, `%${busca}%`);
  }
  if (min) {
    filters.push('preco >= ?');
    params.push(Number(min));
  }
  if (max) {
    filters.push('preco <= ?');
    params.push(Number(max));
  }

  const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

  db.all(`SELECT * FROM Produtos ${whereClause} ORDER BY id DESC`, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao listar produtos' });
    }
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
      res.json({
        marcas: marcas.map((m) => m.marca),
        categorias: categorias.map((c) => c.categoria)
      });
    });
  });
});

app.post('/api/pedidos', (req, res) => {
  const { nome, telefone, endereco, pagamento, itens } = req.body;

  if (!nome || !telefone || !endereco || !pagamento || !Array.isArray(itens) || !itens.length) {
    return res.status(400).json({ error: 'Dados de pedido incompletos' });
  }

  const total = itens.reduce((sum, i) => sum + i.preco * i.quantidade, 0);

  db.run(
    'INSERT INTO Pedidos (nome_cliente, telefone, endereco, total, pagamento) VALUES (?, ?, ?, ?, ?)',
    [nome, telefone, endereco, total, pagamento],
    function onInsert(err) {
      if (err) return res.status(500).json({ error: 'Erro ao salvar pedido' });

      const pedidoId = this.lastID;
      const stmt = db.prepare(
        'INSERT INTO ItensPedido (pedido_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)'
      );

      itens.forEach((item) => stmt.run([pedidoId, item.id, item.quantidade, item.preco]));

      stmt.finalize((finalErr) => {
        if (finalErr) return res.status(500).json({ error: 'Erro ao salvar itens do pedido' });
        res.status(201).json({ pedidoId, total });
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor backend ativo em http://localhost:${PORT}`);
});
