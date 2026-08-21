const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\lacar\\Desktop\\ArtisanFlow';
const componentsDir = path.join(projectDir, 'components');

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

    // 1. VaultBanner (UI.tsx)
    if (file.endsWith('UI.tsx')) {
        content = content.replace(
            'className={`relative w-full overflow-hidden py-20 px-12 md:px-20', 
            'className={`relative w-full max-w-full overflow-hidden py-12 sm:py-20 px-4 sm:px-12 md:px-20'
        );
    }

    // 2. LandingPage.tsx and Funnels
    if (file.includes('LandingPage.tsx') || file.includes('Funnels')) {
        // Ensure parent containers don't bleed
        content = content.replace(
            'className="relative w-full flex justify-center lg:justify-end items-center z-10 mt-8 lg:mt-0"', 
            'className="relative w-full max-w-full overflow-hidden flex justify-center lg:justify-end items-center z-10 mt-8 lg:mt-0 min-w-0"'
        );
        // Fix object-cover
        content = content.replace(/className="w-full h-auto"/g, 'className="w-full h-full object-cover"');
        content = content.replace(/<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">/g, '<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 w-full max-w-full overflow-hidden">');
    }

    // 3. Layout.tsx header containment
    if (file.endsWith('Layout.tsx')) {
        content = content.replace(
            'className="flex justify-between items-center mb-8 relative z-10"', 
            'className="flex justify-between items-center mb-8 relative z-10 w-full min-w-0 max-w-full"'
        );
    }

    // 4. Global replace of rigid heights for hero/chart/banners
    content = content.replace(/h-\[350px\]/g, 'h-48 sm:h-64 lg:h-80 w-full max-w-full overflow-hidden');
    content = content.replace(/h-\[400px\]/g, 'min-h-[300px] sm:min-h-[400px] h-auto w-full max-w-full overflow-hidden');
    content = content.replace(/h-\[500px\]/g, 'min-h-[300px] sm:min-h-[500px] h-auto aspect-video sm:aspect-auto w-full max-w-full overflow-hidden');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log('Fixed:', path.basename(file));
    }
});
