@echo off
echo Creating package.json on server...

ssh -o StrictHostKeyChecking=no root@38.180.122.239 "cd /var/www/smilerentalphuket.com/site-smile-rental && cat > package.json << 'EOF'
{
  \"name\": \"smile-rental-modern\",
  \"version\": \"0.1.0\",
  \"private\": true,
  \"scripts\": {
    \"dev\": \"next dev --turbopack\",
    \"build\": \"next build\",
    \"start\": \"next start\",
    \"lint\": \"next lint\"
  },
  \"dependencies\": {
    \"@types/prettier\": \"^2.7.3\",
    \"clsx\": \"^2.1.1\",
    \"eslint-config-prettier\": \"^10.1.8\",
    \"eslint-plugin-prettier\": \"^5.5.3\",
    \"framer-motion\": \"^12.23.12\",
    \"lucide-react\": \"^0.535.0\",
    \"next\": \"15.4.5\",
    \"prettier\": \"^3.6.2\",
    \"react\": \"19.1.0\",
    \"react-dom\": \"19.1.0\",
    \"tailwind-merge\": \"^3.3.1\"
  },
  \"devDependencies\": {
    \"@eslint/eslintrc\": \"^3\",
    \"@tailwindcss/postcss\": \"^4\",
    \"@types/node\": \"^20\",
    \"@types/react\": \"^19\",
    \"@types/react-dom\": \"^19\",
    \"eslint\": \"^9\",
    \"eslint-config-next\": \"15.4.5\",
    \"tailwindcss\": \"^4\",
    \"typescript\": \"^5\"
  }
}
EOF"

echo package.json created!
pause
