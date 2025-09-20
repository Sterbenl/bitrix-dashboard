'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию
    const token = localStorage.getItem('token');
    
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth');
    }
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Перенаправление...</div>
    </div>
  );
}