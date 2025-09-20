import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import BitrixAPI from '@/lib/bitrix';
import { validateForm } from '@/lib/validation';

const bitrixApi = new BitrixAPI(process.env.BITRIX_WEBHOOK_URL || '');

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone } = body;

    // Получаем пользователя из заголовка (в реальном приложении из JWT токена)
    const userId = request.headers.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
    }

    const validation = validateForm({ firstName, lastName, email, phone });
    
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.errors.join(', ') }, { status: 400 });
    }

    // Получаем текущего пользователя
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(userId)) as any;
    
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // Проверяем, не занят ли email другим пользователем
    if (email !== user.email) {
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, parseInt(userId));
      
      if (existingUser) {
        return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 400 });
      }
    }

    // Обновляем контакт в Битрикс24, если есть bitrixContactId
    if (user.bitrixContactId) {
      const success = await bitrixApi.updateContact(user.bitrixContactId, {
        NAME: firstName,
        LAST_NAME: lastName,
        EMAIL: email,
        PHONE: phone,
      });

      if (!success) {
        return NextResponse.json({ error: 'Ошибка обновления контакта в Битрикс24' }, { status: 500 });
      }
    }

    // Обновляем пользователя в БД
    db.prepare(`
      UPDATE users 
      SET firstName = ?, lastName = ?, email = ?, phone = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(firstName, lastName, email, phone, parseInt(userId));

    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(parseInt(userId)) as any;
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Профиль успешно обновлён',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
