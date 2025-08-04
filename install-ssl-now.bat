@echo off
echo 🔒 Installing SSL Certificate for smilerentalphuket.com
echo ====================================================

echo 📞 Connecting to server...
echo Server: 38.180.122.239
echo Username: root
echo Password: 925LudK9Bv

echo.
echo 🚀 Running SSL installation script...
echo.

ssh root@38.180.122.239 "curl -s https://raw.githubusercontent.com/1rokoko/site-smile-rental/main/quick-ssl-setup.sh | bash"

echo.
echo ✅ SSL installation completed!
echo 🔍 Testing HTTPS...

timeout /t 10 /nobreak > nul

echo 🌐 Opening website...
start https://smilerentalphuket.com

pause
