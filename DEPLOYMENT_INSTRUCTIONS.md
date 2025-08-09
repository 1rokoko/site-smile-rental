# 🚀 ИНСТРУКЦИИ ПО РАЗВЕРТЫВАНИЮ САЙТА

## Текущий статус
- ✅ Сервер доступен (38.180.122.239)
- ❌ Сайт возвращает ошибку 502 (Bad Gateway)
- ✅ SSH ключи созданы локально
- ⚠️ Требуется развертывание приложения

## 🔧 БЫСТРОЕ РЕШЕНИЕ

### Вариант 1: Автоматическое подключение
```bash
ssh root@38.180.122.239
# Пароль: 925LudK9Bv
```

После подключения выполните:
```bash
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
./update-site.sh
```

### Вариант 2: Команды по одной
```bash
# 1. Проверить статус
pm2 list

# 2. Обновить код
cd /var/www/smilerentalphuket.com/site-smile-rental
git pull origin main

# 3. Перейти в папку приложения
cd smile-rental-modern

# 4. Установить зависимости
npm install

# 5. Собрать проект
npm run build

# 6. Перезапустить приложение
pm2 stop smile-rental || echo "App not running"
pm2 start npm --name smile-rental -- start
pm2 save

# 7. Проверить статус
pm2 list
```

## 🌐 ПРОВЕРКА РЕЗУЛЬТАТА

После развертывания:
1. Откройте: http://smilerentalphuket.com
2. Проверьте, что сайт загружается без ошибок
3. Убедитесь, что контент отображается корректно

## 📋 ДИАГНОСТИКА ПРОБЛЕМ

Если сайт не работает:
```bash
# Проверить логи PM2
pm2 logs smile-rental

# Проверить статус Nginx
systemctl status nginx

# Проверить локальный доступ
curl http://localhost:3000

# Перезапустить Nginx при необходимости
systemctl restart nginx
```

## 🔑 SSH КЛЮЧИ

SSH ключи созданы в: `C:\Users\Аркадий\.ssh\smile_rental_key`

Для настройки автоматического подключения без пароля:
1. Скопируйте публичный ключ на сервер
2. Используйте: `ssh smile-rental` (если настроен config)

## ⚡ ЭКСТРЕННОЕ ВОССТАНОВЛЕНИЕ

Если ничего не помогает:
```bash
# Полная перезагрузка приложения
pm2 delete smile-rental
cd /var/www/smilerentalphuket.com/site-smile-rental/smile-rental-modern
npm run build
pm2 start npm --name smile-rental -- start
pm2 save
```

## 📞 ПОДДЕРЖКА

- GitHub репозиторий: https://github.com/1rokoko/site-smile-rental
- Сайт: http://smilerentalphuket.com
- Сервер: 38.180.122.239 (root/925LudK9Bv)
