import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/database';
import BitrixAPI from '@/lib/bitrix';
import { validateForm } from '@/lib/validation';

const bitrixApi = new BitrixAPI(process.env.BITRIX_WEBHOOK_URL || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, firstName, lastName, phone } = body;

    if (action === 'login') {
      // Логин
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;

      if (!user) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
      }

      // Удаляем пароль из ответа
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        message: 'Успешный вход',
        user: userWithoutPassword,
        token: 'mock-jwt-token', // В реальном приложении здесь должен быть JWT токен
      });
    } else if (action === 'register') {
      // Регистрация
      const validation = validateForm({ email, password, firstName, lastName, phone });
      
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
      }

      // Проверяем, существует ли пользователь
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
      
      if (existingUser) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
      }

      // Хешируем пароль
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаём контакт в Битрикс24
      const bitrixContactId = await bitrixApi.createContact({
        NAME: firstName,
        LAST_NAME: lastName,
        EMAIL: email,
        PHONE: phone,
      });

      // Сохраняем пользователя в БД
      const result = db.prepare(`
        INSERT INTO users (email, password, firstName, lastName, phone, bitrixContactId)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(email, hashedPassword, firstName, lastName, phone, bitrixContactId);

      const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid) as any;
      const { password: _, ...userWithoutPassword } = newUser;

      return NextResponse.json({
        message: 'Пользователь успешно зарегистрирован',
        user: userWithoutPassword,
        token: 'mock-jwt-token',
      });
    }

    return NextResponse.json({ error: 'Неверное действие' }, { status: 400 });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
