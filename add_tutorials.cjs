const fs = require('fs');
const path = require('path');

const targets = [
    {
        file: 'components/Marketing.tsx',
        component: 'export const MarketingStudio = () => {',
        hubId: 'marketing_studio',
        title: 'Marketing Studio',
        desc: 'Central command for all your marketing and branding efforts.',
        steps: ['Access Visual Analysis to audit assets.', 'Use Marketing Creator for quick designs.', 'Generate your Brand Voice Profile.']
    },
    {
        file: 'components/Marketing.tsx',
        component: 'export const BrandVoiceProfile = () => {',
        hubId: 'brand_voice',
        title: 'Brand Voice Profile',
        desc: 'Define and enforce your brands unique tone and style.',
        steps: ['Upload reference materials to train the AI.', 'Select core brand adjectives.', 'Establish restricted vocabulary to avoid off-brand messaging.']
    },
    {
        file: 'components/ProductionWorkflow.tsx',
        component: 'export const ProductionWorkflow: React.FC = () => {',
        hubId: 'manufacturing',
        title: 'Manufacturing Hub',
        desc: 'Oversee and optimize your entire production pipeline.',
        steps: ['View active production batches.', 'Log QA checks and record defect rates.', 'Manage capacity and workstation loads.']
    },
    {
        file: 'components/CRM.tsx',
        component: 'export const CRM = () => {',
        hubId: 'crm',
        title: 'CRM Hub',
        desc: 'Manage your client relationships and sales pipeline.',
        steps: ['Track B2B and B2C clients.', 'Monitor deal stages and revenue probabilities.', 'Send personalized communications.']
    },
    {
        file: 'components/Orders.tsx',
        component: 'export const Orders = () => {',
        hubId: 'orders',
        title: 'Orders Hub',
        desc: 'Fulfill and track customer orders.',
        steps: ['Process incoming orders from all channels.', 'Generate shipping labels and track shipments.', 'Manage returns and refunds.']
    },
    {
        file: 'components/Finance.tsx',
        component: 'export const FinanceHub = () => {',
        hubId: 'finance',
        title: 'Finance & Margins',
        desc: 'Keep a pulse on your profitability and cash flow.',
        steps: ['Review total revenue and expenses.', 'Analyze margin multipliers per product.', 'Forecast cash runway and operational costs.']
    },
    {
        file: 'components/Inventory.tsx',
        component: 'export const Inventory = () => {',
        hubId: 'materials_matrix',
        title: 'Materials Matrix',
        desc: 'Track raw materials and finished goods inventory.',
        steps: ['Monitor stock levels and reorder points.', 'Log raw material usage for production.', 'Adjust inventory counts via cycle counts.']
    },
    {
        file: 'components/Forecasting.tsx',
        component: 'export const Forecasting = () => {',
        hubId: 'forecasting',
        title: 'Forecasting',
        desc: 'Predict demand and optimize purchasing.',
        steps: ['Review AI-generated demand predictions.', 'Plan material purchases based on lead times.', 'Analyze seasonal trends and sales velocity.']
    },
    {
        file: 'components/BusinessPulseCheck.tsx',
        component: 'export const BusinessPulseCheck = () => {',
        hubId: 'trapcast_audit',
        title: 'TrapCast Audit',
        desc: 'Get an instant health check of your entire operation.',
        steps: ['Run a full system diagnostic.', 'Review critical alerts for stockouts or capacity bottlenecks.', 'Action AI recommendations to improve margins.']
    },
    {
        file: 'components/Settings.tsx',
        component: 'export const SubscriptionManagement = () => {',
        hubId: 'subscription_status',
        title: 'Subscription Status',
        desc: 'Manage your ArtisanFlow plan and billing.',
        steps: ['Review your current tier and usage limits.', 'Upgrade to unlock advanced features.', 'Manage payment methods and billing history.']
    },
    {
        file: 'components/Settings.tsx',
        component: 'export const Integrations = () => {',
        hubId: 'integrations',
        title: 'Integrations Hub',
        desc: 'Connect ArtisanFlow to your external tools.',
        steps: ['Link your Shopify or WooCommerce stores.', 'Connect accounting software like QuickBooks.', 'Enable social media channels for auto-posting.']
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

    // Find the component
    const compIndex = content.indexOf(target.component);
    if (compIndex === -1) {
        console.log('Could not find', target.component, 'in', target.file);
        continue;
    }

    // Find the first return ( inside the component
    const returnIndex = content.indexOf('return (', compIndex);
    if (returnIndex === -1) {
        console.log('Could not find return in', target.component);
        continue;
    }
    
    // Find the first > after return (
    const bracketIndex = content.indexOf('>', returnIndex);
    if (bracketIndex === -1) {
        console.log('Could not find bracket in', target.component);
        continue;
    }

    // Insert modalJSX right after the >
    const newContent = content.slice(0, bracketIndex + 1) + modalJSX + content.slice(bracketIndex + 1);
    fs.writeFileSync(target.file, newContent);
    console.log('Updated', target.file, 'for', target.hubId);
}
