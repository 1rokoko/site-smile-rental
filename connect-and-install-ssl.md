# 🔒 Установка SSL Сертификата

## 📋 Простые команды для установки SSL:

### 1. Подключитесь к серверу:
```bash
ssh root@38.180.122.239
```
**Пароль:** `925LudK9Bv`

### 2. Проверьте статус сайта:
```bash
# Проверить статус приложения
pm2 status

# Проверить статус Nginx
systemctl status nginx

# Проверить сайт
curl -I http://localhost:3000
curl -I http://smilerentalphuket.com
```

### 3. Установите SSL сертификат:
```bash
# Обновить систему
apt update

# Установить Certbot
apt install -y certbot python3-certbot-nginx

# Остановить Nginx временно
systemctl stop nginx

# Получить SSL сертификат
certbot certonly --standalone -d smilerentalphuket.com --email admin@smilerentalphuket.com --agree-tos --non-interactive
```

### 4. Настройте Nginx с SSL:
```bash
# Создать новую конфигурацию Nginx с SSL
cat > /etc/nginx/sites-available/smilerentalphuket.com << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name smilerentalphuket.com www.smilerentalphuket.com;
    return 301 https://smilerentalphuket.com$request_uri;
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    server_name smilerentalphuket.com www.smilerentalphuket.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/smilerentalphuket.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smilerentalphuket.com/privkey.pem;
    
    # SSL Security Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    # Main location block for Next.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Проверить конфигурацию
nginx -t

# Запустить Nginx
systemctl start nginx
systemctl enable nginx
```

### 5. Настройте автоматическое обновление:
```bash
# Добавить задачу в cron для автоматического обновления
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -
```

### 6. Проверьте результат:
```bash
# Проверить статус сертификата
certbot certificates

# Проверить сайт с SSL
curl -I https://smilerentalphuket.com

# Проверить автоматическое обновление
certbot renew --dry-run
```

## 🎉 Результат:
- ✅ Сайт доступен по HTTPS: https://smilerentalphuket.com
- ✅ HTTP автоматически перенаправляется на HTTPS
- ✅ SSL сертификат автоматически обновляется
- ✅ Безопасные заголовки настроены

## 🔍 Проверка SSL:
- Онлайн тест: https://www.ssllabs.com/ssltest/
- Проверка сертификата: https://www.digicert.com/help/
