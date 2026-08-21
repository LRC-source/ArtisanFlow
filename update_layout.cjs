const fs = require('fs');
const path = require('path');

const layoutFile = path.join('c:\\Users\\lacar\\Desktop\\ArtisanFlow\\components', 'Layout.tsx');
let content = fs.readFileSync(layoutFile, 'utf8');

// 1. Sidebar overlay & drawer logic
content = content.replace(
    /<aside className={`artisan-flow-sidebar z-50 transition-all duration-300 \$\{isMobileMenuOpen \? 'translate-x-0 !flex' : isSidebarCollapsed \? '-translate-x-\[120%\]' : '-translate-x-\[120%\] md:translate-x-0'\} hidden md:flex md:w-64 md:flex-col shrink-0`}>/g,
    '<aside className={`fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] z-50 p-6 shadow-2xl transition-all duration-300 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex md:w-64 md:flex-col shrink-0 artisan-flow-sidebar`}>'
);

// 2. Header Mobile Fixes
content = content.replace(
    /<header className="sticky top-0 z-30 w-full border-b border-white\/10 bg-\[#0d0d0d\]\/80 backdrop-blur-md px-4 sm:px-8 md:px-10 py-3 md:py-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 transition-all duration-500">/g,
    '<header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-md h-14 px-4 md:px-10 flex items-center justify-between gap-4 transition-all duration-500">'
);

// 3. Footer Fixes
content = content.replace(
    /<footer className="w-full py-8 sm:py-16 px-4 sm:px-8 mt-8 border-t border-white\/10 flex flex-col items-center justify-center gap-4 text-xs sm:text-sm text-white sm:text-slate-400 bg-\[#0A0A0A\] z-20">/g,
    '<footer className="w-full py-8 sm:py-16 px-4 sm:px-8 mt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs sm:text-sm text-white/60 bg-[#0A0A0A] z-20">'
);

fs.writeFileSync(layoutFile, content);
console.log('Layout.tsx updated successfully');
