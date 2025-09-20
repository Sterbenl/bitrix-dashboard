import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Создаём таблицу пользователей
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    phone TEXT,
    bitrixContactId INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Создаём таблицу заказов (моковые данные)
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME NOT NULL,
    description TEXT,
    FOREIGN KEY (userId) REFERENCES users (id)
  )
`);

// Создаём таблицу платежей (моковые данные)
db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL,
    amount REAL NOT NULL,
    date DATETIME NOT NULL,
    action TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
  )
`);

export default db;
