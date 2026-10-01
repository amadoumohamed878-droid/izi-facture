const fs = require('fs');

let code = fs.readFileSync('src/app/page.tsx', 'utf8');

// Fix href="#connexion"
code = code.replace(/href="#connexion"/g, 'href="/login"');

// Fix top logo
const newLogoIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
code = code.replace(/<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">.*?<\/svg>/s, newLogoIcon);

// Fix footer logo
const footerLogoIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" stroke="#171717" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
code = code.replace(/<div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white font-bold">⚡<\/div>/s, `<div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center shadow-md shadow-blue-500/20">${footerLogoIcon}</div>`);

// Remove any CR
code = code.replace(/\r/g, '');

fs.writeFileSync('src/app/page.tsx', code);
console.log('Fixed page.tsx');
