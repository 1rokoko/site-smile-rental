// Final Backup Verification and Documentation
// Comprehensive verification of all backup components

const fs = require('fs');
const path = require('path');

console.log('🔍 FINAL BACKUP VERIFICATION');
console.log('============================');
console.log(`📅 Date: ${new Date().toISOString()}`);
console.log('');

// Verification checklist
const verificationChecklist = {
    production_backup_script: {
        name: 'Production Backup Script',
        file: './create-migration-backup.sh',
        required: true,
        status: 'PENDING'
    },
    vercel_content: {
        name: 'Vercel Content Backup',
        file: './vercel-deployment-backup/content/vercel-content.html',
        required: true,
        status: 'PENDING'
    },
    production_content: {
        name: 'Production Content Backup',
        file: './vercel-deployment-backup/content/production-content.html',
        required: true,
        status: 'PENDING'
    },
    vercel_analysis: {
        name: 'Vercel Analysis',
        file: './vercel-deployment-backup/analysis/vercel-analysis.json',
        required: true,
        status: 'PENDING'
    },
    production_analysis: {
        name: 'Production Analysis',
        file: './vercel-deployment-backup/analysis/production-analysis.json',
        required: true,
        status: 'PENDING'
    },
    deployment_comparison: {
        name: 'Deployment Comparison',
        file: './vercel-deployment-backup/comparison/deployment-comparison.json',
        required: true,
        status: 'PENDING'
    },
    backup_manifest: {
        name: 'Backup Manifest',
        file: './vercel-deployment-backup/VERCEL_BACKUP_MANIFEST.json',
        required: true,
        status: 'PENDING'
    },
    backup_summary: {
        name: 'Backup Summary',
        file: './vercel-deployment-backup/BACKUP_SUMMARY.md',
        required: true,
        status: 'PENDING'
    }
};

// Verify each component
console.log('📋 Checking backup components...');
console.log('');

let totalComponents = 0;
let verifiedComponents = 0;
let totalSize = 0;

Object.entries(verificationChecklist).forEach(([key, component]) => {
    totalComponents++;
    console.log(`🔍 Checking: ${component.name}`);
    
    try {
        if (fs.existsSync(component.file)) {
            const stats = fs.statSync(component.file);
            component.status = 'VERIFIED';
            component.size = stats.size;
            component.modified = stats.mtime.toISOString();
            totalSize += stats.size;
            verifiedComponents++;
            
            console.log(`   ✅ Found: ${component.file} (${stats.size} bytes)`);
            
            // Additional validation for JSON files
            if (component.file.endsWith('.json')) {
                try {
                    const content = fs.readFileSync(component.file, 'utf8');
                    JSON.parse(content);
                    console.log(`   📋 JSON structure valid`);
                } catch (jsonError) {
                    console.log(`   ⚠️ JSON structure invalid: ${jsonError.message}`);
                    component.json_valid = false;
                }
            }
            
        } else {
            component.status = 'MISSING';
            console.log(`   ❌ Missing: ${component.file}`);
        }
    } catch (error) {
        component.status = 'ERROR';
        component.error = error.message;
        console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
});

// Content verification
console.log('📊 Content Analysis Verification...');
try {
    const comparisonFile = './vercel-deployment-backup/comparison/deployment-comparison.json';
    if (fs.existsSync(comparisonFile)) {
        const comparison = JSON.parse(fs.readFileSync(comparisonFile, 'utf8'));
        
        console.log(`   🌐 Vercel size: ${comparison.vercel.size} bytes`);
        console.log(`   🏠 Production size: ${comparison.production.size} bytes`);
        console.log(`   📏 Size difference: ${comparison.differences.size_difference} bytes`);
        console.log(`   📝 Title match: ${comparison.differences.title_match ? '✅' : '❌'}`);
        console.log(`   📄 Meta description match: ${comparison.differences.meta_description_match ? '✅' : '❌'}`);
        console.log(`   💡 Recommendation: ${comparison.recommendation}`);
        
        // Store for final report
        verificationChecklist.content_analysis = {
            vercel_size: comparison.vercel.size,
            production_size: comparison.production.size,
            size_difference: comparison.differences.size_difference,
            title_match: comparison.differences.title_match,
            meta_description_match: comparison.differences.meta_description_match,
            recommendation: comparison.recommendation
        };
    }
} catch (error) {
    console.log(`   ❌ Content analysis error: ${error.message}`);
}

console.log('');

// Generate final report
const finalReport = {
    verification_date: new Date().toISOString(),
    summary: {
        total_components: totalComponents,
        verified_components: verifiedComponents,
        missing_components: totalComponents - verifiedComponents,
        total_backup_size: totalSize,
        verification_percentage: Math.round((verifiedComponents / totalComponents) * 100)
    },
    components: verificationChecklist,
    overall_status: verifiedComponents === totalComponents ? 'ALL_VERIFIED' : 'INCOMPLETE',
    migration_readiness: 'UNKNOWN'
};

// Determine migration readiness
if (finalReport.overall_status === 'ALL_VERIFIED' && 
    finalReport.components.content_analysis &&
    finalReport.components.content_analysis.recommendation.includes('SAFE')) {
    finalReport.migration_readiness = 'READY';
} else if (verifiedComponents >= totalComponents * 0.8) {
    finalReport.migration_readiness = 'MOSTLY_READY';
} else {
    finalReport.migration_readiness = 'NOT_READY';
}

// Display results
console.log('==========================================');
console.log('📊 FINAL VERIFICATION RESULTS');
console.log('==========================================');
console.log(`🎯 Overall Status: ${finalReport.overall_status}`);
console.log(`📦 Components Verified: ${verifiedComponents}/${totalComponents} (${finalReport.summary.verification_percentage}%)`);
console.log(`💾 Total Backup Size: ${totalSize} bytes`);
console.log(`🚀 Migration Readiness: ${finalReport.migration_readiness}`);

if (finalReport.components.content_analysis) {
    console.log('');
    console.log('📋 Content Analysis Summary:');
    console.log(`   Size Match: ${finalReport.components.content_analysis.size_difference === 0 ? '✅ Identical' : '⚠️ Different'}`);
    console.log(`   Content Match: ${finalReport.components.content_analysis.title_match && finalReport.components.content_analysis.meta_description_match ? '✅ Identical' : '⚠️ Different'}`);
    console.log(`   Recommendation: ${finalReport.components.content_analysis.recommendation}`);
}

console.log('');

// Save final report
fs.writeFileSync('./FINAL_BACKUP_VERIFICATION.json', JSON.stringify(finalReport, null, 2));
console.log('📄 Final verification report saved: ./FINAL_BACKUP_VERIFICATION.json');

// Create final summary
const finalSummary = `# Final Backup Verification Report

**Verification Date:** ${finalReport.verification_date}
**Overall Status:** ${finalReport.overall_status}
**Migration Readiness:** ${finalReport.migration_readiness}

## Summary
- **Total Components:** ${finalReport.summary.total_components}
- **Verified:** ${finalReport.summary.verified_components}
- **Missing:** ${finalReport.summary.missing_components}
- **Verification Rate:** ${finalReport.summary.verification_percentage}%
- **Total Size:** ${finalReport.summary.total_backup_size} bytes

## Component Status
${Object.entries(finalReport.components).filter(([key, comp]) => comp.name).map(([key, comp]) => `
### ${comp.name}
- **Status:** ${comp.status}
- **File:** ${comp.file}
${comp.size ? `- **Size:** ${comp.size} bytes` : ''}
${comp.error ? `- **Error:** ${comp.error}` : ''}
`).join('')}

## Content Analysis
${finalReport.components.content_analysis ? `
- **Vercel Size:** ${finalReport.components.content_analysis.vercel_size} bytes
- **Production Size:** ${finalReport.components.content_analysis.production_size} bytes
- **Size Difference:** ${finalReport.components.content_analysis.size_difference} bytes
- **Title Match:** ${finalReport.components.content_analysis.title_match ? '✅' : '❌'}
- **Meta Description Match:** ${finalReport.components.content_analysis.meta_description_match ? '✅' : '❌'}
- **Recommendation:** ${finalReport.components.content_analysis.recommendation}
` : 'Content analysis not available'}

## Migration Decision
${finalReport.migration_readiness === 'READY' ? 
'✅ **APPROVED FOR MIGRATION** - All backups verified, content identical, safe to proceed' :
finalReport.migration_readiness === 'MOSTLY_READY' ?
'⚠️ **REVIEW REQUIRED** - Most backups verified, review missing components' :
'❌ **NOT READY** - Critical backup components missing, resolve issues before migration'}

**Generated:** ${new Date().toISOString()}
`;

fs.writeFileSync('./FINAL_BACKUP_SUMMARY.md', finalSummary);
console.log('📋 Final summary saved: ./FINAL_BACKUP_SUMMARY.md');

console.log('');
console.log('🎉 Final backup verification completed!');

// Exit with appropriate status
if (finalReport.migration_readiness === 'READY') {
    console.log('✅ All systems ready for migration execution!');
    process.exit(0);
} else {
    console.log('⚠️ Review required before proceeding with migration');
    process.exit(1);
}
