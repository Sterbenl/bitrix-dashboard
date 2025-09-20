import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Получаем все заказы
    const orders = db.prepare('SELECT * FROM orders ORDER BY date DESC').all();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders API error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
