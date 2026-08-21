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

    // --- PHASE 1: Button Primitive in UI.tsx ---
    if (file.includes('UI.tsx')) {
        // Base style text
        content = content.replace(
            /const baseStyle = "w-full sm:w-auto h-auto py-2\.5 px-4 sm:py-3 sm:px-6 text-sm sm:text-base font-semibold rounded-xl inline-flex items-center justify-center transition-all min-h-\[44px\] gap-2";/g,
            'const baseStyle = "w-full sm:w-auto h-auto min-h-[44px] py-2.5 px-4 sm:py-3 sm:px-6 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl tracking-normal font-semibold text-xs sm:text-sm normal-case sm:uppercase sm:tracking-widest transition-all";'
        );
        // Modal update
        content = content.replace(
            /<div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:relative w-full max-w-lg max-h-\[85vh\] sm:max-h-\[90vh\] overflow-y-auto p-4 sm:p-6 bg-\[#0A0A0A\] border border-white\/10 rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 animate-in zoom-in-95 slide-up-5 duration-700">/g,
            '<div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-[#140d24]/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl sm:rounded-[2.5rem] shadow-2xl z-50 animate-in zoom-in-95 slide-up-5 duration-700">'
        );
    }

    // --- PHASE 2: Card & Node Border-Radius Scaling ---
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\brounded-\[3rem\]\b/g, 'rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem]');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\brounded-\[2\.5rem\]\b/g, 'rounded-2xl sm:rounded-[2.5rem]');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\brounded-\[2rem\]\b/g, 'rounded-2xl sm:rounded-[2rem]');
    
    // Card Padding overrides globally
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-4 sm:p-6 lg:p-8\b/g, 'p-3.5 sm:p-6 lg:p-12');
    
    // Grid Gaps overrides globally
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgap-4 sm:gap-6\b/g, 'gap-3 sm:gap-6');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgap-4\b(?! sm:gap-6)/g, 'gap-3 sm:gap-4');

    // --- PHASE 3: Responsive Typography & Hierarchy Refactor ---
    // Display Titles (Playfair)
    content = content.replace(/\btext-2xl sm:text-4xl lg:text-5xl font-black font-serif tracking-tight\b/g, 'text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight');
    content = content.replace(/\btext-4xl sm:text-5xl lg:text-7xl font-black font-serif tracking-tight\b/g, 'text-xl sm:text-3xl lg:text-5xl font-bold sm:font-black font-serif tracking-tight');
    
    // Section Headings
    content = content.replace(/\btext-xl sm:text-2xl lg:text-3xl font-black\b/g, 'text-base sm:text-xl lg:text-3xl font-bold');
    content = content.replace(/\btext-lg sm:text-2xl lg:text-3xl font-bold\b/g, 'text-base sm:text-xl lg:text-3xl font-bold');

    // Primary Body Copy (Inter)
    content = content.replace(/\btext-sm sm:text-base text-white\/70\b/g, 'text-xs sm:text-sm lg:text-base leading-relaxed text-white/70');
    content = content.replace(/\btext-sm sm:text-base text-white sm:text-white\/70 leading-relaxed\b/g, 'text-xs sm:text-sm lg:text-base leading-relaxed text-white/70');

    // Micro-Copy & Data Labels
    // Finding uppercase tracking logic
    content = content.replace(/\btext-\[11px\] font-sans font-bold uppercase tracking-\[0\.2em\]\b/g, 'text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-normal sm:tracking-[0.2em]');
    content = content.replace(/\btext-\[10px\] font-sans font-bold uppercase tracking-\[0\.3em\]\b/g, 'text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-normal sm:tracking-[0.2em]');
    content = content.replace(/\btext-\[11px\] font-sans font-bold uppercase tracking-\[0\.3em\]\b/g, 'text-[10px] sm:text-xs font-sans font-semibold uppercase tracking-normal sm:tracking-[0.2em]');

    // --- PHASE 4 & 5: Tables, Charts & Footer Compression ---
    // Tables
    content = content.replace(/\bmin-w-\[600px\]\b/g, 'min-w-[550px]');
    
    // Charts
    content = content.replace(/\bh-\[220px\] sm:h-\[320px\] lg:h-\[400px\]\b/g, 'h-[200px] sm:h-[320px] lg:h-[400px]');

    if (file.includes('Layout.tsx')) {
        // Footer section padding and grid
        content = content.replace(/py-8 sm:py-16 px-4 sm:px-8/g, 'py-6 sm:py-12 lg:py-16 px-4 sm:px-8');
        content = content.replace(/grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8/g, 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8');
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Deep Mobile Scale refactored in ${path.basename(file)}`);
    }
});

console.log('Deep Mobile Scale Refactor Completed.');
