import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'loja.db');

export const db = new sqlite3.Database(dbPath);

const produtosSeed = [
  ['Tênis Runner Pro', 'Tênis leve para corrida urbana e treinos intensos.', 399.9, 'SprintX', 'Corrida', 'Academia e Fitness', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', 22, '38,39,40,41,42'],
  ['Camiseta Dry Fit Elite', 'Tecido respirável com secagem rápida.', 89.9, 'Move', 'Roupas', 'Academia e Fitness', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900', 45, 'P,M,G,GG'],
  ['Bermuda Performance', 'Bermuda com elasticidade e conforto térmico.', 119.9, 'Move', 'Homens', 'Academia e Fitness', 'https://images.unsplash.com/photo-1506629905607-bb5f4f8fb3d8?w=900', 33, 'P,M,G,GG'],
  ['Top Training Flex', 'Sustentação média para treinos funcionais.', 99.9, 'Vita', 'Mulheres', 'Academia e Fitness', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900', 26, 'P,M,G'],
  ['Chuteira Campo X1', 'Tração e estabilidade para campo natural.', 349.9, 'GoalPro', 'Futebol', 'Chuteiras', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=900', 14, '38,39,40,41,42,43']
];

const brandPromosSeed = [
  ['Aster Run', 'a partir de 20% OFF', '20% OFF', 'Corrida', '', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900', 1],
  ['Black Mountain', 'a partir de 25% OFF', '25% OFF', 'Esportes', 'Aventura', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', 1],
  ['Velocity Pro', 'a partir de 30% OFF', '30% OFF', 'Esportes', 'Academia e Fitness', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900', 1]
];

const cuponsSeed = [
  ['BEMVINDO10', 'Cupom de boas-vindas', 'percent', 10, 0, 1],
  ['SPORT20', 'Cupom para compras acima de R$ 200', 'percent', 20, 200, 1]
];

function ensureColumn(table, column, type, afterCreateCallback) {
  db.all(`PRAGMA table_info(${table})`, (err, columns) => {
    if (err) return;
    const exists = columns.some((col) => col.name === column);
    if (!exists) {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`, afterCreateCallback);
    } else if (afterCreateCallback) {
      afterCreateCallback();
    }
  });
}

export function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL,
      marca TEXT NOT NULL,
      categoria TEXT NOT NULL,
      subcategoria TEXT DEFAULT '',
      imagem TEXT NOT NULL,
      estoque INTEGER NOT NULL,
      tamanhos TEXT DEFAULT 'P,M,G,GG'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_cliente TEXT NOT NULL,
      telefone TEXT NOT NULL,
      endereco TEXT NOT NULL,
      total REAL NOT NULL,
      pagamento TEXT NOT NULL,
      cupom_codigo TEXT DEFAULT '',
      desconto_cupom REAL DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS ItensPedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pedido_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco REAL NOT NULL,
      FOREIGN KEY(pedido_id) REFERENCES Pedidos(id),
      FOREIGN KEY(produto_id) REFERENCES Produtos(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS BrandPromos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      desconto TEXT NOT NULL,
      categoria TEXT NOT NULL,
      subcategoria TEXT DEFAULT '',
      imagem TEXT NOT NULL,
      ativo INTEGER DEFAULT 1
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Cupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT NOT NULL UNIQUE,
      descricao TEXT NOT NULL,
      tipo TEXT NOT NULL DEFAULT 'percent',
      valor REAL NOT NULL,
      minimo REAL DEFAULT 0,
      ativo INTEGER DEFAULT 1
    )`);

    ensureColumn('Produtos', 'subcategoria', "TEXT DEFAULT ''", () => {
      db.run("UPDATE Produtos SET subcategoria = categoria WHERE subcategoria IS NULL OR subcategoria = ''");
    });
    ensureColumn('Produtos', 'tamanhos', "TEXT DEFAULT 'P,M,G,GG'");
    ensureColumn('Pedidos', 'cupom_codigo', "TEXT DEFAULT ''");
    ensureColumn('Pedidos', 'desconto_cupom', 'REAL DEFAULT 0');

    db.get('SELECT COUNT(*) as total FROM Produtos', (err, row) => {
      if (!err && row.total === 0) {
        const stmt = db.prepare(
          'INSERT INTO Produtos (nome, descricao, preco, marca, categoria, subcategoria, imagem, estoque, tamanhos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        produtosSeed.forEach((produto) => stmt.run(produto));
        stmt.finalize();
      }
    });

    db.get('SELECT COUNT(*) as total FROM BrandPromos', (err, row) => {
      if (!err && row.total === 0) {
        const stmt = db.prepare(
          'INSERT INTO BrandPromos (nome, descricao, desconto, categoria, subcategoria, imagem, ativo) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        brandPromosSeed.forEach((promo) => stmt.run(promo));
        stmt.finalize();
      }
    });

    db.get('SELECT COUNT(*) as total FROM Cupons', (err, row) => {
      if (!err && row.total === 0) {
        const stmt = db.prepare(
          'INSERT INTO Cupons (codigo, descricao, tipo, valor, minimo, ativo) VALUES (?, ?, ?, ?, ?, ?)'
        );
        cuponsSeed.forEach((cupom) => stmt.run(cupom));
        stmt.finalize();
      }
    });
  });
}
