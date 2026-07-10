const fs = require('fs');
const html = fs.readFileSync('naac_raw.html', 'utf8');

// Parse criteria tables
const tablesRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
let match;
let tableCount = 0;
while ((match = tablesRegex.exec(html)) !== null) {
  const tableContent = match[1];
  if (tableContent.includes('CRITERION')) {
    console.log(`\n=== Table ${tableCount} ===`);
    const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (rows) {
      rows.forEach((row, i) => {
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (cells) {
          const cleanCells = cells.map(c => c.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' '));
          
          let hasLink = false;
          cells.forEach(c => {
             if (c.includes('href=')) hasLink = true;
          });
          
          console.log(`Row ${i}: ${cleanCells.join(' | ')} (HasLink: ${hasLink})`);
        }
      });
    }
  }
  tableCount++;
}
