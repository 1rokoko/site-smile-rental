// Comprehensive Deployment Comparison Analysis
// Detailed analysis of differences between Vercel and Production deployments

const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE DEPLOYMENT COMPARISON ANALYSIS');
console.log('===============================================');
console.log(`📅 Analysis Date: ${new Date().toISOString()}`);
console.log('');

// Load comparison data
function loadComparisonData() {
    try {
        const comparisonPath = './vercel-deployment-backup/comparison/deployment-comparison.json';
        const data = JSON.parse(fs.readFileSync(comparisonPath, 'utf8'));
        return data;
    } catch (error) {
        console.error('❌ Error loading comparison data:', error.message);
        return null;
    }
}

// Analyze script differences
function analyzeScriptDifferences(vercelScripts, productionScripts) {
    const analysis = {
        total_vercel: vercelScripts.length,
        total_production: productionScripts.length,
        identical_scripts: [],
        different_scripts: [],
        vercel_only: [],
        production_only: []
    };
    
    // Find identical scripts
    vercelScripts.forEach(script => {
        if (productionScripts.includes(script)) {
            analysis.identical_scripts.push(script);
        }
    });
    
    // Find different scripts by comparing base names (without hashes)
    vercelScripts.forEach(vercelScript => {
        const vercelBaseName = vercelScript.replace(/-[a-f0-9]+\.js$/, '.js');
        const matchingProdScript = productionScripts.find(prodScript => {
            const prodBaseName = prodScript.replace(/-[a-f0-9]+\.js$/, '.js');
            return vercelBaseName === prodBaseName;
        });
        
        if (matchingProdScript && vercelScript !== matchingProdScript) {
            analysis.different_scripts.push({
                vercel: vercelScript,
                production: matchingProdScript,
                base_name: vercelBaseName
            });
        } else if (!matchingProdScript && !analysis.identical_scripts.includes(vercelScript)) {
            analysis.vercel_only.push(vercelScript);
        }
    });
    
    // Find production-only scripts
    productionScripts.forEach(prodScript => {
        const prodBaseName = prodScript.replace(/-[a-f0-9]+\.js$/, '.js');
        const matchingVercelScript = vercelScripts.find(vercelScript => {
            const vercelBaseName = vercelScript.replace(/-[a-f0-9]+\.js$/, '.js');
            return vercelBaseName === prodBaseName;
        });
        
        if (!matchingVercelScript && !analysis.identical_scripts.includes(prodScript)) {
            analysis.production_only.push(prodScript);
        }
    });
    
    return analysis;
}

// Analyze content differences
function analyzeContentDifferences(vercelData, productionData) {
    const analysis = {
        size_comparison: {
            vercel: vercelData.size,
            production: productionData.size,
            difference: Math.abs(vercelData.size - productionData.size),
            percentage_difference: vercelData.size > 0 ? 
                Math.round((Math.abs(vercelData.size - productionData.size) / vercelData.size) * 100 * 100) / 100 : 0
        },
        metadata_comparison: {
            title_match: vercelData.title === productionData.title,
            meta_description_match: vercelData.meta_description === productionData.meta_description,
            title_vercel: vercelData.title,
            title_production: productionData.title,
            meta_description_vercel: vercelData.meta_description,
            meta_description_production: productionData.meta_description
        },
        assets_comparison: {
            scripts: analyzeScriptDifferences(vercelData.scripts, productionData.scripts),
            stylesheets: {
                vercel_count: vercelData.stylesheets.length,
                production_count: productionData.stylesheets.length,
                identical: JSON.stringify(vercelData.stylesheets.sort()) === JSON.stringify(productionData.stylesheets.sort()),
                vercel_stylesheets: vercelData.stylesheets,
                production_stylesheets: productionData.stylesheets
            },
            images: {
                vercel_count: vercelData.images.length,
                production_count: productionData.images.length,
                identical: JSON.stringify(vercelData.images.sort()) === JSON.stringify(productionData.images.sort()),
                vercel_images: vercelData.images,
                production_images: productionData.images
            }
        },
        text_content_comparison: {
            vercel_length: vercelData.text_content.length,
            production_length: productionData.text_content.length,
            identical: vercelData.text_content === productionData.text_content
        }
    };
    
    return analysis;
}

// Generate migration risk assessment
function generateRiskAssessment(analysis) {
    const risks = [];
    const benefits = [];
    let riskLevel = 'LOW';
    
    // Analyze size differences
    if (analysis.size_comparison.percentage_difference > 5) {
        risks.push(`Significant size difference: ${analysis.size_comparison.percentage_difference}%`);
        riskLevel = 'MEDIUM';
    } else if (analysis.size_comparison.difference === 0) {
        benefits.push('Identical content size - no data loss risk');
    }
    
    // Analyze metadata
    if (!analysis.metadata_comparison.title_match) {
        risks.push('Title mismatch detected');
        riskLevel = 'MEDIUM';
    } else {
        benefits.push('Identical page titles');
    }
    
    if (!analysis.metadata_comparison.meta_description_match) {
        risks.push('Meta description mismatch detected');
        riskLevel = 'MEDIUM';
    } else {
        benefits.push('Identical meta descriptions');
    }
    
    // Analyze scripts
    if (analysis.assets_comparison.scripts.different_scripts.length > 0) {
        benefits.push(`${analysis.assets_comparison.scripts.different_scripts.length} scripts with updated hashes (normal for builds)`);
    }
    
    if (analysis.assets_comparison.scripts.vercel_only.length > 0) {
        risks.push(`${analysis.assets_comparison.scripts.vercel_only.length} Vercel-only scripts`);
        riskLevel = 'MEDIUM';
    }
    
    if (analysis.assets_comparison.scripts.production_only.length > 0) {
        risks.push(`${analysis.assets_comparison.scripts.production_only.length} Production-only scripts`);
        riskLevel = 'MEDIUM';
    }
    
    // Analyze stylesheets
    if (!analysis.assets_comparison.stylesheets.identical) {
        risks.push('Stylesheet differences detected');
        riskLevel = 'MEDIUM';
    } else {
        benefits.push('Identical stylesheets');
    }
    
    // Analyze images
    if (!analysis.assets_comparison.images.identical) {
        risks.push('Image differences detected');
        riskLevel = 'MEDIUM';
    } else {
        benefits.push('Identical image assets');
    }
    
    // Analyze text content
    if (!analysis.text_content_comparison.identical) {
        risks.push('Text content differences detected');
        riskLevel = 'MEDIUM';
    } else {
        benefits.push('Identical text content');
    }
    
    return {
        risk_level: riskLevel,
        risks: risks,
        benefits: benefits,
        recommendation: risks.length === 0 ? 'SAFE_TO_MIGRATE' : 
                      risks.length <= 2 && riskLevel === 'MEDIUM' ? 'PROCEED_WITH_CAUTION' : 
                      'REVIEW_REQUIRED'
    };
}

// Main analysis function
function performComprehensiveAnalysis() {
    console.log('📊 Loading comparison data...');
    const comparisonData = loadComparisonData();
    
    if (!comparisonData) {
        console.error('❌ Cannot proceed without comparison data');
        return null;
    }
    
    console.log('🔍 Analyzing content differences...');
    const contentAnalysis = analyzeContentDifferences(comparisonData.vercel, comparisonData.production);
    
    console.log('⚖️ Generating risk assessment...');
    const riskAssessment = generateRiskAssessment(contentAnalysis);
    
    const comprehensiveAnalysis = {
        analysis_date: new Date().toISOString(),
        source_data: {
            vercel_url: comparisonData.vercel.url,
            production_url: comparisonData.production.url,
            comparison_timestamp: comparisonData.timestamp
        },
        content_analysis: contentAnalysis,
        risk_assessment: riskAssessment,
        migration_decision: {
            recommended_action: riskAssessment.recommendation,
            confidence_level: riskAssessment.risk_level === 'LOW' ? 'HIGH' : 
                            riskAssessment.risk_level === 'MEDIUM' ? 'MEDIUM' : 'LOW',
            migration_safety: riskAssessment.risks.length === 0 ? 'SAFE' : 
                            riskAssessment.risks.length <= 2 ? 'ACCEPTABLE' : 'RISKY'
        }
    };
    
    return comprehensiveAnalysis;
}

// Execute analysis
const analysis = performComprehensiveAnalysis();

if (analysis) {
    console.log('');
    console.log('==========================================');
    console.log('📊 DEPLOYMENT COMPARISON RESULTS');
    console.log('==========================================');
    
    console.log(`🎯 Migration Recommendation: ${analysis.migration_decision.recommended_action}`);
    console.log(`🔒 Risk Level: ${analysis.risk_assessment.risk_level}`);
    console.log(`💪 Confidence Level: ${analysis.migration_decision.confidence_level}`);
    console.log(`🛡️ Migration Safety: ${analysis.migration_decision.migration_safety}`);
    
    console.log('');
    console.log('📋 Key Findings:');
    console.log(`   📏 Size Difference: ${analysis.content_analysis.size_comparison.difference} bytes (${analysis.content_analysis.size_comparison.percentage_difference}%)`);
    console.log(`   📝 Title Match: ${analysis.content_analysis.metadata_comparison.title_match ? '✅' : '❌'}`);
    console.log(`   📄 Meta Description Match: ${analysis.content_analysis.metadata_comparison.meta_description_match ? '✅' : '❌'}`);
    console.log(`   📜 Scripts: ${analysis.content_analysis.assets_comparison.scripts.identical_scripts.length} identical, ${analysis.content_analysis.assets_comparison.scripts.different_scripts.length} with different hashes`);
    console.log(`   🎨 Stylesheets: ${analysis.content_analysis.assets_comparison.stylesheets.identical ? '✅ Identical' : '❌ Different'}`);
    console.log(`   🖼️ Images: ${analysis.content_analysis.assets_comparison.images.identical ? '✅ Identical' : '❌ Different'}`);
    
    if (analysis.risk_assessment.benefits.length > 0) {
        console.log('');
        console.log('✅ Benefits:');
        analysis.risk_assessment.benefits.forEach(benefit => {
            console.log(`   • ${benefit}`);
        });
    }
    
    if (analysis.risk_assessment.risks.length > 0) {
        console.log('');
        console.log('⚠️ Risks:');
        analysis.risk_assessment.risks.forEach(risk => {
            console.log(`   • ${risk}`);
        });
    }
    
    // Save detailed analysis
    fs.writeFileSync('./DEPLOYMENT_COMPARISON_ANALYSIS.json', JSON.stringify(analysis, null, 2));
    console.log('');
    console.log('📄 Detailed analysis saved: ./DEPLOYMENT_COMPARISON_ANALYSIS.json');
    
    // Create human-readable report
    const report = `# Comprehensive Deployment Comparison Analysis

**Analysis Date:** ${analysis.analysis_date}
**Migration Recommendation:** ${analysis.migration_decision.recommended_action}
**Risk Level:** ${analysis.risk_assessment.risk_level}
**Confidence Level:** ${analysis.migration_decision.confidence_level}

## Executive Summary
${analysis.migration_decision.migration_safety === 'SAFE' ? 
'✅ **SAFE TO MIGRATE** - Deployments are functionally identical with only expected build differences.' :
analysis.migration_decision.migration_safety === 'ACCEPTABLE' ?
'⚠️ **ACCEPTABLE RISK** - Minor differences detected, but migration is safe to proceed.' :
'❌ **HIGH RISK** - Significant differences detected, review required before migration.'}

## Content Analysis

### Size Comparison
- **Vercel:** ${analysis.content_analysis.size_comparison.vercel} bytes
- **Production:** ${analysis.content_analysis.size_comparison.production} bytes
- **Difference:** ${analysis.content_analysis.size_comparison.difference} bytes (${analysis.content_analysis.size_comparison.percentage_difference}%)

### Metadata Comparison
- **Title Match:** ${analysis.content_analysis.metadata_comparison.title_match ? '✅ Identical' : '❌ Different'}
- **Meta Description Match:** ${analysis.content_analysis.metadata_comparison.meta_description_match ? '✅ Identical' : '❌ Different'}

### Assets Comparison
- **Scripts:** ${analysis.content_analysis.assets_comparison.scripts.total_vercel} total, ${analysis.content_analysis.assets_comparison.scripts.identical_scripts.length} identical, ${analysis.content_analysis.assets_comparison.scripts.different_scripts.length} with different hashes
- **Stylesheets:** ${analysis.content_analysis.assets_comparison.stylesheets.identical ? '✅ Identical' : '❌ Different'} (${analysis.content_analysis.assets_comparison.stylesheets.vercel_count} files)
- **Images:** ${analysis.content_analysis.assets_comparison.images.identical ? '✅ Identical' : '❌ Different'} (${analysis.content_analysis.assets_comparison.images.vercel_count} files)

## Risk Assessment

### Benefits
${analysis.risk_assessment.benefits.map(benefit => `- ✅ ${benefit}`).join('\n')}

### Risks
${analysis.risk_assessment.risks.length > 0 ? 
analysis.risk_assessment.risks.map(risk => `- ⚠️ ${risk}`).join('\n') :
'- ✅ No significant risks identified'}

## Migration Decision
**Recommendation:** ${analysis.migration_decision.recommended_action}

${analysis.migration_decision.recommended_action === 'SAFE_TO_MIGRATE' ?
'The analysis confirms that both deployments are functionally identical. The minor script hash differences are normal for Next.js builds and do not affect functionality. Migration can proceed with confidence.' :
analysis.migration_decision.recommended_action === 'PROCEED_WITH_CAUTION' ?
'Minor differences detected but within acceptable parameters. Migration can proceed with standard monitoring.' :
'Significant differences require review before proceeding with migration.'}

**Generated:** ${new Date().toISOString()}
`;
    
    fs.writeFileSync('./DEPLOYMENT_COMPARISON_REPORT.md', report);
    console.log('📋 Human-readable report saved: ./DEPLOYMENT_COMPARISON_REPORT.md');
    
    console.log('');
    console.log('🎉 Comprehensive deployment comparison completed!');
    
    // Exit with appropriate status
    process.exit(analysis.migration_decision.migration_safety === 'SAFE' ? 0 : 1);
} else {
    console.error('❌ Analysis failed');
    process.exit(1);
}
