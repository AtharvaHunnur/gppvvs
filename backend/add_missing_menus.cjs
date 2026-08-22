const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const menusToAdd = [
    { label: 'Admission Open for 2026-27', href: '/admissions', position: 10, isVisible: true },
    { label: 'Gallery', href: '/gallery', position: 11, isVisible: true },
    { label: 'Contact', href: '/contact', position: 12, isVisible: true }
  ];

  for (const m of menusToAdd) {
    const exists = await prisma.menu.findFirst({ where: { href: m.href, parentId: null } });
    if (!exists) {
      await prisma.menu.create({ data: m });
      console.log(`Added ${m.label}`);
    } else {
      console.log(`${m.label} already exists.`);
    }
  }
  
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
