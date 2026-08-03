const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const departments = await prisma.department.findMany({
    select: { id: true, name: true, slug: true, program: true, isPublished: true },
    orderBy: { position: 'asc' },
  });
  console.log(`Found ${departments.length} departments:`);
  departments.forEach(d => {
    console.log(`  [${d.isPublished ? 'PUB' : 'DRAFT'}] ${d.program} | ${d.name} | slug: "${d.slug}" | id: ${d.id}`);
  });
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
