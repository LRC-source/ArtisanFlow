const fs = require('fs');
const path = require('path');

const file = path.join('c:\\Users\\lacar\\Desktop\\ArtisanFlow\\components', 'Inventory.tsx');
let content = fs.readFileSync(file, 'utf8');

// Detail view flex layout overhaul
content = content.replace(/className="flex flex-col md:flex-row justify-between items-start gap-4 sm:gap-6"/g, 'className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6"');
content = content.replace(/className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"/g, 'className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6"');

// Fix text class stacking that causes weird mobile sizes
content = content.replace(/text-sm sm:text-base text-\[12px\]/g, 'text-[12px] sm:text-base');
content = content.replace(/text-sm sm:text-base text-\[11px\]/g, 'text-[11px] sm:text-base');
content = content.replace(/text-sm sm:text-base text-\[10px\]/g, 'text-[10px] sm:text-base');
content = content.replace(/text-sm sm:text-base text-\[9px\]/g, 'text-[9px] sm:text-base');

// Ensure the main Grid doesn't stack too early or too late
content = content.replace(/className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-10"/g, 'className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-10 mt-4 sm:mt-0"');

// Reduce any remaining giant padding
content = content.replace(/p-16 opacity-\[0\.05\]/g, 'p-4 sm:p-16 opacity-[0.05]');
content = content.replace(/p-4 sm:p-12 h-full flex flex-col/g, 'p-6 sm:p-12 h-full flex flex-col');

fs.writeFileSync(file, content);
console.log('Inventory Mobile Layout Refined.');
