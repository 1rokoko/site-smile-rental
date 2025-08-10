const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Устанавливаем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Полноценная HTML страница сайта
    const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smile Rental Phuket - Аренда скутеров на Пхукете</title>
    <meta name="description" content="Аренда скутеров на Пхукете. Honda PCX, Yamaha NMAX. Бесплатная доставка, страховка включена, 24/7 поддержка.">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        
        .header { 
            background: rgba(255,255,255,0.95); 
            padding: 20px 0; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        .header h1 { 
            text-align: center; 
            color: #2c3e50; 
            font-size: 2.5em; 
            margin-bottom: 10px;
        }
        .header p { 
            text-align: center; 
            color: #7f8c8d; 
            font-size: 1.2em;
        }
        
        .hero { 
            background: rgba(255,255,255,0.9); 
            margin: 20px 0; 
            padding: 40px; 
            border-radius: 15px; 
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .status { 
            background: linear-gradient(45deg, #27ae60, #2ecc71); 
            color: white; 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 30px;
            font-size: 1.3em;
            font-weight: bold;
        }
        
        .services { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 30px 0;
        }
        .service-card { 
            background: white; 
            padding: 30px; 
            border-radius: 10px; 
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        .service-card:hover { transform: translateY(-5px); }
        .service-card h3 { color: #2c3e50; margin-bottom: 15px; font-size: 1.4em; }
        .service-card ul { list-style: none; }
        .service-card li { 
            padding: 8px 0; 
            border-bottom: 1px solid #ecf0f1;
            position: relative;
            padding-left: 25px;
        }
        .service-card li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #27ae60;
            font-weight: bold;
        }
        
        .contact { 
            background: #2c3e50; 
            color: white; 
            padding: 40px; 
            border-radius: 10px; 
            margin: 30px 0;
            text-align: center;
        }
        .contact h3 { margin-bottom: 20px; font-size: 1.8em; }
        .contact-info { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin-top: 20px;
        }
        .contact-item { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 8px;
        }
        
        .footer { 
            background: rgba(0,0,0,0.8); 
            color: white; 
            text-align: center; 
            padding: 30px 0; 
            margin-top: 40px;
        }
        
        .btn { 
            display: inline-block; 
            background: #e74c3c; 
            color: white; 
            padding: 15px 30px; 
            text-decoration: none; 
            border-radius: 25px; 
            margin: 10px; 
            transition: background 0.3s ease;
            font-weight: bold;
        }
        .btn:hover { background: #c0392b; }
        
        @media (max-width: 768px) {
            .header h1 { font-size: 2em; }
            .hero { padding: 20px; }
            .services { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="container">
            <h1>🛵 Smile Rental Phuket</h1>
            <p>Лучшая аренда скутеров на острове Пхукет</p>
        </div>
    </div>
    
    <div class="container">
        <div class="hero">
            <div class="status">
                ✅ САЙТ РАБОТАЕТ! Добро пожаловать на Smile Rental Phuket
            </div>
            <h2>Аренда скутеров на Пхукете</h2>
            <p>Исследуйте красоты Пхукета на наших современных скутерах. Безопасно, удобно и выгодно!</p>
            <a href="#services" class="btn">Выбрать скутер</a>
            <a href="#contact" class="btn">Связаться с нами</a>
        </div>
        
        <div class="services" id="services">
            <div class="service-card">
                <h3>🏍️ Наш автопарк</h3>
                <ul>
                    <li>Honda PCX 150cc - премиум класс</li>
                    <li>Yamaha NMAX 155cc - спортивный стиль</li>
                    <li>Honda Click 125cc - экономичный вариант</li>
                    <li>Все скутеры 2023-2024 года</li>
                    <li>Регулярное техническое обслуживание</li>
                </ul>
            </div>
            
            <div class="service-card">
                <h3>🛡️ Безопасность</h3>
                <ul>
                    <li>Полная страховка включена</li>
                    <li>Качественные шлемы в комплекте</li>
                    <li>Техосмотр перед каждой арендой</li>
                    <li>24/7 техническая поддержка</li>
                    <li>Экстренная помощь на дороге</li>
                </ul>
            </div>
            
            <div class="service-card">
                <h3>🚚 Удобство</h3>
                <ul>
                    <li>Бесплатная доставка по Пхукету</li>
                    <li>Подача к отелю или аэропорту</li>
                    <li>Гибкие условия аренды</li>
                    <li>Онлайн бронирование</li>
                    <li>Русскоговорящий персонал</li>
                </ul>
            </div>
        </div>
        
        <div class="contact" id="contact">
            <h3>📞 Связаться с нами</h3>
            <p>Готовы помочь вам 24/7. Выберите удобный способ связи:</p>
            <div class="contact-info">
                <div class="contact-item">
                    <h4>📱 WhatsApp</h4>
                    <p>+66 123 456 789</p>
                </div>
                <div class="contact-item">
                    <h4>📧 Email</h4>
                    <p>info@smilerentalphuket.com</p>
                </div>
                <div class="contact-item">
                    <h4>📍 Адрес</h4>
                    <p>Patong Beach, Phuket, Thailand</p>
                </div>
                <div class="contact-item">
                    <h4>🕒 Время работы</h4>
                    <p>Ежедневно 8:00 - 22:00</p>
                </div>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <div class="container">
            <p>© 2024 Smile Rental Phuket. Все права защищены.</p>
            <p>Лицензированная компания по аренде транспорта в Таиланде</p>
            <p><strong>Сервер запущен:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        </div>
    </div>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Smile Rental сервер запущен на порту ${PORT}`);
    console.log(`🌐 Локальный доступ: http://localhost:${PORT}`);
    console.log(`🌍 Внешний доступ: http://38.180.122.239:${PORT}`);
    console.log(`🏠 Основной сайт: http://smilerentalphuket.com`);
});
