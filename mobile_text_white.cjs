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

    // We only want to replace if it's not already prefixed by a responsive breakpoint
    // and if it's inside a className string.
    
    // It's safer to just universally replace these exact color tokens with the responsive white variant
    const replacements = {
        'text-slate-400': 'text-white sm:text-slate-400',
        'text-gray-400': 'text-white sm:text-gray-400',
        'text-gray-300': 'text-white sm:text-gray-300',
        'text-white/70': 'text-white sm:text-white/70',
        'text-white/60': 'text-white sm:text-white/60',
        'text-white/50': 'text-white sm:text-white/50',
        'text-white/40': 'text-white sm:text-white/40'
    };

    for (const [target, replacement] of Object.entries(replacements)) {
        // Negative lookbehind to ensure we aren't replacing something like sm:text-slate-400
        // JavaScript regex supports lookbehind if Node version is modern enough
        const regex = new RegExp(`(?<!sm:|md:|lg:|xl:|2xl:)\\b${target.replace('/', '\\/')}\\b`, 'g');
        content = content.replace(regex, replacement);
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated mobile text colors for ${path.basename(file)}`);
    }
});

console.log('Mobile text color pass completed.');
