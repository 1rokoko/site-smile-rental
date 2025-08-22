# Current Environment Documentation

**Documentation Date:** 2025-08-22T19:39:07.568Z

## System Environment
- **Operating System:** win32
- **Node.js Version:** v22.16.0
- **Current Working Directory:** C:\Users\Аркадий\Documents\augment-projects\site-smile-rental
- **Environment:** Not set

## NPM Information
- **NPM Version:** 10.9.2
- **NPM Registry:** https://registry.npmjs.org/

## Git Configuration
- **Git Version:** git version 2.49.0.windows.1
- **Git User Name:** Arkadiy
- **Git User Email:** arkadii1invest@gmail.com

## Available Scripts

### Main Package Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "analyze": "set ANALYZE=true && npm run build",
  "start": "next start -p 3000",
  "lint": "next lint",
  "troubleshoot:add": "node scripts/auto-troubleshoot-updater.js add",
  "troubleshoot:solve": "node scripts/auto-troubleshoot-updater.js solve",
  "troubleshoot:check": "node scripts/auto-troubleshoot-updater.js check",
  "deploy:check": "npm run troubleshoot:check && npm run build",
  "postdeploy": "npm run troubleshoot:check"
}
```



### Modern Package Scripts
```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "analyze": "ANALYZE=true npm run build",
  "build:optimized": "./build-optimized.sh",
  "deploy:optimized": "./deploy-optimized.sh",
  "test:performance": "./test-performance.sh",
  "validate:performance": "./validate-performance.sh"
}
```


## Environment Files
- No .env file found
- .env.local file exists (content not shown for security)
- No .env.production file found
