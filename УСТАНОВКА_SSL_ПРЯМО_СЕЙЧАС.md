# 🔒 УСТАНОВКА SSL СЕРТИФИКАТА - ПРЯМО СЕЙЧАС!

## ⚠️ ТЕКУЩИЙ СТАТУС:
- ❌ **HTTPS НЕ РАБОТАЕТ**: https://smilerentalphuket.com (Connection refused)
- ✅ **HTTP РАБОТАЕТ**: http://smilerentalphuket.com (сайт загружается)
- 🔧 **НУЖНО**: Установить SSL сертификат

## 🚀 ПРОСТАЯ УСТАНОВКА (2 КОМАНДЫ):

### Способ 1: Автоматическая установка
Откройте **Command Prompt** или **PowerShell** и выполните:

```bash
ssh root@38.180.122.239
```
**Пароль:** `[REMOVED]`

Затем выполните:
```bash
curl -s https://raw.githubusercontent.com/1rokoko/site-smile-rental/main/quick-ssl-setup.sh | bash
```

### Способ 2: Пошаговая установка
Если автоматическая установка не работает, выполните команды по очереди:

```bash
# 1. Подключиться к серверу
ssh root@38.180.122.239

# 2. Обновить систему
apt update -y

# 3. Установить Certbot
apt install -y certbot python3-certbot-nginx

# 4. Остановить Nginx
systemctl stop nginx

# 5. Получить SSL сертификат
certbot certonly --standalone -d smilerentalphuket.com --email admin@smilerentalphuket.com --agree-tos --non-interactive

# 6. Создать конфигурацию Nginx с SSL
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

# 7. Проверить конфигурацию
nginx -t

# 8. Запустить Nginx
systemctl start nginx

# 9. Настроить автоматическое обновление
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet --nginx") | crontab -
```

## 🔍 ПРОВЕРКА РЕЗУЛЬТАТА:

После установки проверьте:
1. **HTTPS сайт**: https://smilerentalphuket.com
2. **HTTP перенаправление**: http://smilerentalphuket.com (должен перенаправлять на HTTPS)
3. **SSL рейтинг**: https://www.ssllabs.com/ssltest/

## 🎯 ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:

✅ **https://smilerentalphuket.com** - работает с зеленым замочком
✅ **http://smilerentalphuket.com** - автоматически перенаправляется на HTTPS
✅ **SSL рейтинг A+** на SSL Labs
✅ **Автоматическое обновление** сертификата

## 🆘 ЕСЛИ ВОЗНИКЛИ ПРОБЛЕМЫ:

### Проверить статус сервисов:
```bash
systemctl status nginx
pm2 status
certbot certificates
```

### Проверить логи:
```bash
tail -f /var/log/nginx/error.log
pm2 logs
```

### Перезапустить сервисы:
```bash
systemctl restart nginx
pm2 restart all
```

---

**⏱️ Время установки:** 5-10 минут
**🎯 Результат:** Полностью защищенный HTTPS сайт
**🔒 Безопасность:** SSL сертификат от Let's Encrypt
