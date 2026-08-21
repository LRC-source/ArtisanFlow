const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\lacar\\Desktop\\ArtisanFlow';
const componentsDir = path.join(projectDir, 'components');
const indexHtmlPath = path.join(projectDir, 'index.html');

// 1. Update index.html
let html = fs.readFileSync(indexHtmlPath, 'utf8');
if (!html.includes('maximum-scale=1.0')) {
    html = html.replace(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />'
    );
    fs.writeFileSync(indexHtmlPath, html);
}

// 2. Refactor files
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(componentsDir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    const basename = path.basename(file);

    // Layout.tsx
    if (basename === 'Layout.tsx') {
        content = content.replace('h-screen w-full', 'min-h-dvh w-full overflow-hidden');
        content = content.replace(
            'className={`artisan-flow-sidebar z-50 transition-all duration-300 ${isMobileMenuOpen ? \'translate-x-0\' : isSidebarCollapsed ? \'-translate-x-[120%]\' : \'-translate-x-[120%] md:translate-x-0\'}`}>', 
            'className={`artisan-flow-sidebar z-50 transition-all duration-300 ${isMobileMenuOpen ? \'translate-x-0 !flex\' : isSidebarCollapsed ? \'-translate-x-[120%]\' : \'-translate-x-[120%] md:translate-x-0\'} hidden md:flex md:w-64 md:flex-col shrink-0`}>'
        );
        content = content.replace('className={`flex-1 overflow-auto relative', 'className={`flex-1 min-w-0 w-full min-h-dvh overflow-auto relative');
    }

    // UI.tsx
    if (basename === 'UI.tsx') {
        content = content.replace(/text-sm \$\{props\.className\}/g, 'text-base sm:text-sm ${props.className}');
    }

    // Replace max widths
    const denseViews = ['Operations.tsx', 'Inventory.tsx', 'RecipeBuilder.tsx', 'CRM.tsx', 'Forecasting.tsx', 'SuperAdmin.tsx', 'ProductionScheduler.tsx', 'WarehouseView.tsx'];
    
    if (denseViews.includes(basename)) {
        content = content.replace(/max-w-\[1600px\]/g, 'max-w-[1800px]');
        content = content.replace(/max-w-\[1440px\]/g, 'max-w-[1800px]');
        content = content.replace(/max-w-\[1200px\]/g, 'max-w-[1800px]');
    } else {
        content = content.replace(/max-w-\[1600px\]/g, 'max-w-7xl');
        content = content.replace(/max-w-\[1440px\]/g, 'max-w-7xl');
        content = content.replace(/max-w-\[1200px\]/g, 'max-w-7xl');
    }

    // Table wrapping
    if (content.includes('<table ')) {
        content = content.replace(/<table className="w-full/g, '<table className="w-full min-w-[650px]');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${basename}`);
    }
});

console.log('Refactor completed successfully.');
