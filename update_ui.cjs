const fs = require('fs');
const path = require('path');

const uiFile = path.join('c:\\Users\\lacar\\Desktop\\ArtisanFlow\\components', 'UI.tsx');
let content = fs.readFileSync(uiFile, 'utf8');

// 1. Button Fix
content = content.replace(
    /const baseStyle = "h-auto py-1 px-2 text-\[9px\] sm:text-\[10px\] md:text-xs font-semibold rounded-md inline-flex items-center justify-center transition-all w-auto uppercase tracking-widest gap-1";/g,
    'const baseStyle = "w-full sm:w-auto h-auto py-2.5 px-4 sm:py-3 sm:px-6 text-sm sm:text-base font-semibold rounded-xl inline-flex items-center justify-center transition-all min-h-[44px] gap-2";'
);

// 2. Input Fix
content = content.replace(
    /className={`bg-white\/5 border border-white\/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white\/10 focus:ring-1 focus:ring-\[#6A2C91\]\/40 focus:shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\] transition-all duration-500 placeholder-white\/20 font-medium text-sm sm:text-base lg:text-xl text-white sm:text-slate-400 leading-relaxed sm:text-sm \$\{props\.className\}`} /g,
    'className={`w-full h-10 sm:h-11 px-3.5 text-base sm:text-sm rounded-xl border bg-[#0A0A0A] border-white/10 text-white focus:ring-2 focus:ring-[#C5A059] transition-all outline-none ${props.className}`} '
);

// 3. Select Fix
content = content.replace(
    /className={`bg-white\/5 border border-white\/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white\/10 focus:ring-1 focus:ring-\[#6A2C91\]\/40 focus:shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\] transition-all duration-500 font-medium text-sm appearance-none \$\{props\.className\}`} /g,
    'className={`w-full h-10 sm:h-11 px-3.5 text-base sm:text-sm rounded-xl border bg-[#0A0A0A] border-white/10 text-white focus:ring-2 focus:ring-[#C5A059] transition-all outline-none appearance-none ${props.className}`} '
);

// 4. Modal Fix
content = content.replace(
    /<div className="fixed inset-0 bg-black\/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">/g,
    '<div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-end sm:items-center justify-center sm:p-6 animate-in fade-in duration-500">'
);
content = content.replace(
    /<div className="luxury-card bg-\[#0A0A0A\] border border-white\/10 rounded-\[3rem\] w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 slide-up-5 duration-700">/g,
    '<div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:relative w-full max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-[#0A0A0A] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 animate-in zoom-in-95 slide-up-5 duration-700">'
);

// 5. Card Fix
content = content.replace(
    /className={`luxury-card rounded-\[2rem\] p-4 sm:p-5 lg:p-6 \$\{className\}`}/g,
    'className={`w-full p-4 sm:p-6 lg:p-8 rounded-2xl luxury-card border border-white/10 shadow-sm ${className}`}'
);

fs.writeFileSync(uiFile, content);
console.log('UI.tsx updated successfully');
