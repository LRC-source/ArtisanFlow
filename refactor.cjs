const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'components');
const marketingFile = path.join(srcDir, 'Marketing.tsx');
const settingsFile = path.join(srcDir, 'Settings.tsx');

const marketingDir = path.join(srcDir, 'Marketing');
const settingsDir = path.join(srcDir, 'Settings');

if (!fs.existsSync(marketingDir)) fs.mkdirSync(marketingDir);
if (!fs.existsSync(settingsDir)) fs.mkdirSync(settingsDir);

function splitFile(filePath, outDir, isSettings) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Find all imports
    const importRegex = /import\s+.*?;/gs;
    let importsMatch;
    let imports = [];
    while ((importsMatch = importRegex.exec(content)) !== null) {
        imports.push(importsMatch[0]);
    }
    
    // Adjust relative imports
    imports = imports.map(imp => {
        // change './' to '../'
        return imp.replace(/from\s+['"]\.\/([^'"]+)['"]/g, "from '../$1'")
                  .replace(/from\s+['"]\.\.\/([^'"]+)['"]/g, "from '../../$1'"); // if there was '../', make it '../../'
    });
    
    // add MarketingGrid and HubCard to exports if Marketing, wait, they are not exported
    
    // We can just use a regex to match components
    // A component usually starts with `export const Name = ` or `const Name = `
    // Let's split by `export const ` or `const ` (only at the start of a line)
    
    const parts = content.split(/^(?:export )?const ([A-Z][a-zA-Z0-9_]*) =/gm);
    
    let baseImports = imports.join('\n') + '\n\n';
    
    // Parts: [0] is everything before the first component (imports, etc)
    // [1] is component name, [2] is component body, [3] is next component name, etc.
    
    let components = [];
    let nonExported = {}; // name -> full code
    let exported = {};
    
    for (let i = 1; i < parts.length; i += 2) {
        const name = parts[i];
        let body = parts[i+1];
        
        // Find if it was exported
        const prevIndex = content.indexOf(`const ${name} =`);
        const isExported = content.substring(Math.max(0, prevIndex - 10), prevIndex).includes('export');
        
        const fullCode = (isExported ? 'export ' : '') + `const ${name} =` + body;
        
        if (isExported) {
            exported[name] = fullCode;
        } else {
            nonExported[name] = fullCode;
        }
    }
    
    // Write exported components
    let indexExports = [];
    for (const [name, code] of Object.entries(exported)) {
        let fileContent = baseImports;
        
        // Include non-exported components if they are used in this file
        for (const [nonExName, nonExCode] of Object.entries(nonExported)) {
            if (code.includes(`<${nonExName}`) || code.includes(`${nonExName}(`) || code.includes(`${nonExName} `)) {
                fileContent += nonExCode + '\n\n';
            }
        }
        
        fileContent += code;
        
        fs.writeFileSync(path.join(outDir, `${name}.tsx`), fileContent);
        indexExports.push(`export * from './${name}';`);
    }
    
    fs.writeFileSync(path.join(outDir, 'index.ts'), indexExports.join('\n') + '\n');
}

splitFile(marketingFile, marketingDir, false);
splitFile(settingsFile, settingsDir, true);

// Update App.tsx imports
const appPath = path.join(srcDir, '..', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf-8');
// The imports from './components/Marketing' and './components/Settings' will now resolve to the directories because of index.ts.
// We just need to make sure they are pointing to the directory. If it was './components/Marketing', it's already fine.
// Let's check:
console.log('App.tsx imports Marketing:', appContent.includes('./components/Marketing'));
console.log('App.tsx imports Settings:', appContent.includes('./components/Settings'));

// Remove old files
fs.unlinkSync(marketingFile);
fs.unlinkSync(settingsFile);

console.log('Done.');
