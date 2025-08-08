@echo off
chcp 65001 >nul
echo.
echo 🔍 SMILE RENTAL - МОНИТОРИНГ СЕРВЕРА
echo =====================================
echo.

:menu
echo Выберите действие:
echo.
echo 1. Быстрая проверка состояния
echo 2. Запустить непрерывный мониторинг
echo 3. Добавить проблему в troubleshooting
echo 4. Отметить проблему как решенную
echo 5. Открыть troubleshooting guide
echo 6. Выход
echo.
set /p choice="Введите номер (1-6): "

if "%choice%"=="1" goto quick_check
if "%choice%"=="2" goto start_monitoring
if "%choice%"=="3" goto add_problem
if "%choice%"=="4" goto solve_problem
if "%choice%"=="5" goto open_guide
if "%choice%"=="6" goto exit
goto menu

:quick_check
echo.
echo 🔍 Выполняем быструю проверку...
node scripts/server-monitor.js check
echo.
pause
goto menu

:start_monitoring
echo.
echo 🚀 Запускаем непрерывный мониторинг...
echo Нажмите Ctrl+C для остановки
echo.
node scripts/server-monitor.js start
goto menu

:add_problem
echo.
set /p problem="Введите описание проблемы: "
set /p context="Введите контекст (необязательно): "
if "%context%"=="" (
    node scripts/auto-troubleshoot-updater.js add "%problem%"
) else (
    node scripts/auto-troubleshoot-updater.js add "%problem%" "%context%"
)
echo.
pause
goto menu

:solve_problem
echo.
set /p solution="Введите название решенной проблемы: "
node scripts/auto-troubleshoot-updater.js solve "%solution%"
echo.
pause
goto menu

:open_guide
echo.
echo 📖 Открываем troubleshooting guide...
start TROUBLESHOOTING_GUIDE.md
goto menu

:exit
echo.
echo 👋 До свидания!
exit /b 0
