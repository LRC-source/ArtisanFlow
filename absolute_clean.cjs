const fs = require('fs');
const path = require('path');

const projectDir = 'c:\\Users\\lacar\\Desktop\\ArtisanFlow';
const componentsDir = path.join(projectDir, 'components');

const textSizePattern = /(?:sm:|md:|lg:|xl:|2xl:)?text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+px\])\b/g;

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

    // Clean up h1 tags
    content = content.replace(/<h1([^>]*)className="([^"]*)"/g, (match, before, classString) => {
        let cleanClass = classString.replace(textSizePattern, '').replace(/\s+/g, ' ').trim();
        return `<h1${before}className="text-4xl sm:text-5xl lg:text-7xl ${cleanClass}"`;
    });

    // Clean up h2 tags
    content = content.replace(/<h2([^>]*)className="([^"]*)"/g, (match, before, classString) => {
        let cleanClass = classString.replace(textSizePattern, '').replace(/\s+/g, ' ').trim();
        return `<h2${before}className="text-3xl sm:text-4xl lg:text-5xl ${cleanClass}"`;
    });

    // Clean up h3 tags
    content = content.replace(/<h3([^>]*)className="([^"]*)"/g, (match, before, classString) => {
        let cleanClass = classString.replace(textSizePattern, '').replace(/\s+/g, ' ').trim();
        return `<h3${before}className="text-xl sm:text-2xl lg:text-3xl ${cleanClass}"`;
    });

    // Clean up p tags
    content = content.replace(/<p([^>]*)className="([^"]*)"/g, (match, before, classString) => {
        let cleanClass = classString.replace(textSizePattern, '').replace(/\s+/g, ' ').trim();
        return `<p${before}className="text-sm sm:text-base ${cleanClass}"`;
    });
    
    // Also clean up <span className="... text-white/50"> inside those paragraphs maybe? No, let's leave spans alone unless they are buttons
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Cleaned typography for ${path.basename(file)}`);
    }
});

console.log('Absolute clean pass completed.');
