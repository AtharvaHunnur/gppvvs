const fs = require('fs');

const html = fs.readFileSync('a:\\Desktop\\gppvvs\\frontend\\home_raw.html', 'utf8');

function extractDropdown(menuName) {
  const index = html.indexOf(`>${menuName}<`);
  if (index === -1) {
    console.log(`Menu ${menuName} not found`);
    return;
  }
  
  // Find the start of the dropdown ul
  const ulStart = html.indexOf('<ul', index);
  const ulEnd = html.indexOf('</ul>', ulStart);
  const ulHtml = html.substring(ulStart, ulEnd + 5);
  
  console.log(`\n--- ${menuName} ---`);
  // Simple regex to get href and text
  const regex = /<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  while ((match = regex.exec(ulHtml)) !== null) {
    const href = match[1].trim();
    const text = match[2].trim();
    console.log(`{ label: "${text}", href: "${href}" },`);
  }
}

extractDropdown('Infrastructure');
extractDropdown('Student Corner');
