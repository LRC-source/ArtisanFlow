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

    // 1. Fix the broken gap/padding replacements
    content = content.replace(/gap-3\.5 sm:p-5 lg:p-6/g, 'gap-4 sm:gap-6');
    content = content.replace(/p-3\.5 sm:p-6 lg:p-10 md:p-16/g, 'p-4 sm:p-8 lg:p-10');
    content = content.replace(/p-3\.5 sm:p-6 lg:p-10/g, 'p-4 sm:p-6 lg:p-8');
    content = content.replace(/p-3\.5 sm:p-5 lg:p-8/g, 'p-4 sm:p-6 lg:p-8');
    content = content.replace(/p-3\.5 sm:p-5 lg:p-6/g, 'p-4 sm:p-6');
    content = content.replace(/px-4 py-2 sm:px-6 sm:py-3/g, 'px-4 py-2');

    // 2. Fix the corrupted h1/h2/p classes that escaped absolute_clean.cjs
    // <p className={`text-xs sm:text-sm md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl font-serif tracking-tight ${color}`}>{val}</p>
    content = content.replace(/<p className=\{`text-xs sm:text-sm md:text-3xl sm:text-5xl lg:text-7xl font-black sm:text-4xl lg:text-5xl font-serif tracking-tight \$\{([^}]+)\}`\}>/g, '<p className={`text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight ${$1}`}>');
    content = content.replace(/<p className=\{`text-[^`]*font-black[^`]*font-serif[^`]*\$\{([^}]+)\}`\}>/g, '<p className={`text-3xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight ${$1}`}>');

    // Remove double px definitions
    content = content.replace(/px-3 py-1 px-3/g, 'px-3 py-1');
    content = content.replace(/px-6 px-10/g, 'px-6');
    
    // Fix absolute duplicate typography classes left inside <h3
    content = content.replace(/<h3([^>]*)className="([^"]*)font-black font-black([^"]*)"/g, '<h3$1className="$2font-black$3"');

    // Quality Control specifically: reduce the padding of luxury-card on mobile
    content = content.replace(/p-24 flex flex-col items-center/g, 'p-8 sm:p-16 flex flex-col items-center');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Repaired layout corruption in ${path.basename(file)}`);
    }
});

console.log('Pass completed.');
