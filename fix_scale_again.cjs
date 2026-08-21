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

    // 1. Fix Buttons (remove w-full on mobile, make extremely compact)
    if (file.endsWith('UI.tsx')) {
        content = content.replace(
            /const baseStyle = "h-auto py-1\.5 px-2\.5 text-\[10px\] sm:text-xs font-semibold rounded-md inline-flex items-center justify-center transition-all w-full sm:w-auto uppercase tracking-wide gap-1";/g,
            'const baseStyle = "h-auto py-1 px-2 text-[9px] sm:text-[10px] md:text-xs font-semibold rounded-md inline-flex items-center justify-center transition-all w-auto uppercase tracking-widest gap-1";'
        );
    }

    // Globally remove `w-full` from buttons specifically causing blowout 
    content = content.replace(/w-full sm:w-auto max-w-xs mx-auto py-2\.5 px-5/g, 'w-auto mx-auto py-1 px-3 text-[10px]');
    content = content.replace(/w-full sm:w-auto/g, 'w-auto');

    // 2. Fix Typography
    // Fix the accidentally huge subtext
    content = content.replace(/text-2xl sm:text-4xl lg:text-5xl text-white\/70/g, 'text-base sm:text-xl lg:text-2xl text-white/70');
    content = content.replace(/text-xl sm:text-3xl lg:text-4xl text-slate-400/g, 'text-sm sm:text-base lg:text-xl text-slate-400');
    
    // Make titles significantly larger on mobile
    content = content.replace(/text-4xl sm:text-6xl lg:text-7xl font-bold/g, 'text-4xl sm:text-6xl lg:text-8xl font-black');
    content = content.replace(/text-3xl sm:text-5xl lg:text-6xl font-bold/g, 'text-3xl sm:text-5xl lg:text-7xl font-black');
    content = content.replace(/text-2xl sm:text-4xl lg:text-5xl font-semibold/g, 'text-2xl sm:text-4xl lg:text-5xl font-bold');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Re-balanced typography and buttons for ${path.basename(file)}`);
    }
});

console.log('Pass completed.');
