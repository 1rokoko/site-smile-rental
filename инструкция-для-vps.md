# Инструкция по установке сайта на VPS сервер

## Требования к серверу
- Ubuntu 20.04 LTS или новее
- Минимум 1GB RAM
- Минимум 10GB свободного места
- Доступ по SSH

## Шаг 1: Подключение к серверу
```bash
ssh root@your-server-ip
# или
ssh username@your-server-ip
```

## Шаг 2: Обновление системы
```bash
sudo apt update
sudo apt upgrade -y
```

## Шаг 3: Установка Node.js
```bash
# Установка Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверка установки
node --version
npm --version
```

## Шаг 4: Установка PM2 (менеджер процессов)
```bash
sudo npm install -g pm2
```

## Шаг 5: Установка Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Шаг 6: Установка Git
```bash
sudo apt install git -y
```

## Шаг 7: Клонирование репозитория
```bash
# Переход в директорию веб-сервера
cd /var/www

# Клонирование репозитория
sudo git clone https://github.com/your-username/site-smile-rental.git

# Переход в папку проекта
cd site-smile-rental/smile-rental-modern

# Установка зависимостей
sudo npm install
```

## Шаг 8: Сборка проекта
```bash
sudo npm run build
```

## Шаг 9: Настройка PM2
```bash
# Создание файла ecosystem.config.js
sudo nano ecosystem.config.js
```

Содержимое файла ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'smile-rental',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/site-smile-rental/smile-rental-modern',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## Шаг 10: Запуск приложения через PM2
```bash
sudo pm2 start ecosystem.config.js
sudo pm2 save
sudo pm2 startup
```

## Шаг 11: Настройка Nginx
```bash
# Создание конфигурации сайта
sudo nano /etc/nginx/sites-available/smile-rental
```

Содержимое файла конфигурации:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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
```

## Шаг 12: Активация конфигурации Nginx
```bash
# Создание символической ссылки
sudo ln -s /etc/nginx/sites-available/smile-rental /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
sudo rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

## Шаг 13: Настройка SSL (опционально, но рекомендуется)
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение SSL сертификата
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## Шаг 14: Настройка файрвола
```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

# Обновление сайта из GitHub

## Автоматическое обновление (рекомендуется)

### Создание скрипта обновления
```bash
sudo nano /var/www/update-site.sh
```

Содержимое скрипта:
```bash
#!/bin/bash
cd /var/www/site-smile-rental
git pull origin main
cd smile-rental-modern
npm install
npm run build
pm2 restart smile-rental
echo "Сайт обновлен: $(date)"
```

### Сделать скрипт исполняемым
```bash
sudo chmod +x /var/www/update-site.sh
```

## Ручное обновление

### Шаг 1: Остановка приложения
```bash
sudo pm2 stop smile-rental
```

### Шаг 2: Обновление кода
```bash
cd /var/www/site-smile-rental
sudo git pull origin main
```

### Шаг 3: Установка новых зависимостей (если есть)
```bash
cd smile-rental-modern
sudo npm install
```

### Шаг 4: Пересборка проекта
```bash
sudo npm run build
```

### Шаг 5: Запуск приложения
```bash
sudo pm2 start smile-rental
```

## Быстрое обновление одной командой
```bash
sudo /var/www/update-site.sh
```

---

# Полезные команды для мониторинга

## Проверка статуса приложения
```bash
pm2 status
pm2 logs smile-rental
```

## Проверка статуса Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
```

## Просмотр логов
```bash
# Логи приложения
pm2 logs smile-rental

# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Перезапуск сервисов
```bash
# Перезапуск приложения
pm2 restart smile-rental

# Перезапуск Nginx
sudo systemctl restart nginx
```

---

# Решение проблем

## Если сайт не открывается
1. Проверьте статус PM2: `pm2 status`
2. Проверьте логи: `pm2 logs smile-rental`
3. Проверьте Nginx: `sudo systemctl status nginx`
4. Проверьте порт: `sudo netstat -tlnp | grep :3000`

## Если обновление не работает
1. Проверьте права доступа: `sudo chown -R www-data:www-data /var/www/site-smile-rental`
2. Проверьте Git статус: `git status`
3. Принудительно обновите: `git reset --hard origin/main`

## Очистка кэша
```bash
cd /var/www/site-smile-rental/smile-rental-modern
sudo rm -rf .next
sudo npm run build
pm2 restart smile-rental
```
