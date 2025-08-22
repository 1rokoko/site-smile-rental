// Backup Integrity Verification Script
// Verifies all backup components and documents their locations

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🔍 BACKUP INTEGRITY VERIFICATION');
console.log('=================================');
console.log(`📅 Verification Date: ${new Date().toISOString()}`);
console.log('');

// Function to calculate file hash
function calculateFileHash(filePath) {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        return hashSum.digest('hex');
    } catch (error) {
        return `ERROR: ${error.message}`;
    }
}

// Function to get file stats
function getFileStats(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return {
            exists: true,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            readable: fs.constants.R_OK
        };
    } catch (error) {
        return {
            exists: false,
            error: error.message
        };
    }
}

// Function to verify directory structure
function verifyDirectory(dirPath, expectedFiles = []) {
    const verification = {
        path: dirPath,
        exists: fs.existsSync(dirPath),
        files: [],
        missing_files: [],
        total_size: 0
    };
    
    if (verification.exists) {
        try {
            const files = fs.readdirSync(dirPath, { withFileTypes: true });
            
            files.forEach(file => {
                const fullPath = path.join(dirPath, file.name);
                const stats = getFileStats(fullPath);
                
                verification.files.push({
                    name: file.name,
                    type: file.isDirectory() ? 'directory' : 'file',
                    size: stats.size || 0,
                    hash: file.isFile() ? calculateFileHash(fullPath) : null
                });
                
                if (stats.size) {
                    verification.total_size += stats.size;
                }
            });
            
            // Check for expected files
            expectedFiles.forEach(expectedFile => {
                const found = verification.files.find(f => f.name === expectedFile);
                if (!found) {
                    verification.missing_files.push(expectedFile);
                }
            });
            
        } catch (error) {
            verification.error = error.message;
        }
    }
    
    return verification;
}

// Main verification function
function verifyBackupIntegrity() {
    const verification = {
        timestamp: new Date().toISOString(),
        overall_status: 'UNKNOWN',
        backups: {},
        summary: {
            total_backups: 0,
            successful_backups: 0,
            failed_backups: 0,
            total_backup_size: 0
        }
    };
    
    console.log('📦 Verifying backup components...');
    console.log('');
    
    // 1. Verify Production Backup Script
    console.log('1️⃣ Verifying Production Backup Script...');
    const productionScript = getFileStats('./create-migration-backup.sh');
    verification.backups.production_script = {
        name: 'Production Backup Script',
        file: './create-migration-backup.sh',
        status: productionScript.exists ? 'READY' : 'MISSING',
        details: productionScript,
        hash: productionScript.exists ? calculateFileHash('./create-migration-backup.sh') : null
    };
    
    if (productionScript.exists) {
        console.log(`✅ Production backup script found (${productionScript.size} bytes)`);
    } else {
        console.log(`❌ Production backup script missing`);
    }
    
    // 2. Verify Vercel Backup Directory
    console.log('2️⃣ Verifying Vercel Backup Directory...');
    const vercelBackup = verifyDirectory('./vercel-deployment-backup', [
        'BACKUP_SUMMARY.md',
        'VERCEL_BACKUP_MANIFEST.json',
        'content',
        'analysis',
        'comparison'
    ]);
    
    verification.backups.vercel_backup = {
        name: 'Vercel Deployment Backup',
        directory: './vercel-deployment-backup',
        status: vercelBackup.exists ? 'COMPLETE' : 'MISSING',
        details: vercelBackup
    };
    
    if (vercelBackup.exists) {
        console.log(`✅ Vercel backup directory found (${vercelBackup.files.length} items, ${vercelBackup.total_size} bytes)`);
        if (vercelBackup.missing_files.length > 0) {
            console.log(`⚠️ Missing expected files: ${vercelBackup.missing_files.join(', ')}`);
        }
    } else {
        console.log(`❌ Vercel backup directory missing`);
    }
    
    // 3. Verify Content Files
    console.log('3️⃣ Verifying Content Files...');
    const contentFiles = [
        './vercel-deployment-backup/content/vercel-content.html',
        './vercel-deployment-backup/content/production-content.html'
    ];
    
    verification.backups.content_files = {
        name: 'Content Backup Files',
        files: []
    };
    
    contentFiles.forEach(filePath => {
        const stats = getFileStats(filePath);
        const fileInfo = {
            path: filePath,
            status: stats.exists ? 'VERIFIED' : 'MISSING',
            details: stats,
            hash: stats.exists ? calculateFileHash(filePath) : null
        };
        
        verification.backups.content_files.files.push(fileInfo);
        
        if (stats.exists) {
            console.log(`✅ ${path.basename(filePath)} verified (${stats.size} bytes)`);
        } else {
            console.log(`❌ ${path.basename(filePath)} missing`);
        }
    });
    
    // 4. Verify Analysis Files
    console.log('4️⃣ Verifying Analysis Files...');
    const analysisFiles = [
        './vercel-deployment-backup/analysis/vercel-analysis.json',
        './vercel-deployment-backup/analysis/production-analysis.json',
        './vercel-deployment-backup/comparison/deployment-comparison.json'
    ];
    
    verification.backups.analysis_files = {
        name: 'Analysis and Comparison Files',
        files: []
    };
    
    analysisFiles.forEach(filePath => {
        const stats = getFileStats(filePath);
        const fileInfo = {
            path: filePath,
            status: stats.exists ? 'VERIFIED' : 'MISSING',
            details: stats,
            hash: stats.exists ? calculateFileHash(filePath) : null
        };
        
        verification.backups.analysis_files.files.push(fileInfo);
        
        if (stats.exists) {
            console.log(`✅ ${path.basename(filePath)} verified (${stats.size} bytes)`);
            
            // Verify JSON structure
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                JSON.parse(content);
                console.log(`   📋 JSON structure valid`);
            } catch (error) {
                console.log(`   ⚠️ JSON structure invalid: ${error.message}`);
                fileInfo.json_valid = false;
            }
        } else {
            console.log(`❌ ${path.basename(filePath)} missing`);
        }
    });
    
    // 5. Calculate Summary
    console.log('5️⃣ Calculating Summary...');
    
    let successfulBackups = 0;
    let totalSize = 0;
    
    Object.values(verification.backups).forEach(backup => {
        verification.summary.total_backups++;
        
        if (backup.status === 'READY' || backup.status === 'COMPLETE' || backup.status === 'VERIFIED') {
            successfulBackups++;
        }
        
        if (backup.details && backup.details.total_size) {
            totalSize += backup.details.total_size;
        }
        
        if (backup.files) {
            backup.files.forEach(file => {
                if (file.details && file.details.size) {
                    totalSize += file.details.size;
                }
            });
        }
    });
    
    verification.summary.successful_backups = successfulBackups;
    verification.summary.failed_backups = verification.summary.total_backups - successfulBackups;
    verification.summary.total_backup_size = totalSize;
    
    // Determine overall status
    if (verification.summary.failed_backups === 0) {
        verification.overall_status = 'ALL_VERIFIED';
    } else if (verification.summary.successful_backups > 0) {
        verification.overall_status = 'PARTIAL_SUCCESS';
    } else {
        verification.overall_status = 'FAILED';
    }
    
    return verification;
}

// Execute verification
const verificationResult = verifyBackupIntegrity();

console.log('');
console.log('==========================================');
console.log('📊 BACKUP INTEGRITY VERIFICATION RESULTS');
console.log('==========================================');
console.log(`🎯 Overall Status: ${verificationResult.overall_status}`);
console.log(`📦 Total Backups: ${verificationResult.summary.total_backups}`);
console.log(`✅ Successful: ${verificationResult.summary.successful_backups}`);
console.log(`❌ Failed: ${verificationResult.summary.failed_backups}`);
console.log(`💾 Total Size: ${verificationResult.summary.total_backup_size} bytes`);
console.log('');

// Save verification report
const reportPath = './BACKUP_INTEGRITY_REPORT.json';
fs.writeFileSync(reportPath, JSON.stringify(verificationResult, null, 2));
console.log(`📄 Detailed report saved: ${reportPath}`);

// Create human-readable summary
const summaryPath = './BACKUP_VERIFICATION_SUMMARY.md';
const summary = `# Backup Integrity Verification Summary

**Verification Date:** ${verificationResult.timestamp}
**Overall Status:** ${verificationResult.overall_status}

## Summary
- **Total Backups:** ${verificationResult.summary.total_backups}
- **Successful:** ${verificationResult.summary.successful_backups}
- **Failed:** ${verificationResult.summary.failed_backups}
- **Total Size:** ${verificationResult.summary.total_backup_size} bytes

## Backup Components Status

${Object.entries(verificationResult.backups).map(([key, backup]) => `
### ${backup.name}
- **Status:** ${backup.status}
- **Location:** ${backup.file || backup.directory || 'Multiple files'}
${backup.details && backup.details.size ? `- **Size:** ${backup.details.size} bytes` : ''}
${backup.details && backup.details.missing_files && backup.details.missing_files.length > 0 ? `- **Missing Files:** ${backup.details.missing_files.join(', ')}` : ''}
`).join('')}

## Next Steps
${verificationResult.overall_status === 'ALL_VERIFIED' ? 
'✅ All backups verified successfully. Ready to proceed with migration.' :
'⚠️ Some backup issues detected. Review and resolve before proceeding.'}

**Generated:** ${new Date().toISOString()}
`;

fs.writeFileSync(summaryPath, summary);
console.log(`📋 Summary report saved: ${summaryPath}`);

console.log('');
console.log('🎉 Backup integrity verification completed!');

// Exit with appropriate code
process.exit(verificationResult.overall_status === 'ALL_VERIFIED' ? 0 : 1);
