const http = require('http');

console.log('🚀 ЗАПУСК ТЕСТОВОГО СЕРВЕРА');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; }
        h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
        .social-buttons { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
        .social-btn { padding: 10px 20px; border: none; border-radius: 5px; color: white; text-decoration: none; font-weight: bold; }
        .whatsapp { background-color: #25d366; }
        .telegram { background-color: #0088cc; }
        .contact-info { text-align: center; margin: 20px 0; font-size: 18px; }
        nav { background-color: #2c3e50; padding: 10px 0; margin-bottom: 20px; border-radius: 5px; }
        nav ul { list-style: none; display: flex; justify-content: center; margin: 0; padding: 0; }
        nav li { margin: 0 20px; }
        nav a { color: white; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#scooters">Scooters</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#about">About</a></li>
            </ul>
        </nav>
        
        <h1>🛵 Smile Rental Phuket - №1 Scooter Rental for Safety and Comfort</h1>
        
        <div class="contact-info">
            📞 Contact us: +66 123 456 789
        </div>
        
        <div class="social-buttons">
            <a href="https://wa.me/66123456789" class="social-btn whatsapp">WhatsApp</a>
            <a href="https://t.me/smilerentalphuket" class="social-btn telegram">Telegram</a>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <h2>🌟 Why Choose Smile Rental Phuket?</h2>
            <ul style="text-align: left; max-width: 600px; margin: 0 auto;">
                <li>✅ Premium quality scooters</li>
                <li>✅ Full insurance coverage</li>
                <li>✅ 24/7 customer support</li>
                <li>✅ Free delivery to your hotel</li>
                <li>✅ Competitive prices</li>
                <li>✅ Safety equipment included</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
            <h3>🏆 Trustpilot Reviews</h3>
            <p>⭐⭐⭐⭐⭐ Excellent service and reliable scooters!</p>
            <p>⭐⭐⭐⭐⭐ Best rental experience in Phuket!</p>
        </div>
    </div>
</body>
</html>
`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
});

server.listen(3000, () => {
    console.log('✅ Сервер запущен на http://localhost:3000');
});

server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.log('❌ Порт 3000 занят, пробуем 3001...');
        server.listen(3001, () => {
            console.log('✅ Сервер запущен на http://localhost:3001');
        });
    }
});
