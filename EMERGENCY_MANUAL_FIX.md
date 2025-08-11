# 🚨 КРИТИЧЕСКАЯ СИТУАЦИЯ: Сайт показывает только подвал

## Проблема
Сайт https://smilerentalphuket.com показывает только подвал, весь остальной контент исчез. Ошибка 500: "Cannot find module './548.js'" - поврежденная сборка Next.js.

## Причина
Поврежденная папка `.next` на сервере, которая не очищается автоматическими деплоями.

## ЭКСТРЕННОЕ РЕШЕНИЕ - РУЧНОЕ ВМЕШАТЕЛЬСТВО

### Вариант 1: SSH доступ к серверу
```bash
# 1. Подключиться к серверу
ssh root@38.180.122.239

# 2. Перейти в папку проекта
cd /var/www/smilerentalphuket.com/site-smile-rental

# 3. Остановить все процессы
pm2 stop all
pm2 delete all

# 4. ПОЛНАЯ ОЧИСТКА
rm -rf .next
rm -rf out
rm -rf node_modules
rm -rf package-lock.json
npm cache clean --force

# 5. Получить свежий код
git fetch origin main
git reset --hard origin/main

# 6. Установить зависимости
npm install

# 7. Собрать проект
NODE_ENV=production npm run build

# 8. Запустить
NODE_ENV=production pm2 start npm --name "smile-rental" -- start
pm2 save
```

### Вариант 2: Полная переустановка проекта
```bash
# 1. Создать бэкап
cd /var/www/smilerentalphuket.com
mv site-smile-rental site-smile-rental-backup

# 2. Клонировать заново
git clone https://github.com/1rokoko/site-smile-rental.git

# 3. Перейти в папку
cd site-smile-rental

# 4. Установить зависимости
npm install

# 5. Собрать
NODE_ENV=production npm run build

# 6. Запустить
NODE_ENV=production pm2 start npm --name "smile-rental" -- start
pm2 save
```

## Что должно работать после исправления
- ✅ Полный сайт с хедером, навигацией, Trustpilot
- ✅ Героическая секция с основным контентом
- ✅ Карточки скутеров с изображениями
- ✅ Все секции контента
- ✅ Подвал (Footer)
- ✅ Адаптивный дизайн

## Статус
🔴 **КРИТИЧНО** - Сайт не работает, показывает только подвал
🟡 **ТРЕБУЕТСЯ** - Ручное вмешательство на сервере
🟢 **ЦЕЛЬ** - Восстановить полную функциональность сайта

## Последний рабочий коммит
`2e5d47a` - "EMERGENCY FIX: Add maintenance page cleanup to prevent stuck deployments"

Этот коммит содержал рабочую версию сайта до того, как начались проблемы с Analytics и Tailwind CSS.
