import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '..', 'loja.db');

export const db = new sqlite3.Database(dbPath);

const produtosSeed = [
  ['Tênis Runner Pro', 'Tênis leve para corrida urbana e treinos intensos.', 399.9, 'SprintX', 'Corrida', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900', 22],
  ['Camiseta Dry Fit Elite', 'Tecido respirável com secagem rápida.', 89.9, 'Move', 'Roupas', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900', 45],
  ['Bermuda Performance', 'Bermuda com elasticidade e conforto térmico.', 119.9, 'Move', 'Homens', 'https://images.unsplash.com/photo-1506629905607-bb5f4f8fb3d8?w=900', 33],
  ['Top Training Flex', 'Sustentação média para treinos funcionais.', 99.9, 'Vita', 'Mulheres', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900', 26],
  ['Chuteira Campo X1', 'Tração e estabilidade para campo natural.', 349.9, 'GoalPro', 'Futebol', 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=900', 14],
  ['Regata Basquete Street', 'Modelagem ampla com estilo urbano.', 79.9, 'Hoop', 'Basquete', 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=900', 39],
  ['Mochila Sport 25L', 'Compartimentos para treino e dia a dia.', 159.9, 'TrailPack', 'Esportes', 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900', 19],
  ['Jaqueta Corta Vento', 'Proteção leve contra vento e garoa.', 229.9, 'SprintX', 'Roupas', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900', 18],
  ['Tênis Kids Jump', 'Amortecimento macio para crianças.', 219.9, 'JumpKid', 'Crianças', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=900', 31],
  ['Whey Protein 900g', 'Suplemento proteico sabor baunilha.', 149.9, 'NutriCore', 'Suplementos', 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=900', 42],
  ['Tênis Urban Street', 'Conforto casual e estilo minimalista.', 289.9, 'Mono', 'Calçados', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900', 27],
  ['Shorts Outlet Pro', 'Peça promocional com ótimo custo-benefício.', 59.9, 'Outlet+', 'Outlet', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=900', 50]
];

export function initDb() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT NOT NULL,
      preco REAL NOT NULL,
      marca TEXT NOT NULL,
      categoria TEXT NOT NULL,
      imagem TEXT NOT NULL,
      estoque INTEGER NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_cliente TEXT NOT NULL,
      telefone TEXT NOT NULL,
      endereco TEXT NOT NULL,
      total REAL NOT NULL,
      pagamento TEXT NOT NULL,
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

    db.get('SELECT COUNT(*) as total FROM Produtos', (err, row) => {
      if (err) return;
      if (row.total === 0) {
        const stmt = db.prepare(
          'INSERT INTO Produtos (nome, descricao, preco, marca, categoria, imagem, estoque) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        produtosSeed.forEach((produto) => stmt.run(produto));
        stmt.finalize();
      }
    });
  });
}
