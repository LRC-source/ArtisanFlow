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

    // 1. Typography 
    // Ignore existing sm: or lg: prefixes using negative lookbehind
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-6xl/g, 'text-2xl sm:text-4xl lg:text-5xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-7xl/g, 'text-2xl sm:text-4xl lg:text-5xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-5xl/g, 'text-2xl sm:text-4xl lg:text-5xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-4xl/g, 'text-2xl sm:text-4xl lg:text-5xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-3xl/g, 'text-lg sm:text-2xl lg:text-3xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-2xl/g, 'text-lg sm:text-2xl lg:text-3xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)text-xl/g, 'text-base sm:text-lg');

    // 2. Banner and Hero heights & paddings
    content = content.replace(/(?<!sm:|md:|lg:|xl:)py-24/g, 'py-6 sm:py-12 lg:py-16 px-4 sm:px-8');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)py-20/g, 'py-6 sm:py-12 lg:py-16 px-4 sm:px-8');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)py-16/g, 'py-6 sm:py-12 lg:py-16 px-4 sm:px-8');
    content = content.replace(/min-h-\[500px\]/g, 'min-h-0 sm:min-h-[320px] h-auto');
    content = content.replace(/min-h-\[400px\]/g, 'min-h-0 sm:min-h-[320px] h-auto');

    // 3. Component Node / Card Padding & Gaps
    content = content.replace(/(?<!sm:|md:|lg:|xl:)p-8/g, 'p-4 sm:p-5 lg:p-6');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)p-6/g, 'p-3.5 sm:p-5 lg:p-6');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)gap-8/g, 'gap-3 sm:gap-5 lg:gap-6');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)gap-6/g, 'gap-3 sm:gap-5 lg:gap-6');
    
    // Icon sizing reduction (w-16 h-16 or w-14 h-14)
    content = content.replace(/w-16 h-16/g, 'w-8 h-8 sm:w-12 sm:h-12');
    content = content.replace(/w-14 h-14/g, 'w-8 h-8 sm:w-12 sm:h-12');
    content = content.replace(/w-12 h-12/g, 'w-8 h-8 sm:w-10 sm:h-10');

    // 4. Section Margin & Spacing
    content = content.replace(/(?<!sm:|md:|lg:|xl:)space-y-16/g, 'space-y-6 sm:space-y-10 lg:space-y-12');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)space-y-12/g, 'space-y-6 sm:space-y-10 lg:space-y-12');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)mt-24/g, 'mt-8 sm:mt-16 lg:mt-24');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)mt-20/g, 'mt-8 sm:mt-12 lg:mt-20');
    content = content.replace(/(?<!sm:|md:|lg:|xl:)mt-16/g, 'mt-8 sm:mt-12 lg:mt-16');

    // Add max-w-full overflow-x-hidden for root layouts
    if (file.endsWith('Layout.tsx') || file.includes('LandingPage.tsx') || file.includes('Funnel')) {
        content = content.replace(/overflow-hidden/g, 'overflow-x-hidden');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated mobile scaling for ${path.basename(file)}`);
    }
});

console.log('Mobile typography and node component sizing refactor completed.');
