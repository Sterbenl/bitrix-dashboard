import db from '../src/lib/database';

// Заполняем базу данных моковыми данными
const mockOrders = [
  {
    userId: 1,
    title: 'Заказ #001',
    status: 'completed',
    amount: 15000,
    date: '2024-01-15',
    description: 'Разработка веб-сайта',
  },
  {
    userId: 1,
    title: 'Заказ #002',
    status: 'pending',
    amount: 25000,
    date: '2024-01-20',
    description: 'Мобильное приложение',
  },
  {
    userId: 1,
    title: 'Заказ #003',
    status: 'completed',
    amount: 8000,
    date: '2024-01-25',
    description: 'Дизайн логотипа',
  },
  {
    userId: 1,
    title: 'Заказ #004',
    status: 'pending',
    amount: 12000,
    date: '2024-02-01',
    description: 'SEO оптимизация',
  },
  {
    userId: 1,
    title: 'Заказ #005',
    status: 'cancelled',
    amount: 5000,
    date: '2024-02-05',
    description: 'Консультация',
  },
  {
    userId: 1,
    title: 'Заказ #006',
    status: 'completed',
    amount: 30000,
    date: '2024-02-10',
    description: 'E-commerce платформа',
  },
];

const mockPayments = [
  {
    userId: 1,
    title: 'Платёж за заказ #001',
    status: 'completed',
    amount: 15000,
    date: '2024-01-15',
    action: 'payment',
  },
  {
    userId: 1,
    title: 'Возврат за заказ #005',
    status: 'completed',
    amount: 5000,
    date: '2024-02-06',
    action: 'refund',
  },
  {
    userId: 1,
    title: 'Платёж за заказ #002',
    status: 'pending',
    amount: 25000,
    date: '2024-01-20',
    action: 'payment',
  },
  {
    userId: 1,
    title: 'Перевод на счёт',
    status: 'completed',
    amount: 10000,
    date: '2024-02-12',
    action: 'transfer',
  },
  {
    userId: 1,
    title: 'Платёж за заказ #003',
    status: 'completed',
    amount: 8000,
    date: '2024-01-25',
    action: 'payment',
  },
];

// Очищаем существующие данные
db.exec('DELETE FROM orders');
db.exec('DELETE FROM payments');
db.exec('DELETE FROM users');

// Создаём тестового пользователя
const insertUser = db.prepare(`
  INSERT INTO users (email, password, firstName, lastName, phone, bitrixContactId)
  VALUES (?, ?, ?, ?, ?, ?)
`);

insertUser.run(
  'test@example.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
  'Тест',
  'Пользователь',
  '+7 (999) 123-45-67',
  1
);

// Вставляем моковые данные
const insertOrder = db.prepare(`
  INSERT INTO orders (userId, title, status, amount, date, description)
  VALUES (?, ?, ?, ?, ?, ?)
`);

const insertPayment = db.prepare(`
  INSERT INTO payments (userId, title, status, amount, date, action)
  VALUES (?, ?, ?, ?, ?, ?)
`);

mockOrders.forEach(order => {
  insertOrder.run(order.userId, order.title, order.status, order.amount, order.date, order.description);
});

mockPayments.forEach(payment => {
  insertPayment.run(payment.userId, payment.title, payment.status, payment.amount, payment.date, payment.action);
});

console.log('Моковые данные успешно добавлены в базу данных');
