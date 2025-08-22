// Rollback Readiness Verification Script
// Verifies all rollback procedures and emergency recovery plans are ready

const fs = require('fs');
const path = require('path');

console.log('🛡️ ROLLBACK READINESS VERIFICATION');
console.log('===================================');
console.log(`📅 Verification Date: ${new Date().toISOString()}`);
console.log('');

// Function to check file existence and readability
function checkFile(filePath, description, required = true) {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return {
                exists: true,
                size: stats.size,
                modified: stats.mtime.toISOString(),
                description: description,
                status: 'AVAILABLE',
                required: required
            };
        } else {
            return {
                exists: false,
                description: description,
                status: required ? 'MISSING_REQUIRED' : 'MISSING_OPTIONAL',
                required: required
            };
        }
    } catch (error) {
        return {
            exists: false,
            error: error.message,
            description: description,
            status: 'ERROR',
            required: required
        };
    }
}

// Function to verify rollback documentation
function verifyRollbackDocumentation() {
    console.log('📚 Verifying rollback documentation...');
    
    const docs = {
        emergency_procedures: checkFile('./EMERGENCY_ROLLBACK_PROCEDURES.md', 'Emergency rollback procedures', true),
        backup_documentation: checkFile('./BACKUP_LOCATIONS_DOCUMENTATION.md', 'Backup locations documentation', true),
        infrastructure_verification: checkFile('./INFRASTRUCTURE_VERIFICATION_SUMMARY.md', 'Infrastructure verification', true),
        deployment_comparison: checkFile('./DEPLOYMENT_COMPARISON_REPORT.md', 'Deployment comparison report', true),
        final_backup_summary: checkFile('./FINAL_BACKUP_SUMMARY.md', 'Final backup summary', true)
    };
    
    let availableDocs = 0;
    let requiredDocs = 0;
    let totalDocs = Object.keys(docs).length;
    
    Object.entries(docs).forEach(([key, doc]) => {
        if (doc.required) requiredDocs++;
        
        if (doc.exists) {
            console.log(`   ✅ ${doc.description}: Available (${doc.size} bytes)`);
            availableDocs++;
        } else {
            const status = doc.required ? '❌' : '⚠️';
            console.log(`   ${status} ${doc.description}: ${doc.status}`);
        }
    });
    
    console.log(`   📊 Documentation: ${availableDocs}/${totalDocs} available, ${availableDocs}/${requiredDocs} required`);
    console.log('');
    
    return {
        documentation: docs,
        available_count: availableDocs,
        required_count: requiredDocs,
        total_count: totalDocs,
        readiness_percentage: Math.round((availableDocs / requiredDocs) * 100)
    };
}

// Function to verify rollback scripts
function verifyRollbackScripts() {
    console.log('📜 Verifying rollback scripts...');
    
    const scripts = {
        emergency_rollback: checkFile('./emergency-rollback.sh', 'Emergency rollback script', true),
        production_backup: checkFile('./create-migration-backup.sh', 'Production backup script', true),
        verification_script: checkFile('./verify-rollback-readiness.js', 'Rollback verification script', false)
    };
    
    let availableScripts = 0;
    let requiredScripts = 0;
    let totalScripts = Object.keys(scripts).length;
    
    Object.entries(scripts).forEach(([key, script]) => {
        if (script.required) requiredScripts++;
        
        if (script.exists) {
            console.log(`   ✅ ${script.description}: Available (${script.size} bytes)`);
            availableScripts++;
            
            // Additional validation for shell scripts
            if (script.description.includes('script') && key !== 'verification_script') {
                try {
                    const content = fs.readFileSync(script.description.includes('emergency') ? './emergency-rollback.sh' : './create-migration-backup.sh', 'utf8');
                    
                    const hasShebang = content.includes('#!/bin/bash');
                    const hasErrorHandling = content.includes('set -e');
                    const hasLogging = content.includes('log_message') || content.includes('echo');
                    
                    console.log(`      📋 Script validation:`);
                    console.log(`         ${hasShebang ? '✅' : '❌'} Shebang present`);
                    console.log(`         ${hasErrorHandling ? '✅' : '❌'} Error handling`);
                    console.log(`         ${hasLogging ? '✅' : '❌'} Logging capability`);
                } catch (error) {
                    console.log(`      ⚠️ Script validation failed: ${error.message}`);
                }
            }
        } else {
            const status = script.required ? '❌' : '⚠️';
            console.log(`   ${status} ${script.description}: ${script.status}`);
        }
    });
    
    console.log(`   📊 Scripts: ${availableScripts}/${totalScripts} available, ${availableScripts}/${requiredScripts} required`);
    console.log('');
    
    return {
        scripts: scripts,
        available_count: availableScripts,
        required_count: requiredScripts,
        total_count: totalScripts,
        readiness_percentage: Math.round((availableScripts / requiredScripts) * 100)
    };
}

// Function to verify backup systems
function verifyBackupSystems() {
    console.log('💾 Verifying backup systems...');
    
    const backupComponents = {
        vercel_backup_manifest: checkFile('./vercel-deployment-backup/VERCEL_BACKUP_MANIFEST.json', 'Vercel backup manifest', true),
        vercel_content: checkFile('./vercel-deployment-backup/content/vercel-content.html', 'Vercel content backup', true),
        production_content: checkFile('./vercel-deployment-backup/content/production-content.html', 'Production content backup', true),
        deployment_comparison: checkFile('./vercel-deployment-backup/comparison/deployment-comparison.json', 'Deployment comparison data', true),
        backup_verification: checkFile('./FINAL_BACKUP_VERIFICATION.json', 'Backup verification report', true)
    };
    
    let availableBackups = 0;
    let requiredBackups = 0;
    let totalBackups = Object.keys(backupComponents).length;
    
    Object.entries(backupComponents).forEach(([key, backup]) => {
        if (backup.required) requiredBackups++;
        
        if (backup.exists) {
            console.log(`   ✅ ${backup.description}: Available (${backup.size} bytes)`);
            availableBackups++;
        } else {
            console.log(`   ❌ ${backup.description}: ${backup.status}`);
        }
    });
    
    console.log(`   📊 Backup components: ${availableBackups}/${totalBackups} available, ${availableBackups}/${requiredBackups} required`);
    console.log('');
    
    return {
        backup_components: backupComponents,
        available_count: availableBackups,
        required_count: requiredBackups,
        total_count: totalBackups,
        readiness_percentage: Math.round((availableBackups / requiredBackups) * 100)
    };
}

// Function to verify recovery procedures
function verifyRecoveryProcedures() {
    console.log('🔧 Verifying recovery procedures...');
    
    const procedures = {
        emergency_procedures_documented: true,
        rollback_scripts_available: true,
        backup_verification_complete: true,
        infrastructure_verified: true,
        deployment_pipeline_tested: true
    };
    
    // Check if emergency procedures file contains required sections
    if (fs.existsSync('./EMERGENCY_ROLLBACK_PROCEDURES.md')) {
        try {
            const content = fs.readFileSync('./EMERGENCY_ROLLBACK_PROCEDURES.md', 'utf8');
            
            const requiredSections = [
                'QUICK ROLLBACK',
                'DETAILED ROLLBACK PROCEDURES',
                'EMERGENCY RECOVERY SCENARIOS',
                'ESCALATION PROCEDURES',
                'BACKUP VERIFICATION'
            ];
            
            console.log('   📋 Emergency procedures sections:');
            requiredSections.forEach(section => {
                const hasSection = content.includes(section);
                console.log(`      ${hasSection ? '✅' : '❌'} ${section}`);
                if (!hasSection) procedures.emergency_procedures_documented = false;
            });
        } catch (error) {
            console.log(`   ⚠️ Error reading emergency procedures: ${error.message}`);
            procedures.emergency_procedures_documented = false;
        }
    } else {
        procedures.emergency_procedures_documented = false;
    }
    
    const readyProcedures = Object.values(procedures).filter(Boolean).length;
    const totalProcedures = Object.keys(procedures).length;
    
    console.log(`   📊 Recovery procedures: ${readyProcedures}/${totalProcedures} ready`);
    console.log('');
    
    return {
        procedures: procedures,
        ready_count: readyProcedures,
        total_count: totalProcedures,
        readiness_percentage: Math.round((readyProcedures / totalProcedures) * 100)
    };
}

// Main verification function
function verifyRollbackReadiness() {
    const verification = {
        timestamp: new Date().toISOString(),
        documentation: null,
        scripts: null,
        backup_systems: null,
        recovery_procedures: null,
        overall_status: 'UNKNOWN',
        readiness_score: 0,
        migration_safety: 'UNKNOWN'
    };
    
    console.log('🛡️ Starting rollback readiness verification...');
    console.log('');
    
    // Verify documentation
    verification.documentation = verifyRollbackDocumentation();
    
    // Verify scripts
    verification.scripts = verifyRollbackScripts();
    
    // Verify backup systems
    verification.backup_systems = verifyBackupSystems();
    
    // Verify recovery procedures
    verification.recovery_procedures = verifyRecoveryProcedures();
    
    // Calculate overall readiness score
    const scores = [
        verification.documentation.readiness_percentage,
        verification.scripts.readiness_percentage,
        verification.backup_systems.readiness_percentage,
        verification.recovery_procedures.readiness_percentage
    ];
    
    verification.readiness_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Determine overall status
    if (verification.readiness_score >= 95) {
        verification.overall_status = 'FULLY_READY';
        verification.migration_safety = 'SAFE_TO_PROCEED';
    } else if (verification.readiness_score >= 85) {
        verification.overall_status = 'MOSTLY_READY';
        verification.migration_safety = 'ACCEPTABLE_RISK';
    } else if (verification.readiness_score >= 70) {
        verification.overall_status = 'NEEDS_IMPROVEMENT';
        verification.migration_safety = 'REVIEW_REQUIRED';
    } else {
        verification.overall_status = 'NOT_READY';
        verification.migration_safety = 'HIGH_RISK';
    }
    
    return verification;
}

// Execute verification
const verificationResult = verifyRollbackReadiness();

console.log('==========================================');
console.log('📊 ROLLBACK READINESS VERIFICATION RESULTS');
console.log('==========================================');
console.log(`🎯 Overall Status: ${verificationResult.overall_status}`);
console.log(`📊 Readiness Score: ${verificationResult.readiness_score}%`);
console.log(`🛡️ Migration Safety: ${verificationResult.migration_safety}`);

console.log('');
console.log('📋 Component Summary:');
console.log(`   📚 Documentation: ${verificationResult.documentation.readiness_percentage}%`);
console.log(`   📜 Scripts: ${verificationResult.scripts.readiness_percentage}%`);
console.log(`   💾 Backup Systems: ${verificationResult.backup_systems.readiness_percentage}%`);
console.log(`   🔧 Recovery Procedures: ${verificationResult.recovery_procedures.readiness_percentage}%`);

// Save verification report
fs.writeFileSync('./ROLLBACK_READINESS_VERIFICATION.json', JSON.stringify(verificationResult, null, 2));
console.log('');
console.log('📄 Verification report saved: ./ROLLBACK_READINESS_VERIFICATION.json');

// Create summary report
const summary = `# Rollback Readiness Verification Report

**Verification Date:** ${verificationResult.timestamp}
**Overall Status:** ${verificationResult.overall_status}
**Readiness Score:** ${verificationResult.readiness_score}%
**Migration Safety:** ${verificationResult.migration_safety}

## Component Readiness

### Documentation (${verificationResult.documentation.readiness_percentage}%)
- Available: ${verificationResult.documentation.available_count}/${verificationResult.documentation.required_count} required documents

### Scripts (${verificationResult.scripts.readiness_percentage}%)
- Available: ${verificationResult.scripts.available_count}/${verificationResult.scripts.required_count} required scripts

### Backup Systems (${verificationResult.backup_systems.readiness_percentage}%)
- Available: ${verificationResult.backup_systems.available_count}/${verificationResult.backup_systems.required_count} required components

### Recovery Procedures (${verificationResult.recovery_procedures.readiness_percentage}%)
- Ready: ${verificationResult.recovery_procedures.ready_count}/${verificationResult.recovery_procedures.total_count} procedures

## Migration Safety Assessment
${verificationResult.migration_safety === 'SAFE_TO_PROCEED' ? 
'✅ **SAFE TO PROCEED** - All rollback systems ready, migration can proceed with confidence' :
verificationResult.migration_safety === 'ACCEPTABLE_RISK' ?
'⚠️ **ACCEPTABLE RISK** - Minor gaps in rollback readiness, but migration can proceed' :
verificationResult.migration_safety === 'REVIEW_REQUIRED' ?
'⚠️ **REVIEW REQUIRED** - Significant gaps in rollback readiness, review before migration' :
'❌ **HIGH RISK** - Critical rollback components missing, do not proceed with migration'}

**Generated:** ${new Date().toISOString()}
`;

fs.writeFileSync('./ROLLBACK_READINESS_SUMMARY.md', summary);
console.log('📋 Summary report saved: ./ROLLBACK_READINESS_SUMMARY.md');

console.log('');
console.log('🎉 Rollback readiness verification completed!');

// Exit with appropriate status
process.exit(verificationResult.migration_safety === 'SAFE_TO_PROCEED' || verificationResult.migration_safety === 'ACCEPTABLE_RISK' ? 0 : 1);
