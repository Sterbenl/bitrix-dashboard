import BitrixAPI from '../src/lib/bitrix';

// Тестируем подключение к Битрикс24
async function testBitrixConnection() {
  const webhookUrl = process.env.BITRIX_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.error('❌ BITRIX_WEBHOOK_URL не настроен в .env.local');
    console.log('📝 Создайте файл .env.local и добавьте:');
    console.log('BITRIX_WEBHOOK_URL=https://your-portal.bitrix24.ru/rest/1/your-webhook-code/');
    return;
  }

  console.log('🔗 Тестируем подключение к Битрикс24...');
  console.log(`📡 Webhook URL: ${webhookUrl}`);

  const bitrixApi = new BitrixAPI(webhookUrl);

  try {
    // Пробуем создать тестовый контакт
    const contactId = await bitrixApi.createContact({
      NAME: 'Тест',
      LAST_NAME: 'Подключения',
      EMAIL: 'test@example.com',
      PHONE: '+7 (999) 123-45-67',
    });

    if (contactId) {
      console.log('✅ Подключение к Битрикс24 успешно!');
      console.log(`📋 Создан тестовый контакт с ID: ${contactId}`);
      console.log('🎉 Интеграция работает корректно!');
    } else {
      console.log('❌ Не удалось создать контакт в Битрикс24');
      console.log('🔍 Проверьте:');
      console.log('   - Правильность URL вебхука');
      console.log('   - Включен ли демо-тариф в Битрикс24');
      console.log('   - Доступность портала Битрикс24');
    }
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error);
  }
}

testBitrixConnection();
