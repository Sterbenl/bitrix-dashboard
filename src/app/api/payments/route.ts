import { NextResponse } from 'next/server';
import db from '@/lib/database';

export async function GET() {
  try {
    // Получаем все платежи
    const payments = db.prepare('SELECT * FROM payments ORDER BY date DESC').all();

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
