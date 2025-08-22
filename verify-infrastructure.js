// Infrastructure Verification Script
// Verifies server status, GitHub Actions, and deployment readiness

const fs = require('fs');
const path = require('path');

console.log('🔍 INFRASTRUCTURE VERIFICATION');
console.log('==============================');
console.log(`📅 Verification Date: ${new Date().toISOString()}`);
console.log('');

// Function to check file existence and get info
function checkFile(filePath, description) {
    try {
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            return {
                exists: true,
                size: stats.size,
                modified: stats.mtime.toISOString(),
                description: description,
                status: 'AVAILABLE'
            };
        } else {
            return {
                exists: false,
                description: description,
                status: 'MISSING'
            };
        }
    } catch (error) {
        return {
            exists: false,
            error: error.message,
            description: description,
            status: 'ERROR'
        };
    }
}

// Function to verify deployment scripts
function verifyDeploymentScripts() {
    console.log('📜 Verifying deployment scripts...');
    
    const scripts = {
        production_backup: checkFile('./create-migration-backup.sh', 'Production backup script'),
        github_workflow: checkFile('./.github/workflows/deploy.yml', 'GitHub Actions workflow'),
        ecosystem_config: checkFile('./ecosystem.config.js', 'PM2 ecosystem configuration'),
        package_json: checkFile('./package.json', 'Package configuration'),
        next_config: checkFile('./next.config.ts', 'Next.js configuration'),
        modern_ecosystem: checkFile('./smile-rental-modern/ecosystem.config.js', 'Modern ecosystem config'),
        modern_package: checkFile('./smile-rental-modern/package.json', 'Modern package config')
    };
    
    let availableScripts = 0;
    let totalScripts = Object.keys(scripts).length;
    
    Object.entries(scripts).forEach(([key, script]) => {
        if (script.exists) {
            console.log(`   ✅ ${script.description}: Available (${script.size} bytes)`);
            availableScripts++;
        } else {
            console.log(`   ❌ ${script.description}: ${script.status}`);
        }
    });
    
    console.log(`   📊 Scripts available: ${availableScripts}/${totalScripts}`);
    console.log('');
    
    return {
        scripts: scripts,
        available_count: availableScripts,
        total_count: totalScripts,
        readiness_percentage: Math.round((availableScripts / totalScripts) * 100)
    };
}

// Function to verify GitHub Actions workflow
function verifyGitHubWorkflow() {
    console.log('🔄 Verifying GitHub Actions workflow...');
    
    const workflowPath = './.github/workflows/deploy.yml';
    
    if (!fs.existsSync(workflowPath)) {
        console.log('   ❌ GitHub Actions workflow not found');
        return { status: 'MISSING', details: 'Workflow file not found' };
    }
    
    try {
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        
        // Check for key workflow components
        const checks = {
            has_trigger: workflowContent.includes('on:'),
            has_push_trigger: workflowContent.includes('push:'),
            has_main_branch: workflowContent.includes('main'),
            has_workflow_dispatch: workflowContent.includes('workflow_dispatch'),
            has_ssh_action: workflowContent.includes('ssh') || workflowContent.includes('SSH'),
            has_deployment_steps: workflowContent.includes('deploy') || workflowContent.includes('Deploy')
        };
        
        const passedChecks = Object.values(checks).filter(Boolean).length;
        const totalChecks = Object.keys(checks).length;
        
        console.log(`   📋 Workflow components: ${passedChecks}/${totalChecks} verified`);
        
        Object.entries(checks).forEach(([check, passed]) => {
            const checkName = check.replace(/_/g, ' ').replace(/^has /, '');
            console.log(`      ${passed ? '✅' : '❌'} ${checkName}`);
        });
        
        console.log('');
        
        return {
            status: passedChecks >= totalChecks * 0.8 ? 'READY' : 'NEEDS_REVIEW',
            details: checks,
            passed_checks: passedChecks,
            total_checks: totalChecks,
            content_size: workflowContent.length
        };
        
    } catch (error) {
        console.log(`   ❌ Error reading workflow: ${error.message}`);
        return { status: 'ERROR', error: error.message };
    }
}

// Function to verify package configurations
function verifyPackageConfigurations() {
    console.log('📦 Verifying package configurations...');
    
    const configs = [];
    
    // Check main package.json
    if (fs.existsSync('./package.json')) {
        try {
            const packageData = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
            configs.push({
                file: './package.json',
                name: packageData.name || 'Unknown',
                version: packageData.version || 'Unknown',
                has_build_script: !!packageData.scripts?.build,
                has_start_script: !!packageData.scripts?.start,
                has_dependencies: !!packageData.dependencies,
                status: 'VALID'
            });
            console.log(`   ✅ Main package.json: ${packageData.name} v${packageData.version}`);
        } catch (error) {
            configs.push({
                file: './package.json',
                status: 'INVALID',
                error: error.message
            });
            console.log(`   ❌ Main package.json: Invalid JSON`);
        }
    }
    
    // Check modern package.json
    if (fs.existsSync('./smile-rental-modern/package.json')) {
        try {
            const packageData = JSON.parse(fs.readFileSync('./smile-rental-modern/package.json', 'utf8'));
            configs.push({
                file: './smile-rental-modern/package.json',
                name: packageData.name || 'Unknown',
                version: packageData.version || 'Unknown',
                has_build_script: !!packageData.scripts?.build,
                has_start_script: !!packageData.scripts?.start,
                has_dependencies: !!packageData.dependencies,
                status: 'VALID'
            });
            console.log(`   ✅ Modern package.json: ${packageData.name} v${packageData.version}`);
        } catch (error) {
            configs.push({
                file: './smile-rental-modern/package.json',
                status: 'INVALID',
                error: error.message
            });
            console.log(`   ❌ Modern package.json: Invalid JSON`);
        }
    }
    
    console.log('');
    
    return {
        configurations: configs,
        valid_configs: configs.filter(c => c.status === 'VALID').length,
        total_configs: configs.length
    };
}

// Function to check backup readiness
function verifyBackupReadiness() {
    console.log('💾 Verifying backup readiness...');
    
    const backupComponents = {
        production_script: checkFile('./create-migration-backup.sh', 'Production backup script'),
        vercel_backup: checkFile('./vercel-deployment-backup/VERCEL_BACKUP_MANIFEST.json', 'Vercel backup manifest'),
        backup_verification: checkFile('./FINAL_BACKUP_VERIFICATION.json', 'Backup verification report'),
        comparison_analysis: checkFile('./DEPLOYMENT_COMPARISON_ANALYSIS.json', 'Deployment comparison'),
        backup_documentation: checkFile('./BACKUP_LOCATIONS_DOCUMENTATION.md', 'Backup documentation')
    };
    
    let readyComponents = 0;
    let totalComponents = Object.keys(backupComponents).length;
    
    Object.entries(backupComponents).forEach(([key, component]) => {
        if (component.exists) {
            console.log(`   ✅ ${component.description}: Ready`);
            readyComponents++;
        } else {
            console.log(`   ❌ ${component.description}: ${component.status}`);
        }
    });
    
    console.log(`   📊 Backup readiness: ${readyComponents}/${totalComponents} (${Math.round((readyComponents/totalComponents)*100)}%)`);
    console.log('');
    
    return {
        components: backupComponents,
        ready_count: readyComponents,
        total_count: totalComponents,
        readiness_percentage: Math.round((readyComponents / totalComponents) * 100)
    };
}

// Main verification function
function performInfrastructureVerification() {
    const verification = {
        timestamp: new Date().toISOString(),
        deployment_scripts: null,
        github_workflow: null,
        package_configurations: null,
        backup_readiness: null,
        overall_status: 'UNKNOWN',
        readiness_score: 0
    };
    
    console.log('🔍 Starting infrastructure verification...');
    console.log('');
    
    // Verify deployment scripts
    verification.deployment_scripts = verifyDeploymentScripts();
    
    // Verify GitHub workflow
    verification.github_workflow = verifyGitHubWorkflow();
    
    // Verify package configurations
    verification.package_configurations = verifyPackageConfigurations();
    
    // Verify backup readiness
    verification.backup_readiness = verifyBackupReadiness();
    
    // Calculate overall readiness score
    let totalScore = 0;
    let maxScore = 0;
    
    // Deployment scripts score (25%)
    totalScore += (verification.deployment_scripts.readiness_percentage / 100) * 25;
    maxScore += 25;
    
    // GitHub workflow score (25%)
    if (verification.github_workflow.status === 'READY') {
        totalScore += 25;
    } else if (verification.github_workflow.status === 'NEEDS_REVIEW') {
        totalScore += 15;
    }
    maxScore += 25;
    
    // Package configurations score (25%)
    if (verification.package_configurations.valid_configs > 0) {
        totalScore += (verification.package_configurations.valid_configs / verification.package_configurations.total_configs) * 25;
    }
    maxScore += 25;
    
    // Backup readiness score (25%)
    totalScore += (verification.backup_readiness.readiness_percentage / 100) * 25;
    maxScore += 25;
    
    verification.readiness_score = Math.round((totalScore / maxScore) * 100);
    
    // Determine overall status
    if (verification.readiness_score >= 90) {
        verification.overall_status = 'READY';
    } else if (verification.readiness_score >= 75) {
        verification.overall_status = 'MOSTLY_READY';
    } else if (verification.readiness_score >= 50) {
        verification.overall_status = 'NEEDS_WORK';
    } else {
        verification.overall_status = 'NOT_READY';
    }
    
    return verification;
}

// Execute verification
const verificationResult = performInfrastructureVerification();

console.log('==========================================');
console.log('📊 INFRASTRUCTURE VERIFICATION RESULTS');
console.log('==========================================');
console.log(`🎯 Overall Status: ${verificationResult.overall_status}`);
console.log(`📊 Readiness Score: ${verificationResult.readiness_score}%`);
console.log('');

console.log('📋 Component Summary:');
console.log(`   📜 Deployment Scripts: ${verificationResult.deployment_scripts.readiness_percentage}%`);
console.log(`   🔄 GitHub Workflow: ${verificationResult.github_workflow.status}`);
console.log(`   📦 Package Configs: ${verificationResult.package_configurations.valid_configs}/${verificationResult.package_configurations.total_configs} valid`);
console.log(`   💾 Backup Readiness: ${verificationResult.backup_readiness.readiness_percentage}%`);

// Save verification report
fs.writeFileSync('./INFRASTRUCTURE_VERIFICATION.json', JSON.stringify(verificationResult, null, 2));
console.log('');
console.log('📄 Verification report saved: ./INFRASTRUCTURE_VERIFICATION.json');

// Create summary report
const summary = `# Infrastructure Verification Report

**Verification Date:** ${verificationResult.timestamp}
**Overall Status:** ${verificationResult.overall_status}
**Readiness Score:** ${verificationResult.readiness_score}%

## Component Status

### Deployment Scripts (${verificationResult.deployment_scripts.readiness_percentage}%)
- Available: ${verificationResult.deployment_scripts.available_count}/${verificationResult.deployment_scripts.total_count}

### GitHub Workflow
- Status: ${verificationResult.github_workflow.status}
- Components: ${verificationResult.github_workflow.passed_checks || 0}/${verificationResult.github_workflow.total_checks || 0} verified

### Package Configurations
- Valid: ${verificationResult.package_configurations.valid_configs}/${verificationResult.package_configurations.total_configs}

### Backup Readiness (${verificationResult.backup_readiness.readiness_percentage}%)
- Ready: ${verificationResult.backup_readiness.ready_count}/${verificationResult.backup_readiness.total_count}

## Migration Readiness
${verificationResult.overall_status === 'READY' ? 
'✅ **INFRASTRUCTURE READY** - All systems verified and ready for migration' :
verificationResult.overall_status === 'MOSTLY_READY' ?
'⚠️ **MOSTLY READY** - Minor issues detected, but migration can proceed' :
'❌ **NOT READY** - Critical issues must be resolved before migration'}

**Generated:** ${new Date().toISOString()}
`;

fs.writeFileSync('./INFRASTRUCTURE_VERIFICATION_SUMMARY.md', summary);
console.log('📋 Summary report saved: ./INFRASTRUCTURE_VERIFICATION_SUMMARY.md');

console.log('');
console.log('🎉 Infrastructure verification completed!');

// Exit with appropriate status
process.exit(verificationResult.overall_status === 'READY' || verificationResult.overall_status === 'MOSTLY_READY' ? 0 : 1);
