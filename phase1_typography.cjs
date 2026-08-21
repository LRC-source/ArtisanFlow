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

    // 1. Display / Hero Title
    content = content.replace(/text-4xl sm:text-5xl lg:text-7xl/g, 'text-2xl sm:text-4xl lg:text-5xl');
    
    // 2. Section Headings
    content = content.replace(/text-2xl sm:text-3xl lg:text-4xl/g, 'text-lg sm:text-2xl lg:text-3xl');
    content = content.replace(/text-xl sm:text-2xl lg:text-3xl/g, 'text-lg sm:text-2xl lg:text-3xl');
    
    // 3. Prevent text shrinking below 14px for body copy on mobile (except badges)
    content = content.replace(/\btext-xs sm:text-sm\b(?!.*badge)(?!.*uppercase)/gi, 'text-sm sm:text-base');
    
    // 4. Ensure badges/micro-captions are at least text-[11px] or text-xs
    content = content.replace(/\btext-\[9px\]\b/g, 'text-[11px]');
    content = content.replace(/\btext-\[10px\]\b/g, 'text-[11px]');
    content = content.replace(/\btext-\[8px\]\b/g, 'text-[11px]');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Typography normalized in ${path.basename(file)}`);
    }
});

console.log('Typography Normalization Completed.');
