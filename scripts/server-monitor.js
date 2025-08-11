#!/usr/bin/env node

/**
 * Автоматический мониторинг сервера
 * Проверяет состояние сайта и автоматически обновляет troubleshooting guide
 */

const { spawn } = require('child_process');
const https = require('https');
const TroubleshootingUpdater = require('./auto-troubleshoot-updater');

class ServerMonitor {
    constructor() {
        this.updater = new TroubleshootingUpdater();
        this.serverConfig = {
            host: '38.180.122.239',
            user: 'root',
            password: '[REMOVED]',
            projectPath: '/var/www/smilerentalphuket.com/site-smile-rental'
        };
        this.siteUrls = [
            'https://smilerentalphuket.com/scooter-rental/',
            'https://smilerentalphuket.com/privacy-policy',
            'https://smilerentalphuket.com/scooter-rental/privacy-policy'
        ];
        this.checkInterval = 5 * 60 * 1000; // 5 минут
        this.isMonitoring = false;
    }

    /**
     * Выполняет SSH команду на сервере
     */
    async executeSSHCommand(command) {
        return new Promise((resolve, reject) => {
            const sshCommand = `ssh -o StrictHostKeyChecking=no ${this.serverConfig.user}@${this.serverConfig.host} "${command}"`;
            
            const process = spawn('ssh', [
                '-o', 'StrictHostKeyChecking=no',
                `${this.serverConfig.user}@${this.serverConfig.host}`,
                command
            ], {
                stdio: ['pipe', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code === 0) {
                    resolve({ success: true, stdout, stderr });
                } else {
                    resolve({ success: false, stdout, stderr, code });
                }
            });

            process.on('error', (error) => {
                reject(error);
            });

            // Автоматически вводим пароль если требуется
            setTimeout(() => {
                process.stdin.write(this.serverConfig.password + '\n');
                process.stdin.end();
            }, 1000);
        });
    }

    /**
     * Проверяет доступность URL
     */
    async checkUrl(url) {
        return new Promise((resolve) => {
            const startTime = Date.now();
            
            const req = https.get(url, (res) => {
                const responseTime = Date.now() - startTime;
                
                if (res.statusCode === 200) {
                    resolve({ 
                        url, 
                        status: 'ok', 
                        code: res.statusCode, 
                        responseTime 
                    });
                } else {
                    resolve({ 
                        url, 
                        status: 'error', 
                        code: res.statusCode, 
                        error: `HTTP ${res.statusCode}`,
                        responseTime 
                    });
                }
            });

            req.on('error', (error) => {
                const responseTime = Date.now() - startTime;
                resolve({ 
                    url, 
                    status: 'error', 
                    error: error.message, 
                    responseTime 
                });
            });

            req.setTimeout(10000, () => {
                req.destroy();
                const responseTime = Date.now() - startTime;
                resolve({ 
                    url, 
                    status: 'error', 
                    error: 'Timeout (>10s)', 
                    responseTime 
                });
            });
        });
    }

    /**
     * Проверяет статус PM2
     */
    async checkPM2Status() {
        try {
            const result = await this.executeSSHCommand('pm2 status');
            
            if (!result.success) {
                return {
                    status: 'error',
                    error: 'Не удалось подключиться к PM2',
                    details: result.stderr
                };
            }

            const output = result.stdout;
            
            // Проверяем наличие процесса smile-rental
            if (!output.includes('smile-rental')) {
                return {
                    status: 'error',
                    error: 'Процесс smile-rental не найден в PM2'
                };
            }

            // Проверяем статус процесса
            if (output.includes('online')) {
                // Проверяем количество перезапусков
                const restartMatch = output.match(/smile-rental.*?(\d+).*?online/);
                const restarts = restartMatch ? parseInt(restartMatch[1]) : 0;
                
                if (restarts > 10) {
                    return {
                        status: 'warning',
                        error: `Слишком много перезапусков: ${restarts}`,
                        restarts
                    };
                }

                return {
                    status: 'ok',
                    restarts
                };
            } else {
                return {
                    status: 'error',
                    error: 'Процесс smile-rental не в статусе online'
                };
            }
        } catch (error) {
            return {
                status: 'error',
                error: 'Ошибка при проверке PM2',
                details: error.message
            };
        }
    }

    /**
     * Проверяет логи PM2 на наличие ошибок
     */
    async checkPM2Logs() {
        try {
            const result = await this.executeSSHCommand('pm2 logs smile-rental --lines 10 --nostream');
            
            if (!result.success) {
                return {
                    status: 'error',
                    error: 'Не удалось получить логи PM2'
                };
            }

            const logs = result.stdout;
            const errorPatterns = [
                'EADDRINUSE',
                'Error:',
                'Failed to start',
                'Cannot find module',
                'ENOENT',
                'permission denied'
            ];

            const foundErrors = [];
            errorPatterns.forEach(pattern => {
                if (logs.toLowerCase().includes(pattern.toLowerCase())) {
                    foundErrors.push(pattern);
                }
            });

            if (foundErrors.length > 0) {
                return {
                    status: 'error',
                    errors: foundErrors,
                    logs: logs.split('\n').slice(-5) // Последние 5 строк
                };
            }

            return {
                status: 'ok',
                logs: logs.split('\n').slice(-3) // Последние 3 строки для информации
            };
        } catch (error) {
            return {
                status: 'error',
                error: 'Ошибка при проверке логов PM2',
                details: error.message
            };
        }
    }

    /**
     * Выполняет полную проверку системы
     */
    async performFullCheck() {
        console.log(`🔍 Начинаем проверку системы: ${new Date().toISOString()}`);
        
        const results = {
            timestamp: new Date().toISOString(),
            urls: [],
            pm2: null,
            logs: null,
            issues: []
        };

        // Проверяем URL'ы
        console.log('📡 Проверяем доступность сайта...');
        for (const url of this.siteUrls) {
            const urlResult = await this.checkUrl(url);
            results.urls.push(urlResult);
            
            if (urlResult.status === 'error') {
                results.issues.push({
                    type: 'url_error',
                    message: `Сайт недоступен: ${url} - ${urlResult.error}`,
                    url: url,
                    error: urlResult.error
                });
            } else if (urlResult.responseTime > 5000) {
                results.issues.push({
                    type: 'slow_response',
                    message: `Медленный ответ: ${url} - ${urlResult.responseTime}ms`,
                    url: url,
                    responseTime: urlResult.responseTime
                });
            }
        }

        // Проверяем PM2
        console.log('⚙️ Проверяем статус PM2...');
        results.pm2 = await this.checkPM2Status();
        if (results.pm2.status === 'error' || results.pm2.status === 'warning') {
            results.issues.push({
                type: 'pm2_error',
                message: `Проблема с PM2: ${results.pm2.error}`,
                details: results.pm2
            });
        }

        // Проверяем логи
        console.log('📋 Проверяем логи PM2...');
        results.logs = await this.checkPM2Logs();
        if (results.logs.status === 'error' && results.logs.errors) {
            results.issues.push({
                type: 'log_errors',
                message: `Ошибки в логах: ${results.logs.errors.join(', ')}`,
                errors: results.logs.errors,
                logs: results.logs.logs
            });
        }

        // Автоматически добавляем проблемы в troubleshooting guide
        for (const issue of results.issues) {
            await this.updater.addNewProblem(issue.message, JSON.stringify(issue, null, 2));
        }

        // Выводим результаты
        if (results.issues.length === 0) {
            console.log('✅ Все проверки прошли успешно!');
        } else {
            console.log(`❌ Обнаружено проблем: ${results.issues.length}`);
            results.issues.forEach((issue, index) => {
                console.log(`  ${index + 1}. ${issue.message}`);
            });
        }

        return results;
    }

    /**
     * Запускает непрерывный мониторинг
     */
    startMonitoring() {
        if (this.isMonitoring) {
            console.log('Мониторинг уже запущен');
            return;
        }

        this.isMonitoring = true;
        console.log(`🚀 Запускаем мониторинг сервера (интервал: ${this.checkInterval / 1000}с)`);

        // Первая проверка сразу
        this.performFullCheck();

        // Периодические проверки
        this.monitoringInterval = setInterval(() => {
            this.performFullCheck();
        }, this.checkInterval);
    }

    /**
     * Останавливает мониторинг
     */
    stopMonitoring() {
        if (!this.isMonitoring) {
            console.log('Мониторинг не запущен');
            return;
        }

        this.isMonitoring = false;
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        console.log('🛑 Мониторинг остановлен');
    }
}

// Экспорт для использования в других скриптах
module.exports = ServerMonitor;

// Если запускается напрямую
if (require.main === module) {
    const monitor = new ServerMonitor();
    
    const args = process.argv.slice(2);
    
    if (args[0] === 'start') {
        monitor.startMonitoring();
        
        // Обработка сигналов для корректного завершения
        process.on('SIGINT', () => {
            console.log('\n🛑 Получен сигнал завершения...');
            monitor.stopMonitoring();
            process.exit(0);
        });
        
    } else if (args[0] === 'check') {
        monitor.performFullCheck().then(() => {
            process.exit(0);
        });
    } else {
        console.log(`
Использование:
  node server-monitor.js start  - Запустить непрерывный мониторинг
  node server-monitor.js check  - Выполнить одну проверку

Примеры:
  node server-monitor.js check
  node server-monitor.js start
        `);
    }
}
