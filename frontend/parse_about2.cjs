const fs = require('fs');
const html = fs.readFileSync('about_raw.html', 'utf8');

// Extract all text from div, td, li, span, h1-h6 tags
const textRegex = /<(?:div|td|li|span|h[1-6])[^>]*>([\s\S]*?)<\/(?:div|td|li|span|h[1-6])>/gi;
const texts = [];
let match;
while ((match = textRegex.exec(html)) !== null) {
  const clean = match[1].replace(/<[^>]+>/g, '').trim();
  if (clean.length > 30 && !clean.includes('{') && !clean.includes('function')) {
    texts.push(clean);
  }
}

// Deduplicate
const unique = [...new Set(texts)];
console.log("=== Text Content ===");
unique.forEach((t, i) => console.log(`[${i}] ${t.substring(0, 300)}\n`));

// Also search for the specific content sections
console.log("\n=== Searching for 'History' or 'Vision' or 'Mission' sections ===");
const sectionRegex = /(History|Vision|Mission|About)[^<]*<[\s\S]*?(?=<(?:h[1-6]|section)|$)/gi;
const sections = [];
while ((match = sectionRegex.exec(html)) !== null) {
  sections.push(match[0].replace(/<[^>]+>/g, '').trim().substring(0, 500));
}
sections.forEach((s, i) => console.log(`\n[Section ${i}] ${s}\n`));
