# 🤖 Автоматическая система мониторинга и troubleshooting

Эта система автоматически отслеживает состояние сервера Smile Rental и обновляет troubleshooting guide при обнаружении проблем.

## 🚀 Быстрый старт

### Windows (рекомендуется)
```bash
# Запустить интерактивное меню
monitor-server.bat
```

### Командная строка
```bash
# Одна проверка
npm run troubleshoot:check

# Непрерывный мониторинг
node scripts/server-monitor.js start

# Добавить проблему вручную
npm run troubleshoot:add "описание проблемы"

# Отметить проблему как решенную
npm run troubleshoot:solve "название проблемы"
```

## 📁 Структура файлов

```
scripts/
├── auto-troubleshoot-updater.js  # Основной класс для обновления troubleshooting guide
├── server-monitor.js             # Мониторинг сервера и автоматическое обнаружение проблем
└── README.md                     # Этот файл

monitor-server.bat                # Интерактивное меню для Windows
TROUBLESHOOTING_GUIDE.md          # Автообновляемый guide с решениями
```

## 🔧 Компоненты системы

### 1. TroubleshootingUpdater
**Файл:** `auto-troubleshoot-updater.js`

**Функции:**
- Автоматическое определение типа проблемы по ошибке
- Добавление новых проблем в TROUBLESHOOTING_GUIDE.md
- Отметка проблем как решенных
- Логирование всех действий

**Поддерживаемые типы ошибок:**
- `EADDRINUSE` - Порт уже используется
- `Application error` - Ошибка приложения на фронтенде
- `npm ERR!` - Ошибки NPM
- `ENOENT` - Файл не найден
- `404` - Страница не найдена
- `permission denied` - Проблемы с правами доступа

### 2. ServerMonitor
**Файл:** `server-monitor.js`

**Функции:**
- Проверка доступности URL'ов сайта
- Мониторинг статуса PM2 процессов
- Анализ логов PM2 на наличие ошибок
- Автоматическое добавление найденных проблем в troubleshooting guide
- Непрерывный мониторинг с настраиваемым интервалом

**Проверяемые URL'ы:**
- `https://smilerentalphuket.com/scooter-rental/`
- `https://smilerentalphuket.com/privacy-policy`
- `https://smilerentalphuket.com/scooter-rental/privacy-policy`

## 📊 Что отслеживается

### Доступность сайта
- ✅ HTTP статус код (ожидается 200)
- ✅ Время отклика (предупреждение если >5 секунд)
- ✅ Доступность всех ключевых страниц

### Состояние сервера
- ✅ Статус PM2 процесса `smile-rental`
- ✅ Количество перезапусков (предупреждение если >10)
- ✅ Наличие ошибок в логах

### Автоматические действия
- ✅ Добавление новых проблем в troubleshooting guide
- ✅ Предложение готовых решений
- ✅ Логирование всех событий

## 🛠️ Настройка

### Конфигурация сервера
В файле `server-monitor.js` можно изменить:

```javascript
this.serverConfig = {
    host: '38.180.122.239',
    user: 'root',
    password: '925LudK9Bv',
    projectPath: '/var/www/smilerentalphuket.com/site-smile-rental'
};

this.checkInterval = 5 * 60 * 1000; // 5 минут
```

### Добавление новых URL'ов для проверки
```javascript
this.siteUrls = [
    'https://smilerentalphuket.com/scooter-rental/',
    'https://smilerentalphuket.com/privacy-policy',
    'https://smilerentalphuket.com/scooter-rental/privacy-policy',
    // Добавьте новые URL'ы здесь
];
```

### Добавление новых типов ошибок
В файле `auto-troubleshoot-updater.js` в методе `detectProblemType()`:

```javascript
const errorPatterns = {
    'новая_ошибка': {
        title: 'Описание проблемы',
        category: 'категория',
        severity: 'critical|medium|low',
        solution: `# Команды для решения
ssh root@38.180.122.239 "команда"`
    }
};
```

## 📝 Логирование

### Файлы логов
- `logs/troubleshooting.log` - Все действия системы troubleshooting
- PM2 логи на сервере: `/root/.pm2/logs/smile-rental-*.log`

### Формат логов
```
[2025-01-08T12:15:30.123Z] Добавлена проблема: Порт уже используется
[2025-01-08T12:20:15.456Z] Решена проблема: Порт уже используется
```

## 🔄 Интеграция с деплоем

Система интегрирована в процесс деплоя через npm scripts:

```json
{
  "scripts": {
    "deploy:check": "npm run troubleshoot:check && npm run build",
    "postdeploy": "npm run troubleshoot:check"
  }
}
```

## 🚨 Уведомления

### Типы проблем по критичности

**Critical (критичные):**
- Сайт недоступен
- PM2 процесс не запущен
- Ошибки EADDRINUSE

**Medium (средние):**
- Медленный отклик сайта
- Много перезапусков PM2
- Ошибки в логах

**Low (низкие):**
- Неизвестные ошибки
- Предупреждения в логах

## 🔧 Расширение системы

### Добавление новых проверок
1. Создайте новый метод в классе `ServerMonitor`
2. Добавьте вызов в метод `performFullCheck()`
3. Обновите логику обработки результатов

### Добавление уведомлений
Можно расширить систему для отправки уведомлений:
- Email уведомления
- Slack/Discord интеграция
- Telegram боты

### Пример расширения
```javascript
// В server-monitor.js
async checkDiskSpace() {
    const result = await this.executeSSHCommand('df -h /');
    // Логика проверки свободного места
}

// В performFullCheck()
results.diskSpace = await this.checkDiskSpace();
```

## 📞 Поддержка

При проблемах с системой мониторинга:
1. Проверьте логи: `logs/troubleshooting.log`
2. Запустите ручную проверку: `npm run troubleshoot:check`
3. Проверьте доступность сервера: `ssh root@38.180.122.239`

---

**Автор:** Augment Agent  
**Версия:** 1.0  
**Дата:** 2025-01-08
