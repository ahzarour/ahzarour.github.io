const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'index20.html');

const cssDir = path.join(__dirname, 'assets', 'css');
const jsDir = path.join(__dirname, 'assets', 'js');

if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });

const cssPath = path.join(cssDir, 'style.css');
const jsPath = path.join(jsDir, 'app.js');

let html = fs.readFileSync(htmlPath, 'utf-8');

// 1. Extract and combine all CSS from <style> tags (including inline ones)
let allCss = '';
const styleRegex = /<style>([\s\S]*?)<\/style>/g;
html = html.replace(styleRegex, (match, cssContent) => {
    allCss += cssContent.trim() + '\n\n';
    return ''; // Remove the <style> block from HTML
});

// Insert <link> for CSS in the <head> just before </head>
if (!html.includes('href="assets/css/style.css"')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="assets/css/style.css" />\n</head>');
}

// 2. Extract JS from the <script> tag and replace with external link
const scriptRegex = /<script>([\s\S]*?)<\/script>/;
html = html.replace(scriptRegex, (match, jsContent) => {
    fs.writeFileSync(jsPath, jsContent.trim());
    return '<script src="assets/js/app.js"></script>';
});

// 3. Write the cleaned HTML and consolidated CSS back to disk
fs.writeFileSync(cssPath, allCss.trim());
fs.writeFileSync(htmlPath, html);

console.log('✅ Separation complete!');
console.log('HTML is clean, CSS is in /assets/css/style.css, and JS is in /assets/js/app.js.');