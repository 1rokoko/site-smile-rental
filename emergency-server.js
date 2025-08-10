const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Простая HTML страница
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smile Rental Phuket - Аренда скутеров</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        .header { text-align: center; color: #333; margin-bottom: 30px; }
        .status { background: #4CAF50; color: white; padding: 15px; border-radius: 5px; text-align: center; margin-bottom: 20px; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .footer { text-align: center; color: #666; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛵 Smile Rental Phuket</h1>
            <h2>Аренда скутеров на Пхукете</h2>
        </div>
        
        <div class="status">
            ✅ САЙТ РАБОТАЕТ! Сервер успешно запущен и доступен
        </div>
        
        <div class="info">
            <h3>📋 Информация о сервере:</h3>
            <p><strong>Время:</strong> ${new Date().toLocaleString('ru-RU')}</p>
            <p><strong>Статус:</strong> Онлайн</p>
            <p><strong>Порт:</strong> 80</p>
            <p><strong>Домен:</strong> smilerentalphuket.com</p>
        </div>
        
        <div class="info">
            <h3>🛵 Наши услуги:</h3>
            <ul>
                <li>Аренда скутеров Honda PCX</li>
                <li>Аренда скутеров Yamaha NMAX</li>
                <li>Бесплатная доставка по Пхукету</li>
                <li>Страховка включена</li>
                <li>24/7 поддержка</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 Smile Rental Phuket. Все права защищены.</p>
            <p>Контакты: +66 123 456 789 | info@smilerentalphuket.com</p>
        </div>
    </div>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

const PORT = 80;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Emergency server запущен на порту ${PORT}`);
    console.log(`🌐 Доступен по адресу: http://smilerentalphuket.com`);
    console.log(`📍 IP: http://38.180.122.239`);
});
