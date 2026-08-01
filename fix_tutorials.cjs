const fs = require('fs');
const path = require('path');

const targets = [
    {
        file: 'components/ProductionWorkflow.tsx',
        component: 'export const ProductionWorkflow = () => {',
        hubId: 'manufacturing',
        title: 'Manufacturing Hub',
        desc: 'Oversee and optimize your entire production pipeline.',
        steps: ['View active production batches.', 'Log QA checks and record defect rates.', 'Manage capacity and workstation loads.']
    },
    {
        file: 'components/Finance.tsx',
        component: 'export const FinanceHub: React.FC = () => {',
        hubId: 'finance',
        title: 'Finance & Margins',
        desc: 'Keep a pulse on your profitability and cash flow.',
        steps: ['Review total revenue and expenses.', 'Analyze margin multipliers per product.', 'Forecast cash runway and operational costs.']
    }
];

for (const target of targets) {
    let content = fs.readFileSync(target.file, 'utf8');
    
    // Add import if missing
    if (!content.includes('ContextualTutorialModal')) {
        content = content.replace(/(import React.*?;\n)/, `$1import { ContextualTutorialModal } from './ContextualTutorialModal';\n`);
    }

    const modalJSX = `
            <ContextualTutorialModal
                hubId="${target.hubId}"
                title="${target.title}"
                description="${target.desc}"
                steps={${JSON.stringify(target.steps)}}
            />`;

    const compIndex = content.indexOf(target.component);
    if (compIndex === -1) {
        console.log('Could not find', target.component, 'in', target.file);
        continue;
    }

    const returnIndex = content.indexOf('return (', compIndex);
    if (returnIndex === -1) continue;
    
    const bracketIndex = content.indexOf('>', returnIndex);
    if (bracketIndex === -1) continue;

    const newContent = content.slice(0, bracketIndex + 1) + modalJSX + content.slice(bracketIndex + 1);
    fs.writeFileSync(target.file, newContent);
    console.log('Updated', target.file, 'for', target.hubId);
}
