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

    // 1. Chart Resizing for Mobile
    content = content.replace(/<div className="h-72">/g, '<div className="h-[250px] sm:h-[350px] w-full mt-4 sm:mt-0">');
    content = content.replace(/className="h-64"/g, 'className="h-[250px] sm:h-80 w-full"');
    content = content.replace(/<div className="min-h-\[300px\][^>]*>/g, '<div className="h-[250px] sm:h-[400px] w-full mt-4">');

    // 2. Fix the corrupted min-min-h and excessive padding repeats
    content = content.replace(/min-min-h-\[300px\] sm:py-8 sm:py-16 px-4 sm:px-8 sm:min-h-\[320px\] h-auto h-auto/g, 'min-h-[250px] sm:min-h-[300px]');
    content = content.replace(/h-auto h-auto/g, 'h-auto');
    content = content.replace(/gap-4 sm:p-6 lg:p-8/g, 'gap-4 sm:gap-6');
    content = content.replace(/gap-4 sm:p-8/g, 'gap-4 sm:gap-6');
    content = content.replace(/gap-2 sm:p-6 lg:p-8/g, 'gap-2 sm:gap-4');

    // 3. Fix badge lists to flex-wrap instead of hiding scrollbar causing cutoff
    content = content.replace(/className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide"/g, 'className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-10"');
    content = content.replace(/className="flex gap-2 bg-white\/5 p-1\.5 rounded-full border border-white\/10"/g, 'className="flex flex-wrap gap-2 bg-white/5 p-1.5 sm:p-2 rounded-[1rem] sm:rounded-full border border-white/10"');

    // 4. Overhaul cards to use flex-col on mobile
    content = content.replace(/flex flex-col md:flex-row justify-between items-center/g, 'flex flex-col sm:flex-row justify-between items-start sm:items-center');
    content = content.replace(/flex items-center justify-between/g, 'flex flex-col sm:flex-row justify-between items-start sm:items-center');

    // 5. Shrink giant paddings entirely for mobile
    content = content.replace(/p-4 sm:p-12 bg-black\/40/g, 'p-4 sm:p-8 bg-black/40');
    content = content.replace(/p-8 sm:p-16 flex flex-col/g, 'p-6 sm:p-12 flex flex-col');

    // 6. Fix massive inner node spacing (e.g., Historical Synthesis)
    content = content.replace(/<div className="flex flex-col md:items-end">/g, '<div className="flex flex-col items-start sm:items-end">');
    content = content.replace(/<div className="text-right relative z-10 w-full md:w-auto flex items-center gap-4 sm:gap-6 border-t border-white\/5 md:border-0 pt-6 md:pt-0">/g, '<div className="text-left sm:text-right relative z-10 w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-white/5 sm:border-0 pt-4 sm:pt-0">');

    // 7. Specifically target the CRM elements which stack "on top of each other"
    if (file.endsWith('CRM.tsx')) {
        content = content.replace(/flex flex-row gap-4/g, 'flex flex-col sm:flex-row gap-4');
        content = content.replace(/grid grid-cols-2 gap-4/g, 'grid grid-cols-1 sm:grid-cols-2 gap-4');
        content = content.replace(/flex items-center gap-4/g, 'flex flex-col sm:flex-row items-start sm:items-center gap-4');
    }
    
    // 8. Fix Orders & Finance Nodes
    if (file.endsWith('Orders.tsx') || file.endsWith('Finance.tsx') || file.endsWith('MarketingStudio.tsx')) {
        // Find common broken nodes
        content = content.replace(/flex justify-between items-start/g, 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0');
        // Mobile lists
        content = content.replace(/w-24 h-24 rounded-2xl/g, 'w-full sm:w-24 h-48 sm:h-24 rounded-2xl object-cover'); // Example fix for large square images squishing
    }

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Executed deep mobile structural redesign for ${path.basename(file)}`);
    }
});

console.log('Mobile Deep Redesign Completed.');
