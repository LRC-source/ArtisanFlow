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

    // 1. VaultBanner padding (50% reduction)
    if (file.endsWith('UI.tsx')) {
        content = content.replace(
            /className={`relative w-full max-w-full overflow-hidden py-12 sm:py-20 px-4 sm:px-12 md:px-20 rounded-\[3rem\] shadow-\[0_40px_80px_-20px_rgba\(106,44,145,0\.2\)\] \$\{className\}`}/g,
            'className={`relative w-full max-w-full overflow-hidden py-6 sm:py-10 px-2 sm:px-6 md:px-10 rounded-[1.5rem] shadow-[0_20px_40px_-10px_rgba(106,44,145,0.2)] ${className}`}'
        );
        
        // LRCLogo increase size by 25%
        content = content.replace(/size = 168/g, 'size = 210');
    }

    // 2. xLola search bar in Layout.tsx (50% reduction)
    if (file.endsWith('Layout.tsx')) {
        // max-w-xl -> max-w-xs (approx 50% width)
        content = content.replace(/max-w-xl relative group/g, 'max-w-xs relative group');
        
        // input padding
        content = content.replace(
            /py-2 sm:py-3\.5 pl-8 sm:pl-10 pr-10 text-\[10px\] sm:text-xs/g,
            'py-1 sm:py-1.5 pl-6 sm:pl-7 pr-6 text-[8px] sm:text-[10px]'
        );
        
        // Icons in search bar
        content = content.replace(/<Search className="([^"]+)" size=\{14\} \/>/g, '<Search className="$1" size={10} />');
        content = content.replace(/<Loader2 size=\{12\}/g, '<Loader2 size={10}');
        content = content.replace(/<Sparkles size=\{12\}/g, '<Sparkles size={10}');
    }

    // 3. Typography scaling (Title +50%, Subtext = 60-75% of title)
    // First, let's identify standard titles: text-2xl sm:text-4xl lg:text-5xl
    content = content.replace(/text-2xl sm:text-4xl lg:text-5xl font-bold/g, 'text-4xl sm:text-6xl lg:text-7xl font-bold');
    content = content.replace(/text-xl sm:text-3xl lg:text-4xl font-bold/g, 'text-3xl sm:text-5xl lg:text-6xl font-bold');
    
    // Section Titles
    content = content.replace(/text-lg sm:text-2xl lg:text-3xl font-semibold/g, 'text-2xl sm:text-4xl lg:text-5xl font-semibold');

    // Subtext (60-75% of title)
    // If title is text-7xl (72px), subtext should be ~48px (text-5xl)
    // Let's replace subtext classes that are typically under titles.
    content = content.replace(/text-sm sm:text-base text-white\/70/g, 'text-2xl sm:text-4xl lg:text-5xl text-white/70');
    content = content.replace(/text-sm sm:text-base text-slate-400 leading-relaxed/g, 'text-xl sm:text-3xl lg:text-4xl text-slate-400 leading-relaxed');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Applied adjustments for ${path.basename(file)}`);
    }
});

console.log('Scale pass completed.');
