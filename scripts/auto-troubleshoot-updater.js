#!/usr/bin/env node

/**
 * Автоматический обновлятель файла TROUBLESHOOTING_GUIDE.md
 * Отслеживает проблемы и добавляет новые решения
 */

const fs = require('fs');
const path = require('path');

class TroubleshootingUpdater {
    constructor() {
        this.troubleshootingFile = path.join(process.cwd(), 'TROUBLESHOOTING_GUIDE.md');
        this.logFile = path.join(process.cwd(), 'logs', 'troubleshooting.log');
        this.knownIssues = new Set();
        this.loadKnownIssues();
    }

    /**
     * Загружает известные проблемы из файла
     */
    loadKnownIssues() {
        try {
            if (fs.existsSync(this.troubleshootingFile)) {
                const content = fs.readFileSync(this.troubleshootingFile, 'utf8');
                const issues = content.match(/### Проблема: (.+)/g) || [];
                issues.forEach(issue => {
                    const problemName = issue.replace('### Проблема: ', '');
                    this.knownIssues.add(problemName);
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки известных проблем:', error);
        }
    }

    /**
     * Определяет тип проблемы по ошибке
     */
    detectProblemType(error) {
        const errorPatterns = {
            'EADDRINUSE': {
                title: 'Порт уже используется',
                category: 'server',
                severity: 'critical',
                solution: `# Убить процесс на порту и перезапустить
ssh root@38.180.122.239 "fuser -k 3000/tcp && killall -9 node"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && PORT=3001 pm2 start 'npm start' --name smile-rental"
ssh root@38.180.122.239 "sed -i 's/proxy_pass http:\\/\\/localhost:3000/proxy_pass http:\\/\\/localhost:3001/g' /etc/nginx/sites-available/smilerentalphuket.com && nginx -t && systemctl reload nginx"`
            },
            'Application error': {
                title: 'Ошибка приложения на фронтенде',
                category: 'frontend',
                severity: 'critical',
                solution: `# Проверить статус PM2 и перезапустить
ssh root@38.180.122.239 "pm2 status"
ssh root@38.180.122.239 "pm2 logs smile-rental --lines 10"
ssh root@38.180.122.239 "pm2 restart smile-rental"`
            },
            'npm ERR!': {
                title: 'Ошибка NPM при установке зависимостей',
                category: 'dependencies',
                severity: 'medium',
                solution: `# Очистить кэш npm и переустановить
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && rm -rf node_modules package-lock.json"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm cache clean --force && npm install"`
            },
            'ENOENT': {
                title: 'Файл или директория не найдены',
                category: 'filesystem',
                severity: 'medium',
                solution: `# Проверить существование файлов и восстановить
ssh root@38.180.122.239 "ls -la /var/www/smilerentalphuket.com/site-smile-rental/"
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && git status && git pull origin main"`
            },
            '404': {
                title: 'Страница не найдена (404)',
                category: 'routing',
                severity: 'medium',
                solution: `# Пересобрать проект и проверить маршруты
ssh root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && npm run build"
ssh root@38.180.122.239 "pm2 restart smile-rental"
# Проверить что файлы страниц существуют в src/app/`
            },
            'permission denied': {
                title: 'Отказано в доступе',
                category: 'permissions',
                severity: 'medium',
                solution: `# Исправить права доступа
ssh root@38.180.122.239 "chown -R root:root /var/www/smilerentalphuket.com/site-smile-rental"
ssh root@38.180.122.239 "chmod -R 755 /var/www/smilerentalphuket.com/site-smile-rental"`
            }
        };

        for (const [pattern, config] of Object.entries(errorPatterns)) {
            if (error.toLowerCase().includes(pattern.toLowerCase())) {
                return config;
            }
        }

        return {
            title: 'Неизвестная проблема',
            category: 'unknown',
            severity: 'low',
            solution: '# Требуется ручная диагностика\n# Проверить логи: ssh root@38.180.122.239 "pm2 logs smile-rental --lines 20"'
        };
    }

    /**
     * Добавляет новую проблему в файл
     */
    addNewProblem(error, context = '') {
        const problemConfig = this.detectProblemType(error);
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        // Проверяем, не добавлена ли уже эта проблема
        if (this.knownIssues.has(problemConfig.title)) {
            console.log(`Проблема "${problemConfig.title}" уже известна`);
            return false;
        }

        const newEntry = `

### Проблема: ${problemConfig.title}
**Дата:** ${timestamp}
**Категория:** ${problemConfig.category}
**Критичность:** ${problemConfig.severity}
**Симптомы:** ${error}
${context ? `**Контекст:** ${context}` : ''}

**Решение:**
\`\`\`bash
${problemConfig.solution}
\`\`\`

**Статус:** ❌ Требует проверки

---`;

        try {
            // Добавляем в конец файла перед разделителем
            let content = fs.readFileSync(this.troubleshootingFile, 'utf8');
            const separatorIndex = content.lastIndexOf('---');



            if (separatorIndex !== -1) {
                content = content.substring(0, separatorIndex) + newEntry + '\n\n---' + content.substring(separatorIndex + 3);
            } else {
                content += newEntry;
            }

            // Обновляем timestamp
            content = content.replace(
                /\*\*Последнее обновление:\*\* .+/,
                `**Последнее обновление:** ${timestamp}`
            );

            fs.writeFileSync(this.troubleshootingFile, content);
            this.knownIssues.add(problemConfig.title);

            console.log(`✅ Добавлена новая проблема: ${problemConfig.title}`);
            this.logActivity(`Добавлена проблема: ${problemConfig.title}`);

            return true;
        } catch (error) {
            console.error('Ошибка при добавлении проблемы:', error);
            console.error('Stack trace:', error.stack);
            return false;
        }
    }

    /**
     * Отмечает проблему как решенную
     */
    markProblemSolved(problemTitle) {
        try {
            let content = fs.readFileSync(this.troubleshootingFile, 'utf8');

            // Экранируем специальные символы в названии проблемы
            const escapedTitle = problemTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const problemRegex = new RegExp(`(### Проблема: ${escapedTitle}[\\s\\S]*?)\\*\\*Статус:\\*\\* ❌ Требует проверки`, 'g');

            const newContent = content.replace(problemRegex, `$1**Статус:** ✅ Решено`);

            if (newContent !== content) {
                fs.writeFileSync(this.troubleshootingFile, newContent);
                console.log(`✅ Проблема "${problemTitle}" отмечена как решенная`);
                this.logActivity(`Решена проблема: ${problemTitle}`);
                return true;
            } else {
                console.log(`⚠️ Проблема "${problemTitle}" не найдена или уже решена`);
                return false;
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса проблемы:', error);
            console.error('Stack trace:', error.stack);
            return false;
        }
    }

    /**
     * Логирует активность
     */
    logActivity(message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${message}\n`;
        
        try {
            const logDir = path.dirname(this.logFile);
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            console.error('Ошибка записи в лог:', error);
        }
    }

    /**
     * Анализирует логи PM2 на предмет новых ошибок
     */
    async analyzePM2Logs() {
        // Эта функция может быть расширена для автоматического анализа логов
        console.log('Анализ логов PM2...');
        // Здесь можно добавить логику для подключения к серверу и анализа логов
    }

    /**
     * Проверяет доступность сайта
     */
    async checkSiteHealth() {
        const https = require('https');
        
        return new Promise((resolve) => {
            const req = https.get('https://smilerentalphuket.com/scooter-rental/', (res) => {
                if (res.statusCode === 200) {
                    resolve({ status: 'ok', code: res.statusCode });
                } else {
                    resolve({ status: 'error', code: res.statusCode, error: `HTTP ${res.statusCode}` });
                }
            });

            req.on('error', (error) => {
                resolve({ status: 'error', error: error.message });
            });

            req.setTimeout(10000, () => {
                req.destroy();
                resolve({ status: 'error', error: 'Timeout' });
            });
        });
    }
}

// Экспорт для использования в других скриптах
module.exports = TroubleshootingUpdater;

// Если запускается напрямую
if (require.main === module) {
    const updater = new TroubleshootingUpdater();
    
    // Пример использования
    const args = process.argv.slice(2);
    
    if (args[0] === 'add' && args[1]) {
        updater.addNewProblem(args[1], args[2] || '');
    } else if (args[0] === 'solve' && args[1]) {
        updater.markProblemSolved(args[1]);
    } else if (args[0] === 'check') {
        updater.checkSiteHealth().then(result => {
            console.log('Статус сайта:', result);
            if (result.status === 'error') {
                updater.addNewProblem(result.error, 'Автоматическая проверка доступности сайта');
            }
        });
    } else {
        console.log(`
Использование:
  node auto-troubleshoot-updater.js add "описание ошибки" ["контекст"]
  node auto-troubleshoot-updater.js solve "название проблемы"
  node auto-troubleshoot-updater.js check

Примеры:
  node auto-troubleshoot-updater.js add "EADDRINUSE: address already in use :::3000"
  node auto-troubleshoot-updater.js solve "Порт уже используется"
  node auto-troubleshoot-updater.js check
        `);
    }
}
