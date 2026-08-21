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

    // 1. Revert Typography Fixes
    content = content.replace(/text-2xl sm:text-4xl lg:text-5xl/g, 'text-xl sm:text-3xl lg:text-4xl font-bold');
    content = content.replace(/text-lg sm:text-2xl lg:text-3xl/g, 'text-xl sm:text-3xl lg:text-4xl font-bold');
    content = content.replace(/text-base sm:text-lg/g, 'text-xl sm:text-3xl lg:text-4xl font-bold');

    content = content.replace(/text-xs sm:text-sm md:text-lg/g, 'text-sm sm:text-base leading-relaxed');
    content = content.replace(/text-xs sm:text-base md:text-lg/g, 'text-sm sm:text-base leading-relaxed');
    content = content.replace(/text-xs sm:text-sm text-slate-400/g, 'text-sm sm:text-base text-slate-400 leading-relaxed');
    
    // Also catch some native text-sm / text-xs from previous
    content = content.replace(/text-\[11px\] sm:text-xs text-slate-400/g, 'text-sm sm:text-base text-slate-400 leading-relaxed');
    content = content.replace(/text-\[10px\] sm:text-xs font-semibold uppercase px-2\.5 py-1/g, 'text-sm font-semibold uppercase tracking-wider px-3 py-1.5');
    
    // 2. Fix Button Component Sizing in UI.tsx
    if (file.endsWith('UI.tsx')) {
        content = content.replace(
            /w-full sm:w-auto px-4 py-2\.5 sm:px-6 sm:py-3 text-\[10px\] sm:text-xs md:text-sm font-semibold rounded-full font-sans transition-all duration-500 flex items-center justify-center gap-2 uppercase tracking-\[0\.2em\]/g, 
            'h-auto py-2.5 px-4 sm:py-3 sm:px-6 inline-flex items-center justify-center rounded-lg text-sm sm:text-base font-semibold font-sans transition-all duration-500 gap-2 uppercase tracking-[0.2em]'
        );
    }

    // 3. Remove hardcoded heights globally from buttons
    content = content.replace(/h-10 sm:h-12 md:h-14 w-full sm:w-auto/g, 'w-full sm:w-auto max-w-xs mx-auto py-2.5 px-5');
    content = content.replace(/h-10 sm:h-12 w-full sm:w-auto/g, 'w-full sm:w-auto max-w-xs mx-auto py-2.5 px-5');
    
    // Check for explicit h-12, h-14, h-16 in buttons (basic class removals)
    content = content.replace(/ h-12 /g, ' py-2.5 px-5 ');
    content = content.replace(/ h-14 /g, ' py-2.5 px-5 ');
    content = content.replace(/ h-16 /g, ' py-3 px-6 ');
    content = content.replace(/min-h-\[48px\]/g, 'py-2.5 px-5');

    // Button wrappers inside Banners & Heroes
    content = content.replace(/flex flex-col sm:flex-row items-stretch sm:items-center gap-2\.5 sm:gap-4 w-full sm:w-auto/g, 'flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto');
    content = content.replace(/flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2\.5 sm:gap-4 w-full sm:w-auto/g, 'flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto');
    content = content.replace(/flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2\.5 sm:gap-6 w-full sm:w-auto/g, 'flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto');

    // 4. Remove Fixed Heights on Banner Sections
    content = content.replace(/min-h-[600px]/g, 'py-8 sm:py-16 px-4 sm:px-8');
    content = content.replace(/min-h-[500px]/g, 'py-8 sm:py-16 px-4 sm:px-8');
    content = content.replace(/min-h-[400px]/g, 'py-8 sm:py-16 px-4 sm:px-8');
    content = content.replace(/min-h-[300px]/g, 'py-8 sm:py-16 px-4 sm:px-8');
    
    // Fix fluid bounds if we already converted them
    content = content.replace(/min-h-0 sm:min-h-\[320px\] h-auto/g, 'py-8 sm:py-16 px-4 sm:px-8 h-auto');
    content = content.replace(/h-48 sm:h-64 lg:h-80 w-full max-w-full overflow-hidden/g, 'py-8 sm:py-16 px-4 sm:px-8 w-full max-w-full overflow-hidden');
    content = content.replace(/min-h-\[300px\] sm:min-h-\[400px\] h-auto w-full max-w-full overflow-hidden/g, 'py-8 sm:py-16 px-4 sm:px-8 w-full max-w-full overflow-hidden');
    content = content.replace(/min-h-\[300px\] sm:min-h-\[500px\] h-auto aspect-video sm:aspect-auto w-full max-w-full overflow-hidden/g, 'py-8 sm:py-16 px-4 sm:px-8 w-full max-w-full overflow-hidden');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Reverted typography & button bounds for ${path.basename(file)}`);
    }
});

console.log('Emergency reset pass completed.');
