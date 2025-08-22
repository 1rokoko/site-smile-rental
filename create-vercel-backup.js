// Vercel Deployment Backup Script
// Creates backup of current Vercel deployment content and configuration

const fs = require('fs');
const path = require('path');
const https = require('https');

const VERCEL_URL = 'https://scooter-mauve.vercel.app';
const BACKUP_DIR = './vercel-backup';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

console.log('🔄 CREATING VERCEL DEPLOYMENT BACKUP');
console.log('===================================');
console.log(`📅 Timestamp: ${TIMESTAMP}`);
console.log(`🌐 Vercel URL: ${VERCEL_URL}`);
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log('');

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to download content
function downloadContent(url, filename) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Downloading: ${url}`);
        
        https.get(url, (response) => {
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                const filePath = path.join(BACKUP_DIR, filename);
                fs.writeFileSync(filePath, data);
                console.log(`✅ Saved: ${filename} (${data.length} bytes)`);
                resolve(data);
            });
            
        }).on('error', (error) => {
            console.error(`❌ Error downloading ${url}:`, error.message);
            reject(error);
        });
    });
}

// Function to extract links from HTML
function extractLinks(html) {
    const links = [];
    const linkRegex = /<link[^>]+href=["']([^"']+)["'][^>]*>/gi;
    const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
    
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
        links.push(match[1]);
    }
    
    while ((match = scriptRegex.exec(html)) !== null) {
        links.push(match[1]);
    }
    
    return links.filter(link => link.startsWith('/') || link.startsWith('http'));
}

// Main backup function
async function createVercelBackup() {
    try {
        console.log('📦 Starting Vercel content backup...');
        
        // 1. Download main page
        const mainContent = await downloadContent(VERCEL_URL, 'index.html');
        
        // 2. Extract and download assets
        const links = extractLinks(mainContent);
        console.log(`🔗 Found ${links.length} asset links`);
        
        // 3. Download key assets
        const assetPromises = [];
        const downloadedAssets = [];
        
        for (const link of links.slice(0, 10)) { // Limit to first 10 assets
            if (link.startsWith('/')) {
                const fullUrl = VERCEL_URL + link;
                const filename = link.split('/').pop() || 'asset';
                assetPromises.push(
                    downloadContent(fullUrl, `assets/${filename}`)
                        .then(() => downloadedAssets.push(link))
                        .catch(err => console.log(`⚠️ Skipped ${link}: ${err.message}`))
                );
            }
        }
        
        // Create assets directory
        const assetsDir = path.join(BACKUP_DIR, 'assets');
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }
        
        await Promise.allSettled(assetPromises);
        
        // 4. Create backup manifest
        const manifest = {
            timestamp: TIMESTAMP,
            source_url: VERCEL_URL,
            backup_date: new Date().toISOString(),
            content: {
                main_page: 'index.html',
                assets_downloaded: downloadedAssets.length,
                total_assets_found: links.length
            },
            verification: {
                main_page_size: mainContent.length,
                assets_count: downloadedAssets.length,
                backup_complete: true
            },
            restoration_notes: [
                'This backup contains the static content from Vercel deployment',
                'Main page content is in index.html',
                'Assets are in the assets/ directory',
                'This represents the current state to be deployed to production'
            ]
        };
        
        fs.writeFileSync(
            path.join(BACKUP_DIR, 'VERCEL_BACKUP_MANIFEST.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        // 5. Create summary report
        const summary = `# Vercel Deployment Backup Report

## Backup Information
- **Date:** ${new Date().toISOString()}
- **Source:** ${VERCEL_URL}
- **Backup Directory:** ${BACKUP_DIR}
- **Status:** ✅ Completed Successfully

## Content Backed Up
- **Main Page:** index.html (${mainContent.length} bytes)
- **Assets Downloaded:** ${downloadedAssets.length}
- **Total Assets Found:** ${links.length}

## Files Created
- index.html - Main page content
- assets/ - Downloaded assets
- VERCEL_BACKUP_MANIFEST.json - Backup metadata

## Next Steps
1. Compare with production backup
2. Identify differences
3. Proceed with migration

**Backup completed at:** ${new Date().toISOString()}
`;
        
        fs.writeFileSync(path.join(BACKUP_DIR, 'BACKUP_SUMMARY.md'), summary);
        
        console.log('');
        console.log('========================================');
        console.log('✅ VERCEL BACKUP COMPLETED SUCCESSFULLY');
        console.log('========================================');
        console.log(`📁 Backup Location: ${BACKUP_DIR}`);
        console.log(`📄 Main Content: ${mainContent.length} bytes`);
        console.log(`🎯 Assets Downloaded: ${downloadedAssets.length}/${links.length}`);
        console.log(`📋 Manifest: VERCEL_BACKUP_MANIFEST.json`);
        console.log('');
        console.log('🎉 Ready for deployment comparison!');
        
        return {
            success: true,
            backup_dir: BACKUP_DIR,
            content_size: mainContent.length,
            assets_count: downloadedAssets.length
        };
        
    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Execute backup
if (require.main === module) {
    createVercelBackup()
        .then(result => {
            if (result.success) {
                console.log('✅ Vercel backup process completed successfully');
                process.exit(0);
            } else {
                console.error('❌ Vercel backup failed:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { createVercelBackup };
