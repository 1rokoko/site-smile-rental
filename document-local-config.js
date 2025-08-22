// Local Configuration Documentation Script
// Documents current repository and local configuration for migration reference

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📋 LOCAL CONFIGURATION DOCUMENTATION');
console.log('====================================');
console.log(`📅 Documentation Date: ${new Date().toISOString()}`);
console.log('');

// Configuration
const DOC_DIR = './local-config-documentation';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// Create documentation directory
if (!fs.existsSync(DOC_DIR)) {
    fs.mkdirSync(DOC_DIR, { recursive: true });
}

// Function to execute command safely
function executeCommand(command, description) {
    try {
        console.log(`🔄 ${description}...`);
        const result = execSync(command, { encoding: 'utf8', cwd: process.cwd() });
        console.log(`✅ ${description} completed`);
        return result.trim();
    } catch (error) {
        console.log(`⚠️ ${description} failed: ${error.message}`);
        return `Error: ${error.message}`;
    }
}

// Function to read file safely
function readFileSafely(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(`✅ ${description}: Found (${content.length} bytes)`);
            return content;
        } else {
            console.log(`⚠️ ${description}: Not found`);
            return null;
        }
    } catch (error) {
        console.log(`❌ ${description}: Error reading file - ${error.message}`);
        return null;
    }
}

// Function to document repository information
function documentRepositoryInfo() {
    console.log('📁 Documenting repository information...');
    
    const gitStatus = executeCommand('git status --porcelain', 'Getting git status');
    const gitBranch = executeCommand('git branch --show-current', 'Getting current branch');
    const gitRemote = executeCommand('git remote -v', 'Getting git remotes');
    const gitLog = executeCommand('git log --oneline -10', 'Getting recent commits');
    
    const repoDoc = `# Repository Configuration Documentation

**Documentation Date:** ${new Date().toISOString()}
**Current Directory:** ${process.cwd()}

## Git Repository Information
- **Current Branch:** ${gitBranch}
- **Repository Status:** ${gitStatus ? 'Has uncommitted changes' : 'Clean working directory'}

### Git Remotes
\`\`\`
${gitRemote}
\`\`\`

### Recent Commits (Last 10)
\`\`\`
${gitLog}
\`\`\`

### Working Directory Status
\`\`\`
${gitStatus || 'No changes'}
\`\`\`

## Directory Structure
\`\`\`
${executeCommand('dir /b', 'Listing directory contents')}
\`\`\`

## Repository Statistics
- **Total Files:** ${executeCommand('git ls-files | wc -l', 'Counting files')}
- **Repository Size:** ${executeCommand('du -sh .git', 'Getting repository size')}
`;
    
    fs.writeFileSync(path.join(DOC_DIR, 'repository-information.md'), repoDoc);
    console.log('✅ Repository information documented');
}

// Function to document package configurations
function documentPackageConfigurations() {
    console.log('📦 Documenting package configurations...');
    
    let packageDoc = `# Package Configuration Documentation

**Documentation Date:** ${new Date().toISOString()}

## Package Configurations
`;
    
    // Main package.json
    const mainPackage = readFileSafely('./package.json', 'Main package.json');
    if (mainPackage) {
        packageDoc += `
### Main Package.json
\`\`\`json
${mainPackage}
\`\`\`
`;
    }
    
    // Modern package.json
    const modernPackage = readFileSafely('./smile-rental-modern/package.json', 'Modern package.json');
    if (modernPackage) {
        packageDoc += `
### Modern Package.json (./smile-rental-modern/)
\`\`\`json
${modernPackage}
\`\`\`
`;
    }
    
    // Package-lock files
    if (fs.existsSync('./package-lock.json')) {
        const lockStats = fs.statSync('./package-lock.json');
        packageDoc += `
### Package Lock Information
- **Main package-lock.json:** ${lockStats.size} bytes, modified ${lockStats.mtime.toISOString()}
`;
    }
    
    if (fs.existsSync('./smile-rental-modern/package-lock.json')) {
        const modernLockStats = fs.statSync('./smile-rental-modern/package-lock.json');
        packageDoc += `- **Modern package-lock.json:** ${modernLockStats.size} bytes, modified ${modernLockStats.mtime.toISOString()}
`;
    }
    
    fs.writeFileSync(path.join(DOC_DIR, 'package-configurations.md'), packageDoc);
    console.log('✅ Package configurations documented');
}

// Function to document deployment configurations
function documentDeploymentConfigurations() {
    console.log('🚀 Documenting deployment configurations...');
    
    let deployDoc = `# Deployment Configuration Documentation

**Documentation Date:** ${new Date().toISOString()}

## Deployment Configurations
`;
    
    // GitHub Actions workflow
    const workflow = readFileSafely('./.github/workflows/deploy.yml', 'GitHub Actions workflow');
    if (workflow) {
        deployDoc += `
### GitHub Actions Workflow (./.github/workflows/deploy.yml)
\`\`\`yaml
${workflow}
\`\`\`
`;
    }
    
    // Ecosystem configurations
    const mainEcosystem = readFileSafely('./ecosystem.config.js', 'Main ecosystem config');
    if (mainEcosystem) {
        deployDoc += `
### Main Ecosystem Configuration (./ecosystem.config.js)
\`\`\`javascript
${mainEcosystem}
\`\`\`
`;
    }
    
    const modernEcosystem = readFileSafely('./smile-rental-modern/ecosystem.config.js', 'Modern ecosystem config');
    if (modernEcosystem) {
        deployDoc += `
### Modern Ecosystem Configuration (./smile-rental-modern/ecosystem.config.js)
\`\`\`javascript
${modernEcosystem}
\`\`\`
`;
    }
    
    // Next.js configurations
    const nextConfig = readFileSafely('./next.config.ts', 'Next.js config');
    if (nextConfig) {
        deployDoc += `
### Next.js Configuration (./next.config.ts)
\`\`\`typescript
${nextConfig}
\`\`\`
`;
    }
    
    const modernNextConfig = readFileSafely('./smile-rental-modern/next.config.js', 'Modern Next.js config');
    if (modernNextConfig) {
        deployDoc += `
### Modern Next.js Configuration (./smile-rental-modern/next.config.js)
\`\`\`javascript
${modernNextConfig}
\`\`\`
`;
    }
    
    fs.writeFileSync(path.join(DOC_DIR, 'deployment-configurations.md'), deployDoc);
    console.log('✅ Deployment configurations documented');
}

// Function to document migration artifacts
function documentMigrationArtifacts() {
    console.log('🔄 Documenting migration artifacts...');
    
    let migrationDoc = `# Migration Artifacts Documentation

**Documentation Date:** ${new Date().toISOString()}

## Migration-Related Files
`;
    
    // List all migration-related files
    const migrationFiles = [
        'create-migration-backup.sh',
        'emergency-rollback.sh',
        'EMERGENCY_ROLLBACK_PROCEDURES.md',
        'BACKUP_LOCATIONS_DOCUMENTATION.md',
        'FINAL_BACKUP_VERIFICATION.json',
        'DEPLOYMENT_COMPARISON_ANALYSIS.json',
        'INFRASTRUCTURE_VERIFICATION.json',
        'ROLLBACK_READINESS_VERIFICATION.json'
    ];
    
    migrationFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            migrationDoc += `
### ${file}
- **Size:** ${stats.size} bytes
- **Modified:** ${stats.mtime.toISOString()}
- **Type:** ${path.extname(file) || 'No extension'}
`;
        }
    });
    
    // Document backup directory
    if (fs.existsSync('./vercel-deployment-backup')) {
        migrationDoc += `
### Vercel Deployment Backup Directory
- **Location:** ./vercel-deployment-backup/
- **Contents:**
`;
        try {
            const backupContents = fs.readdirSync('./vercel-deployment-backup', { withFileTypes: true });
            backupContents.forEach(item => {
                migrationDoc += `  - ${item.isDirectory() ? '📁' : '📄'} ${item.name}\n`;
            });
        } catch (error) {
            migrationDoc += `  - Error reading directory: ${error.message}\n`;
        }
    }
    
    fs.writeFileSync(path.join(DOC_DIR, 'migration-artifacts.md'), migrationDoc);
    console.log('✅ Migration artifacts documented');
}

// Function to document current environment
function documentCurrentEnvironment() {
    console.log('🌍 Documenting current environment...');
    
    const envDoc = `# Current Environment Documentation

**Documentation Date:** ${new Date().toISOString()}

## System Environment
- **Operating System:** ${process.platform}
- **Node.js Version:** ${process.version}
- **Current Working Directory:** ${process.cwd()}
- **Environment:** ${process.env.NODE_ENV || 'Not set'}

## NPM Information
- **NPM Version:** ${executeCommand('npm --version', 'Getting NPM version')}
- **NPM Registry:** ${executeCommand('npm config get registry', 'Getting NPM registry')}

## Git Configuration
- **Git Version:** ${executeCommand('git --version', 'Getting Git version')}
- **Git User Name:** ${executeCommand('git config user.name', 'Getting Git user name')}
- **Git User Email:** ${executeCommand('git config user.email', 'Getting Git user email')}

## Available Scripts
${fs.existsSync('./package.json') ? `
### Main Package Scripts
\`\`\`json
${JSON.stringify(JSON.parse(fs.readFileSync('./package.json', 'utf8')).scripts || {}, null, 2)}
\`\`\`
` : ''}

${fs.existsSync('./smile-rental-modern/package.json') ? `
### Modern Package Scripts
\`\`\`json
${JSON.stringify(JSON.parse(fs.readFileSync('./smile-rental-modern/package.json', 'utf8')).scripts || {}, null, 2)}
\`\`\`
` : ''}

## Environment Files
${fs.existsSync('./.env') ? '- .env file exists (content not shown for security)' : '- No .env file found'}
${fs.existsSync('./.env.local') ? '- .env.local file exists (content not shown for security)' : '- No .env.local file found'}
${fs.existsSync('./.env.production') ? '- .env.production file exists (content not shown for security)' : '- No .env.production file found'}
`;
    
    fs.writeFileSync(path.join(DOC_DIR, 'current-environment.md'), envDoc);
    console.log('✅ Current environment documented');
}

// Function to create configuration summary
function createConfigurationSummary() {
    console.log('📄 Creating configuration summary...');
    
    const summary = `# Local Configuration Summary

**Documentation Date:** ${new Date().toISOString()}
**Documentation Directory:** ${DOC_DIR}

## Overview
This documentation captures the complete local repository configuration before migration to ensure accurate reference and troubleshooting capabilities.

## Documentation Files Created
1. **repository-information.md** - Git repository status, branches, and recent commits
2. **package-configurations.md** - Package.json files and dependency configurations
3. **deployment-configurations.md** - GitHub Actions, ecosystem configs, and Next.js settings
4. **migration-artifacts.md** - All migration-related files and backup directories
5. **current-environment.md** - System environment, Node.js, NPM, and Git configuration

## Key Configuration Points
- **Repository:** https://github.com/1rokoko/site-smile-rental
- **Current Branch:** ${executeCommand('git branch --show-current', 'Getting current branch')}
- **Node.js Version:** ${process.version}
- **Package Manager:** NPM
- **Framework:** Next.js
- **Process Manager:** PM2 (via ecosystem.config.js)

## Migration Context
This documentation serves as the local configuration baseline for:
1. Comparing pre and post-migration configurations
2. Troubleshooting deployment issues
3. Verifying migration completeness
4. Future development and maintenance

## Security Note
Environment variables and sensitive configuration details are noted but not included in this documentation for security purposes.

**Documentation Generated:** ${new Date().toISOString()}
**Total Files Documented:** ${fs.readdirSync(DOC_DIR).length}
`;
    
    fs.writeFileSync(path.join(DOC_DIR, 'CONFIGURATION_SUMMARY.md'), summary);
    console.log('✅ Configuration summary created');
}

// Main documentation function
function documentLocalConfiguration() {
    console.log('📋 Starting local configuration documentation...');
    console.log('');
    
    // Document all components
    documentRepositoryInfo();
    documentPackageConfigurations();
    documentDeploymentConfigurations();
    documentMigrationArtifacts();
    documentCurrentEnvironment();
    
    // Create summary
    createConfigurationSummary();
    
    console.log('');
    console.log('==========================================');
    console.log('📊 LOCAL CONFIGURATION DOCUMENTATION RESULTS');
    console.log('==========================================');
    console.log(`📁 Documentation Directory: ${DOC_DIR}`);
    console.log(`📄 Summary File: ${DOC_DIR}/CONFIGURATION_SUMMARY.md`);
    
    // List created files
    console.log('');
    console.log('📋 Files Created:');
    const files = fs.readdirSync(DOC_DIR);
    files.forEach(file => {
        const stats = fs.statSync(path.join(DOC_DIR, file));
        console.log(`   📄 ${file} (${stats.size} bytes)`);
    });
    
    console.log('');
    console.log('✅ Local configuration documentation completed!');
    
    return {
        success: true,
        documentation_directory: DOC_DIR,
        files_created: files.length,
        summary_file: path.join(DOC_DIR, 'CONFIGURATION_SUMMARY.md')
    };
}

// Execute documentation
if (require.main === module) {
    documentLocalConfiguration()
        .then ? documentLocalConfiguration() : documentLocalConfiguration();
}

module.exports = { documentLocalConfiguration };
