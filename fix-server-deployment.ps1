# Fix server deployment issues
$SERVER_IP = "38.180.122.239"
$SERVER_USER = "root"
$SERVER_PASSWORD = "925LudK9Bv"

Write-Host "🔧 FIXING SERVER DEPLOYMENT ISSUES..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Step 1: Creating package.json on server..." -ForegroundColor Cyan
$packageJson = @'
{
  "name": "smile-rental-modern",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@types/prettier": "^2.7.3",
    "clsx": "^2.1.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.3",
    "framer-motion": "^12.23.12",
    "lucide-react": "^0.535.0",
    "next": "15.4.5",
    "prettier": "^3.6.2",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "tailwind-merge": "^3.3.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "15.4.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
'@

$cmd1 = "cd /var/www/smilerentalphuket.com/site-smile-rental; echo '$packageJson' > package.json"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd1

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Cyan
$cmd2 = "cd /var/www/smilerentalphuket.com/site-smile-rental; npm install"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd2

Write-Host ""
Write-Host "Step 3: Building project..." -ForegroundColor Cyan
$cmd3 = "cd /var/www/smilerentalphuket.com/site-smile-rental; npm run build"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd3

Write-Host ""
Write-Host "Step 4: Stopping PM2 process..." -ForegroundColor Cyan
$cmd4 = "pm2 stop smile-rental"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd4

Write-Host ""
Write-Host "Step 5: Starting PM2 process..." -ForegroundColor Cyan
$cmd5 = "cd /var/www/smilerentalphuket.com/site-smile-rental; pm2 start npm --name smile-rental -- start"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd5

Write-Host ""
Write-Host "Step 6: Checking status..." -ForegroundColor Cyan
$cmd6 = "pm2 list; curl -I http://localhost:3000"
echo $SERVER_PASSWORD | ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP $cmd6

Write-Host ""
Write-Host "SERVER FIX COMPLETED!" -ForegroundColor Green
