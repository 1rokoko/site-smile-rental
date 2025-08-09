@echo off
echo 🚨 DIRECT SERVER FIX - Connecting to server...

echo Creating emergency fix script...
echo #!/bin/bash > emergency-fix.sh
echo echo "🚨 EMERGENCY SERVER FIX - Smile Rental Phuket" >> emergency-fix.sh
echo echo "=============================================" >> emergency-fix.sh
echo echo "📅 Fix time: $(date)" >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Create maintenance page >> emergency-fix.sh
echo mkdir -p /var/www/html >> emergency-fix.sh
echo cat ^> /var/www/html/maintenance.html ^<^< 'EOF' >> emergency-fix.sh
echo ^<!DOCTYPE html^> >> emergency-fix.sh
echo ^<html^> >> emergency-fix.sh
echo ^<head^> >> emergency-fix.sh
echo     ^<title^>Maintenance - Smile Rental Phuket^</title^> >> emergency-fix.sh
echo     ^<meta charset="utf-8"^> >> emergency-fix.sh
echo     ^<style^> >> emergency-fix.sh
echo         body { font-family: Arial; text-align: center; padding: 50px; background: #f5f5f5; } >> emergency-fix.sh
echo         .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); } >> emergency-fix.sh
echo         h1 { color: #333; margin-bottom: 20px; } >> emergency-fix.sh
echo         p { color: #666; line-height: 1.6; } >> emergency-fix.sh
echo         .emoji { font-size: 48px; margin-bottom: 20px; } >> emergency-fix.sh
echo     ^</style^> >> emergency-fix.sh
echo ^</head^> >> emergency-fix.sh
echo ^<body^> >> emergency-fix.sh
echo     ^<div class="container"^> >> emergency-fix.sh
echo         ^<div class="emoji"^>🔧^</div^> >> emergency-fix.sh
echo         ^<h1^>Site Under Maintenance^</h1^> >> emergency-fix.sh
echo         ^<p^>We're updating our website to serve you better. Please check back in a few minutes.^</p^> >> emergency-fix.sh
echo         ^<p^>^<strong^>Мы обновляем наш сайт, чтобы лучше вам служить. Пожалуйста, зайдите через несколько минут.^</strong^>^</p^> >> emergency-fix.sh
echo         ^<p^>^<em^>Expected completion: 5-10 minutes^</em^>^</p^> >> emergency-fix.sh
echo     ^</div^> >> emergency-fix.sh
echo ^</body^> >> emergency-fix.sh
echo ^</html^> >> emergency-fix.sh
echo EOF >> emergency-fix.sh
echo. >> emergency-fix.sh
echo echo "✅ Maintenance page created" >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Navigate to project directory >> emergency-fix.sh
echo cd /var/www/smilerentalphuket.com/site-smile-rental ^|^| exit 1 >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Stop all PM2 processes >> emergency-fix.sh
echo echo "🛑 Stopping all applications..." >> emergency-fix.sh
echo pm2 stop all ^|^| echo "No PM2 processes running" >> emergency-fix.sh
echo pm2 delete all ^|^| echo "No PM2 processes to delete" >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Free memory >> emergency-fix.sh
echo echo "💾 Freeing memory..." >> emergency-fix.sh
echo sync >> emergency-fix.sh
echo echo 3 ^> /proc/sys/vm/drop_caches 2^>/dev/null ^|^| echo "Cannot clear cache" >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Clean everything >> emergency-fix.sh
echo echo "🧹 Deep cleaning..." >> emergency-fix.sh
echo rm -rf .next >> emergency-fix.sh
echo rm -rf node_modules >> emergency-fix.sh
echo rm -rf /var/www/smilerentalphuket.com/package-lock.json >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Pull latest >> emergency-fix.sh
echo echo "📥 Getting latest code..." >> emergency-fix.sh
echo git fetch origin main >> emergency-fix.sh
echo git reset --hard origin/main >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Install with minimal memory >> emergency-fix.sh
echo echo "📦 Installing dependencies..." >> emergency-fix.sh
echo NODE_OPTIONS="--max-old-space-size=512" npm install --production >> emergency-fix.sh
echo. >> emergency-fix.sh
echo # Try simple build >> emergency-fix.sh
echo echo "🔨 Attempting build..." >> emergency-fix.sh
echo NODE_OPTIONS="--max-old-space-size=512" npm run build >> emergency-fix.sh
echo. >> emergency-fix.sh
echo if [ $? -eq 0 ]; then >> emergency-fix.sh
echo     echo "✅ Build successful!" >> emergency-fix.sh
echo     echo "🚀 Starting application..." >> emergency-fix.sh
echo     NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name "smile-rental" -- start >> emergency-fix.sh
echo     pm2 save >> emergency-fix.sh
echo     sleep 10 >> emergency-fix.sh
echo     if curl -f http://localhost:3000 ^> /dev/null 2^>^&1; then >> emergency-fix.sh
echo         echo "✅ Application is running!" >> emergency-fix.sh
echo         rm -f /var/www/html/maintenance.html >> emergency-fix.sh
echo         echo "🎉 Emergency fix completed successfully!" >> emergency-fix.sh
echo         echo "🌐 Website: http://smilerentalphuket.com" >> emergency-fix.sh
echo     else >> emergency-fix.sh
echo         echo "❌ Application failed to start" >> emergency-fix.sh
echo         exit 1 >> emergency-fix.sh
echo     fi >> emergency-fix.sh
echo else >> emergency-fix.sh
echo     echo "❌ Build failed - trying development mode..." >> emergency-fix.sh
echo     NODE_OPTIONS="--max-old-space-size=512" pm2 start npm --name "smile-rental-dev" -- run dev >> emergency-fix.sh
echo     pm2 save >> emergency-fix.sh
echo     sleep 10 >> emergency-fix.sh
echo     if curl -f http://localhost:3000 ^> /dev/null 2^>^&1; then >> emergency-fix.sh
echo         echo "⚠️ Running in development mode" >> emergency-fix.sh
echo         rm -f /var/www/html/maintenance.html >> emergency-fix.sh
echo         echo "🌐 Website: http://smilerentalphuket.com (dev mode)" >> emergency-fix.sh
echo     else >> emergency-fix.sh
echo         echo "❌ Complete failure - keeping maintenance page" >> emergency-fix.sh
echo         exit 1 >> emergency-fix.sh
echo     fi >> emergency-fix.sh
echo fi >> emergency-fix.sh
echo. >> emergency-fix.sh
echo echo "🏁 Emergency fix completed!" >> emergency-fix.sh

echo Script created! Now uploading to server...

scp emergency-fix.sh root@smilerentalphuket.com:/root/emergency-fix.sh
ssh root@smilerentalphuket.com "chmod +x /root/emergency-fix.sh && /root/emergency-fix.sh"
