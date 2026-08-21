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

    // Fix the bloated INITIATE FORECAST & SYSTEM DIAGNOSTIC buttons
    if (file.endsWith('BusinessPulse.tsx') || file.endsWith('Dashboard.tsx') || file.endsWith('Forecasting.tsx')) {
        content = content.replace(/px-10 py-5 rounded-2xl font-sans uppercase text-\[12px\]/g, 'px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-sans uppercase text-[10px]');
    }

    // Secure Vault Access Banner (mobile bloated size)
    content = content.replace(/py-6 sm:py-12 lg:py-16 px-4 sm:px-8 px-12 md:px-20/g, 'py-4 sm:py-8 lg:py-12 px-4 sm:px-8');
    content = content.replace(/py-12 sm:py-20 px-4 sm:px-12 md:px-20/g, 'py-4 sm:py-8 px-4 sm:px-8');
    content = content.replace(/px-6 py-2 bg-white\/5 backdrop-blur-xl border border-white\/10 rounded-full/g, 'px-3 py-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full');
    content = content.replace(/text-\[12px\] font-sans uppercase tracking-\[0\.4em\]/g, 'text-[10px] font-sans uppercase tracking-[0.2em]');

    // TYPOGRAPHY CHAIN CLEANUP
    // Remove massive corrupted text class chains
    
    // Clean up Titles (h1, h2, h3)
    // Matches something like: className="text-xs sm:text-sm md:text-3xl ... font-serif
    content = content.replace(/className="[^"]*font-black[^"]*text-white[^"]*"/g, (match) => {
        if (match.includes('font-serif') || match.includes('text-white mb-4') || match.includes('tracking-tighter') || match.includes('tracking-tight')) {
            // It's a title!
            return 'className="text-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight text-white mb-4"';
        }
        return match;
    });
    
    content = content.replace(/className="[^"]*font-bold[^"]*text-white[^"]*"/g, (match) => {
        if (match.includes('tracking-tight') && !match.includes('text-sm') && !match.includes('text-xs')) {
            return 'className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4"';
        }
        return match;
    });

    // Clean up subtext / leading-relaxed
    content = content.replace(/className="[^"]*leading-relaxed[^"]*text-slate-400[^"]*"/g, 'className="text-sm sm:text-base text-slate-400 leading-relaxed mb-4"');
    content = content.replace(/className="[^"]*text-white\/70[^"]*leading-relaxed[^"]*italic[^"]*"/g, 'className="text-sm sm:text-base text-white/70 leading-relaxed max-w-3xl italic mb-8"');
    content = content.replace(/className="[^"]*text-white\/50[^"]*leading-relaxed[^"]*"/g, 'className="text-xs sm:text-sm text-white/50 leading-relaxed mb-4"');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Cleaned layout sizes for ${path.basename(file)}`);
    }
});

console.log('Pass completed.');
