// Enhanced Vercel Deployment Backup Script
// Creates comprehensive backup of Vercel deployment with full content analysis

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const VERCEL_URL = 'https://scooter-mauve.vercel.app';
const PRODUCTION_URL = 'https://smilerentalphuket.com';
const BACKUP_DIR = './vercel-deployment-backup';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

console.log('🔄 ENHANCED VERCEL DEPLOYMENT BACKUP');
console.log('=====================================');
console.log(`📅 Timestamp: ${TIMESTAMP}`);
console.log(`🌐 Vercel URL: ${VERCEL_URL}`);
console.log(`🏠 Production URL: ${PRODUCTION_URL}`);
console.log(`📁 Backup Directory: ${BACKUP_DIR}`);
console.log('');

// Create backup directory structure
function createBackupStructure() {
    const dirs = [
        BACKUP_DIR,
        `${BACKUP_DIR}/content`,
        `${BACKUP_DIR}/analysis`,
        `${BACKUP_DIR}/comparison`
    ];
    
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

// Enhanced content download with user agent
function downloadContent(url, filename, followRedirects = true) {
    return new Promise((resolve, reject) => {
        console.log(`📥 Downloading: ${url}`);
        
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        
        https.get(url, options, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                if (followRedirects) {
                    console.log(`🔄 Following redirect to: ${response.headers.location}`);
                    return downloadContent(response.headers.location, filename, false)
                        .then(resolve)
                        .catch(reject);
                }
            }
            
            let data = '';
            
            response.on('data', (chunk) => {
                data += chunk;
            });
            
            response.on('end', () => {
                const filePath = path.join(BACKUP_DIR, 'content', filename);
                fs.writeFileSync(filePath, data);
                console.log(`✅ Saved: ${filename} (${data.length} bytes, status: ${response.statusCode})`);
                resolve({
                    content: data,
                    statusCode: response.statusCode,
                    headers: response.headers
                });
            });
            
        }).on('error', (error) => {
            console.error(`❌ Error downloading ${url}:`, error.message);
            reject(error);
        });
    });
}

// Analyze content structure
function analyzeContent(content, url) {
    const analysis = {
        url: url,
        size: content.length,
        title: '',
        meta_description: '',
        scripts: [],
        stylesheets: [],
        images: [],
        links: [],
        text_content: ''
    };
    
    // Extract title
    const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) analysis.title = titleMatch[1].trim();
    
    // Extract meta description
    const metaMatch = content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i);
    if (metaMatch) analysis.meta_description = metaMatch[1];
    
    // Extract scripts
    const scriptMatches = content.match(/<script[^>]*src=["']([^"']+)["'][^>]*>/gi);
    if (scriptMatches) {
        analysis.scripts = scriptMatches.map(match => {
            const srcMatch = match.match(/src=["']([^"']+)["']/);
            return srcMatch ? srcMatch[1] : '';
        }).filter(Boolean);
    }
    
    // Extract stylesheets
    const linkMatches = content.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi);
    if (linkMatches) {
        analysis.stylesheets = linkMatches.map(match => {
            const hrefMatch = match.match(/href=["']([^"']+)["']/);
            return hrefMatch ? hrefMatch[1] : '';
        }).filter(Boolean);
    }
    
    // Extract images
    const imgMatches = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
    if (imgMatches) {
        analysis.images = imgMatches.map(match => {
            const srcMatch = match.match(/src=["']([^"']+)["']/);
            return srcMatch ? srcMatch[1] : '';
        }).filter(Boolean);
    }
    
    // Extract text content (simplified)
    const textContent = content
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    analysis.text_content = textContent.substring(0, 1000); // First 1000 chars
    
    return analysis;
}

// Main backup function
async function createEnhancedVercelBackup() {
    try {
        console.log('📦 Starting enhanced Vercel backup...');
        
        createBackupStructure();
        
        // 1. Download Vercel content
        console.log('🌐 Downloading Vercel deployment...');
        const vercelResult = await downloadContent(VERCEL_URL, 'vercel-content.html');
        
        // 2. Download production content for comparison
        console.log('🏠 Downloading production content...');
        const productionResult = await downloadContent(PRODUCTION_URL, 'production-content.html');
        
        // 3. Analyze both contents
        console.log('🔍 Analyzing content...');
        const vercelAnalysis = analyzeContent(vercelResult.content, VERCEL_URL);
        const productionAnalysis = analyzeContent(productionResult.content, PRODUCTION_URL);
        
        // 4. Create comparison report
        const comparison = {
            timestamp: TIMESTAMP,
            vercel: vercelAnalysis,
            production: productionAnalysis,
            differences: {
                size_difference: Math.abs(vercelAnalysis.size - productionAnalysis.size),
                title_match: vercelAnalysis.title === productionAnalysis.title,
                meta_description_match: vercelAnalysis.meta_description === productionAnalysis.meta_description,
                scripts_count_vercel: vercelAnalysis.scripts.length,
                scripts_count_production: productionAnalysis.scripts.length,
                stylesheets_count_vercel: vercelAnalysis.stylesheets.length,
                stylesheets_count_production: productionAnalysis.stylesheets.length,
                images_count_vercel: vercelAnalysis.images.length,
                images_count_production: productionAnalysis.images.length
            },
            recommendation: ''
        };
        
        // Determine recommendation
        if (comparison.differences.size_difference < 1000 && 
            comparison.differences.title_match && 
            comparison.differences.meta_description_match) {
            comparison.recommendation = 'SAFE_TO_MIGRATE - Content appears identical';
        } else {
            comparison.recommendation = 'REVIEW_REQUIRED - Significant differences detected';
        }
        
        // 5. Save analysis files
        fs.writeFileSync(
            path.join(BACKUP_DIR, 'analysis', 'vercel-analysis.json'),
            JSON.stringify(vercelAnalysis, null, 2)
        );
        
        fs.writeFileSync(
            path.join(BACKUP_DIR, 'analysis', 'production-analysis.json'),
            JSON.stringify(productionAnalysis, null, 2)
        );
        
        fs.writeFileSync(
            path.join(BACKUP_DIR, 'comparison', 'deployment-comparison.json'),
            JSON.stringify(comparison, null, 2)
        );
        
        // 6. Create comprehensive manifest
        const manifest = {
            backup_info: {
                timestamp: TIMESTAMP,
                backup_date: new Date().toISOString(),
                backup_type: 'Enhanced Vercel Deployment Backup',
                purpose: 'Pre-migration backup and analysis'
            },
            sources: {
                vercel_url: VERCEL_URL,
                production_url: PRODUCTION_URL,
                vercel_status: vercelResult.statusCode,
                production_status: productionResult.statusCode
            },
            content_analysis: {
                vercel_size: vercelAnalysis.size,
                production_size: productionAnalysis.size,
                content_similarity: comparison.recommendation,
                differences_detected: comparison.differences
            },
            files_created: [
                'content/vercel-content.html',
                'content/production-content.html',
                'analysis/vercel-analysis.json',
                'analysis/production-analysis.json',
                'comparison/deployment-comparison.json'
            ],
            migration_readiness: {
                status: comparison.recommendation.includes('SAFE') ? 'READY' : 'NEEDS_REVIEW',
                recommendation: comparison.recommendation,
                next_steps: comparison.recommendation.includes('SAFE') ? 
                    ['Proceed with migration', 'Execute backup scripts', 'Deploy to production'] :
                    ['Review differences', 'Investigate discrepancies', 'Confirm migration approach']
            }
        };
        
        fs.writeFileSync(
            path.join(BACKUP_DIR, 'VERCEL_BACKUP_MANIFEST.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        // 7. Create summary report
        const summary = `# Enhanced Vercel Deployment Backup Report

## Backup Summary
- **Date:** ${new Date().toISOString()}
- **Vercel URL:** ${VERCEL_URL}
- **Production URL:** ${PRODUCTION_URL}
- **Status:** ✅ Completed Successfully

## Content Analysis
### Vercel Deployment
- **Size:** ${vercelAnalysis.size} bytes
- **Title:** ${vercelAnalysis.title}
- **Scripts:** ${vercelAnalysis.scripts.length}
- **Stylesheets:** ${vercelAnalysis.stylesheets.length}
- **Images:** ${vercelAnalysis.images.length}

### Production Deployment  
- **Size:** ${productionAnalysis.size} bytes
- **Title:** ${productionAnalysis.title}
- **Scripts:** ${productionAnalysis.scripts.length}
- **Stylesheets:** ${productionAnalysis.stylesheets.length}
- **Images:** ${productionAnalysis.images.length}

## Migration Assessment
**Recommendation:** ${comparison.recommendation}
**Size Difference:** ${comparison.differences.size_difference} bytes
**Title Match:** ${comparison.differences.title_match ? '✅' : '❌'}
**Meta Description Match:** ${comparison.differences.meta_description_match ? '✅' : '❌'}

## Files Created
${manifest.files_created.map(file => `- ${file}`).join('\n')}

## Next Steps
${manifest.migration_readiness.next_steps.map(step => `1. ${step}`).join('\n')}

**Migration Status:** ${manifest.migration_readiness.status}
`;
        
        fs.writeFileSync(path.join(BACKUP_DIR, 'BACKUP_SUMMARY.md'), summary);
        
        console.log('');
        console.log('==========================================');
        console.log('✅ ENHANCED VERCEL BACKUP COMPLETED');
        console.log('==========================================');
        console.log(`📁 Backup Location: ${BACKUP_DIR}`);
        console.log(`🌐 Vercel Content: ${vercelAnalysis.size} bytes`);
        console.log(`🏠 Production Content: ${productionAnalysis.size} bytes`);
        console.log(`📊 Migration Status: ${manifest.migration_readiness.status}`);
        console.log(`💡 Recommendation: ${comparison.recommendation}`);
        console.log('');
        
        return {
            success: true,
            backup_dir: BACKUP_DIR,
            migration_status: manifest.migration_readiness.status,
            recommendation: comparison.recommendation,
            vercel_size: vercelAnalysis.size,
            production_size: productionAnalysis.size
        };
        
    } catch (error) {
        console.error('❌ Enhanced backup failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Execute backup
if (require.main === module) {
    createEnhancedVercelBackup()
        .then(result => {
            if (result.success) {
                console.log('✅ Enhanced Vercel backup completed successfully');
                console.log(`🎯 Migration readiness: ${result.migration_status}`);
                process.exit(0);
            } else {
                console.error('❌ Enhanced backup failed:', result.error);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Unexpected error:', error);
            process.exit(1);
        });
}

module.exports = { createEnhancedVercelBackup };
