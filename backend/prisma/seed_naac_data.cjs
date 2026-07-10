const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NAAC criteria and documents...');

  // Create standard criteria
  const criteriaData = [
    { number: 1, title: 'Curricular Aspects', description: 'Curricular Aspects' },
    { number: 2, title: 'Teaching-Learning and Evaluation', description: 'Teaching-Learning and Evaluation' },
    { number: 3, title: 'Research, Innovations and Extension', description: 'Research, Innovations and Extension' },
    { number: 4, title: 'Infrastructure and Learning Resources', description: 'Infrastructure and Learning Resources' },
    { number: 5, title: 'Student Support and Progression', description: 'Student Support and Progression' },
    { number: 6, title: 'Governance, Leadership and Management', description: 'Governance, Leadership and Management' },
    { number: 7, title: 'Institutional Values and Best Practices', description: 'Institutional Values and Best Practices' },
  ];

  for (const c of criteriaData) {
    await prisma.naacCriterion.upsert({
      where: { number: c.number },
      update: { title: c.title, description: c.description },
      create: { number: c.number, title: c.title, description: c.description },
    });
  }
  console.log('Criteria inserted.');

  // Parse HTML for documents
  const html = fs.readFileSync('../frontend/naac_raw.html', 'utf8');
  const tablesRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  
  // Clear existing documents to avoid duplicates
  await prisma.naacDocument.deleteMany({ where: { type: 'OTHER' } });

  while ((match = tablesRegex.exec(html)) !== null) {
    const tableContent = match[1];
    if (tableContent.includes('CRITERION')) {
      // Find which criterion it belongs to by looking at the first digit of the title (e.g. 1.1.1 -> Criterion 1)
      const rows = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
      if (rows) {
        for (let i = 1; i < rows.length; i++) { // Skip header row 0
          const row = rows[i];
          const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
          if (cells && cells.length >= 3) {
            const title = cells[1].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
            
            // Determine criterion number based on title (e.g., "1.1.1 Academic Calender")
            let critNumber = 1; // Default
            const critMatch = title.match(/^(\d)\./);
            if (critMatch) critNumber = parseInt(critMatch[1], 10);
            
            // Extract link
            let link = '#';
            const linkMatch = /href="([^"]+)"/gi.exec(cells[2]);
            if (linkMatch) {
                link = linkMatch[1];
                if (!link.startsWith('http')) link = 'http://gppvvs.ac.in/' + link;
            }

            if (title && link !== '#') {
               const criterion = await prisma.naacCriterion.findUnique({ where: { number: critNumber } });
               if (criterion) {
                   await prisma.naacDocument.create({
                     data: {
                       title: title,
                       fileUrl: link,
                       type: 'OTHER',
                       criterionId: criterion.id
                     }
                   });
               }
            }
          }
        }
      }
    }
  }

  console.log('NAAC documents seeded from old website data.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
