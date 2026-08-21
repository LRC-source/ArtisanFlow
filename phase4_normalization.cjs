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

    // Fix Tables to Phase 4
    content = content.replace(/<table className="w-full text-left/g, '<table className="w-full min-w-[600px] text-left');
    content = content.replace(/<table className="w-full border-collapse/g, '<table className="w-full min-w-[600px] border-collapse');
    
    // Add overflow wrapper to table if missing
    // Simple naive check: if <table is immediately after something else, and no overflow-x-auto nearby.
    // Given the complexity of AST for this, replacing the <table tag with wrapper is safest if we can balance it.
    // The previous pass already added `div className="overflow-x-auto"` in most places.
    
    // Phase 4: Charts
    // Responsive containers should have h-[220px] sm:h-[320px] lg:h-[400px]
    content = content.replace(/h-\[250px\] sm:h-\[350px\]/g, 'h-[220px] sm:h-[320px] lg:h-[400px]');
    content = content.replace(/h-\[250px\] sm:h-\[400px\]/g, 'h-[220px] sm:h-[320px] lg:h-[400px]');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Table and Chart normalizer applied to ${path.basename(file)}`);
    }
});

console.log('Tables and Charts Normalization Completed.');
