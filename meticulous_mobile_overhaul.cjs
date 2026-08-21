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

    // 1. MODALS & POP-UPS (Fixing rigid widths)
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-\[400px\]\b/g, 'w-full sm:w-[400px]');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-\[500px\]\b/g, 'w-full sm:w-[500px]');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-\[600px\]\b/g, 'w-full sm:w-[600px]');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-96\b/g, 'w-full sm:w-96');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bmax-w-3xl\b/g, 'w-full max-w-3xl');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bmax-w-4xl\b/g, 'w-full max-w-4xl');

    // 2. MASSIVE PADDING OVERHAUL (Cleaning up any remaining raw desktop paddings)
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-16\b/g, 'p-6 sm:p-16');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-20\b/g, 'p-6 sm:p-20');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bp-24\b/g, 'p-8 sm:p-24');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpy-16\b/g, 'py-8 sm:py-16');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpy-20\b/g, 'py-8 sm:py-20');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpy-24\b/g, 'py-10 sm:py-24');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpx-16\b/g, 'px-6 sm:px-16');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpx-20\b/g, 'px-6 sm:px-20');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bpx-24\b/g, 'px-8 sm:px-24');

    // 3. FLEX ROW TO COL (Meticulous structural stacking)
    // Looking for explicit flex-row without flex-col
    content = content.replace(/\bflex-row\b(?! sm:flex-row| md:flex-row| lg:flex-row)/g, 'flex-col sm:flex-row');

    // 4. CHART & HEIGHT OVERFLOWS
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bh-96\b/g, 'h-[250px] sm:h-96');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bh-80\b/g, 'h-[200px] sm:h-80');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bh-64\b/g, 'h-[180px] sm:h-64');

    // 5. BUTTONS (Make them stretch on mobile if they are hardcoded width)
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-48\b/g, 'w-full sm:w-48');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bw-64\b/g, 'w-full sm:w-64');

    // 6. Fix overlap in forms/inputs
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgap-8\b/g, 'gap-4 sm:gap-8');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgap-10\b/g, 'gap-4 sm:gap-10');
    content = content.replace(/(?<!sm:|md:|lg:|xl:|2xl:)\bgap-12\b/g, 'gap-6 sm:gap-12');

    // 7. Fix tables spilling without scroll wrapper
    // (This is hard to catch perfectly with regex, but we can look for raw <table> tags without a wrapper)
    // Handled mostly by overflow-x-auto, but we can ensure max-w-full.
    
    // 8. Ensure text wrap
    content = content.replace(/\btext-ellipsis\b/g, 'text-ellipsis overflow-hidden break-words');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Meticulous mobile refactor applied to ${path.basename(file)}`);
    }
});

console.log('Deep Meticulous Mobile Overhaul Completed.');
