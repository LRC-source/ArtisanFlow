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

    // 1. Completely hide SubPageHeader on mobile
    if (file.endsWith('SubPageHeader.tsx')) {
        content = content.replace(/<div className="mb-12">/, '<div className="hidden sm:block mb-12">');
    }

    // 2. Fix Grid columns missing mobile stacking
    // If it says `grid-cols-2` but lacks `sm:`, it will force 2 columns on mobile.
    // Let's explicitly replace generic grid-cols without breakpoints if they are likely meant for desktop
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgrid-cols-2\b/g, 'grid-cols-1 sm:grid-cols-2');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgrid-cols-3\b/g, 'grid-cols-1 md:grid-cols-3');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgrid-cols-4\b/g, 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4');
    
    // Sometimes there is `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, which is fine, the above negative lookbehind prevents messing with prefixed ones.

    // 3. Fix Flexbox overlapping
    content = content.replace(/className="([^"]*)\bflex items-center justify-between([^"]*)"/g, 'className="$1flex flex-col sm:flex-row items-start sm:items-center justify-between$2"');
    content = content.replace(/className="([^"]*)\bflex justify-between items-center([^"]*)"/g, 'className="$1flex flex-col sm:flex-row justify-between items-start sm:items-center$2"');

    // 4. Reduce oversized paddings on cards/nodes
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-10\b/g, 'p-4 sm:p-10');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-12\b/g, 'p-5 sm:p-12');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-8\b/g, 'p-4 sm:p-8');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-6\b/g, 'p-4 sm:p-6');

    // 5. Shrink large fixed icons or containers that might blow out grids
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-16 h-16\b/g, 'w-10 h-10 sm:w-16 sm:h-16');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-20 h-20\b/g, 'w-12 h-12 sm:w-20 sm:h-20');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-24 h-24\b/g, 'w-14 h-14 sm:w-24 sm:h-24');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Applied mobile layout fixes to ${path.basename(file)}`);
    }
});

console.log('Mobile Layout Pass Completed.');
