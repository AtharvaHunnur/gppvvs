const fs = require('fs');
const html = fs.readFileSync('about_raw.html', 'utf8');

// Find all image tags
const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
const images = [];
let match;
while ((match = imgRegex.exec(html)) !== null) {
  images.push(match[1]);
}

// Find all paragraphs (or print all text blocks inside the main body/content divs)
// Let's print out parts of the text to understand the layout
const textBlocks = [];
const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
while ((match = pRegex.exec(html)) !== null) {
  textBlocks.push(match[1].replace(/<[^>]+>/g, '').trim());
}

console.log("=== Images ===");
console.log(images);

console.log("\n=== Paragraphs ===");
console.log(textBlocks.filter(t => t.length > 50).slice(0, 15));
